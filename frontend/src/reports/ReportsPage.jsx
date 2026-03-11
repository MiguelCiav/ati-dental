import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Button } from '../components';
import { FileDown, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import patientsService from '../services/patientsService';
import { exportChartsToPDF } from '../utils/pdfExport';
import './ReportsPage.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ReportsPage = () => {
  const { t } = useTranslation('common');
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const chartsContainerRef = useRef(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const data = await patientsService.getPatients();
        setPacientes(data);
      } catch (error) {
        console.error('Error al cargar pacientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const processDataForCharts = () => {
    if (!pacientes || pacientes.length === 0) {
      return {
        patientsByMonth: [],
        patientsByAge: [],
        totalPatients: 0,
        avgAge: 0
      };
    }

    const monthData = {};
    const ageGroups = {
      '0-18': 0,
      '19-30': 0,
      '31-50': 0,
      '51-70': 0,
      '70+': 0
    };

    let totalAge = 0;

    pacientes.forEach(patient => {
      if (patient.ultimaVisita) {
        const date = new Date(patient.ultimaVisita);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthData[monthYear] = (monthData[monthYear] || 0) + 1;
      }

      if (patient.edad !== undefined) {
        totalAge += patient.edad;
        if (patient.edad <= 18) ageGroups['0-18']++;
        else if (patient.edad <= 30) ageGroups['19-30']++;
        else if (patient.edad <= 50) ageGroups['31-50']++;
        else if (patient.edad <= 70) ageGroups['51-70']++;
        else ageGroups['70+']++;
      }
    });

    const patientsByMonth = Object.entries(monthData)
      .map(([month, count]) => ({ month, visitas: count }))
      .sort((a, b) => {
        const [ma, ya] = a.month.split('/').map(Number);
        const [mb, yb] = b.month.split('/').map(Number);
        return (ya - yb) || (ma - mb);
      })
      .slice(-6);

    const patientsByAge = Object.entries(ageGroups).map(([rango, cantidad]) => ({
      rango,
      cantidad
    }));

    return {
      patientsByMonth,
      patientsByAge,
      totalPatients: pacientes.length,
      avgAge: pacientes.length > 0 ? Math.round(totalAge / pacientes.length) : 0
    };
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportChartsToPDF(chartsContainerRef.current, 'reporte-estadisticas');
    } catch (error) {
      console.error('Error al exportar PDF:', error);
      alert(t('reports.exportError'));
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7280' }}>
          {t('reports.loading')}
        </div>
      </div>
    );
  }

  const chartData = processDataForCharts();

  return (
    <div className="page-container">
      <div className="page-header page-header-content">
        <div className="page-header-text">
          <h1>{t('reports.title')}</h1>
          <p>{t('reports.subtitle')}</p>
        </div>
        <div className="page-header-actions">
          <Button
            onClick={handleExportPDF}
            disabled={exporting}
            variant="primary"
          >
            <FileDown size={20} />
            {exporting ? t('reports.exporting') : t('reports.exportPDF')}
          </Button>
        </div>
      </div>

      <div className="stats-summary">
        <Card padding="medium">
          <div className="stat-item">
            <div className="stat-value">{chartData.totalPatients}</div>
            <div className="stat-label">{t('reports.totalPatients')}</div>
          </div>
        </Card>
        <Card padding="medium">
          <div className="stat-item">
            <div className="stat-value">{chartData.avgAge}</div>
            <div className="stat-label">{t('reports.avgAge')}</div>
          </div>
        </Card>
        <Card padding="medium">
          <div className="stat-item">
            <div className="stat-value">{chartData.patientsByMonth.reduce((acc, m) => acc + m.visitas, 0)}</div>
            <div className="stat-label">{t('reports.visitsLast6Months')}</div>
          </div>
        </Card>
      </div>

      <div ref={chartsContainerRef} className="charts-container">
        <Card padding="medium">
          <div className="chart-header">
            <h2>{t('reports.visitsByMonth')}</h2>
            <TrendingUp size={24} />
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.patientsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="visitas" stroke="#0088FE" strokeWidth={2} name={t('reports.visits')} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="medium">
          <div className="chart-header">
            <h2>{t('reports.patientsByAgeRange')}</h2>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.patientsByAge}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rango" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#00C49F" name={t('reports.quantity')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default ReportsPage;
