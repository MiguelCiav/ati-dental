import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exporta los gráficos a PDF con alta fidelidad
 * @param {HTMLElement} containerElement - Elemento contenedor de los gráficos
 * @param {string} filename - Nombre del archivo PDF (sin extensión)
 */
export const exportChartsToPDF = async (containerElement, filename = 'reporte') => {
  if (!containerElement) {
    throw new Error('No se encontró el contenedor de gráficos');
  }

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  const title = 'Reporte de Estadísticas';
  const subtitle = `Generado: ${new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`;

  pdf.setFontSize(20);
  pdf.text(title, pageWidth / 2, margin + 10, { align: 'center' });
  
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(subtitle, pageWidth / 2, margin + 18, { align: 'center' });
  
  pdf.setTextColor(0);

  let yOffset = margin + 30;

  const statsCards = containerElement.querySelectorAll('.stats-summary .stat-item');
  if (statsCards.length > 0) {
    pdf.setFontSize(12);
    pdf.text('Resumen General', margin, yOffset);
    yOffset += 8;

    statsCards.forEach((card, index) => {
      const value = card.querySelector('.stat-value')?.textContent || '';
      const label = card.querySelector('.stat-label')?.textContent || '';
      
      const xPos = margin + (index * (contentWidth / 3));
      pdf.setFontSize(16);
      pdf.text(value, xPos + 30, yOffset, { align: 'center' });
      pdf.setFontSize(9);
      pdf.text(label, xPos + 30, yOffset + 6, { align: 'center' });
    });

    yOffset += 20;
  }

  const charts = containerElement.querySelectorAll('.chart-wrapper');
  
  for (let i = 0; i < charts.length; i++) {
    const chart = charts[i];
    const chartCard = chart.closest('.card');
    const chartTitle = chartCard?.querySelector('.chart-header h2')?.textContent || `Gráfico ${i + 1}`;

    if (yOffset > pageHeight - 100 && i > 0) {
      pdf.addPage();
      yOffset = margin + 10;
    }

    pdf.setFontSize(14);
    pdf.text(chartTitle, margin, yOffset);
    yOffset += 8;

    const canvas = await html2canvas(chart, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    if (yOffset + imgHeight > pageHeight - margin) {
      pdf.addPage();
      yOffset = margin + 10;
      pdf.setFontSize(14);
      pdf.text(chartTitle, margin, yOffset);
      yOffset += 8;
    }

    pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight);
    yOffset += imgHeight + 15;
  }

  const pageCount = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text(
      `Página ${i} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  pdf.save(`${filename}-${Date.now()}.pdf`);
};
