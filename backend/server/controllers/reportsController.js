const reportsService = require('../services/reportsService');
const PDFDocument = require('pdfkit');

/**
 * GET /api/reports/statistics
 * Obtiene estadísticas agregadas de pacientes
 */
const getStatistics = async (req, res) => {
  try {
    const statistics = await reportsService.getStatistics();
    res.json(statistics);
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

/**
 * GET /api/reports/export-pdf
 * Genera y descarga un PDF con las estadísticas
 */
const exportPDF = async (req, res) => {
  try {
    const statistics = await reportsService.getStatistics();

    const doc = new PDFDocument({ 
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=reporte-estadisticas-${Date.now()}.pdf`);

    doc.pipe(res);

    doc.fontSize(20).text('Reporte de Estadísticas', { align: 'center' });
    doc.moveDown(0.5);
    
    doc.fontSize(10).fillColor('#666666').text(
      `Generado: ${new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`,
      { align: 'center' }
    );
    
    doc.fillColor('#000000');
    doc.moveDown(2);

    doc.fontSize(14).text('Resumen General', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    doc.text(`Total de Pacientes: ${statistics.totalPatients}`);
    doc.text(`Edad Promedio: ${statistics.avgAge} años`);
    doc.text(`Total Visitas (últimos 6 meses): ${statistics.patientsByMonth.reduce((acc, m) => acc + m.visitas, 0)}`);
    doc.moveDown(1.5);

    doc.fontSize(14).text('Visitas por Mes', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    
    const tableTop = doc.y;
    const colWidth = 200;
    
    doc.font('Helvetica-Bold');
    doc.text('Mes', 50, tableTop, { width: colWidth, continued: true });
    doc.text('Visitas', { width: colWidth });
    doc.font('Helvetica');
    doc.moveDown(0.3);

    statistics.patientsByMonth.forEach((item, index) => {
      const y = doc.y;
      if (y > 700) {
        doc.addPage();
      }
      doc.text(item.month, 50, doc.y, { width: colWidth, continued: true });
      doc.text(item.visitas.toString(), { width: colWidth });
    });

    doc.moveDown(1.5);

    doc.fontSize(14).text('Distribución por Rango de Edad', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10);
    
    doc.font('Helvetica-Bold');
    doc.text('Rango de Edad', 50, doc.y, { width: colWidth, continued: true });
    doc.text('Cantidad', { width: colWidth });
    doc.font('Helvetica');
    doc.moveDown(0.3);

    statistics.patientsByAge.forEach((item) => {
      const y = doc.y;
      if (y > 700) {
        doc.addPage();
      }
      doc.text(item.rango, 50, doc.y, { width: colWidth, continued: true });
      doc.text(item.cantidad.toString(), { width: colWidth });
    });

    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      doc.fontSize(8).fillColor('#999999').text(
        `Página ${i + 1} de ${pageCount}`,
        50,
        doc.page.height - 30,
        { align: 'center' }
      );
    }

    doc.end();
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    res.status(500).json({
      message: 'Error al generar el PDF',
      error: error.message
    });
  }
};

module.exports = {
  getStatistics,
  exportPDF
};
