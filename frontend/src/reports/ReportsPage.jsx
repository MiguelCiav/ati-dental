import { useState, useEffect, useRef } from 'react';
import { Card, Button } from '../components';
import { FileDown, TrendingUp } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import patientsService from '../services/patientsService';
import { exportChartsToPDF } from '../utils/pdfExport';
import './ReportsPage.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ReportsPage = () => {
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
        patientsByGender: [],
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
    const genderData = {
      'Masculino': 0,
      'Femenino': 0,
      'Otro': 0
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

      if (patient.genero) {
        genderData[patient.genero] = (genderData[patient.genero] || 0) + 1;
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

    const patientsByGender = Object.entries(genderData)
      .filter(([_, count]) => count > 0)
      .map(([genero, cantidad]) => ({ genero, cantidad }));

    return {
      patientsByMonth,
      patientsByAge,
      patientsByGender,
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
      alert('Error al exportar el PDF. Por favor, intenta nuevamente.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#6b7280' }}>
          Cargando reportes...
        </div>
      </div>
    );
  }

  const chartData = processDataForCharts();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Reportes y Estadísticas</h1>
          <p>Visualiza métricas y estadísticas de los pacientes del consultorio.</p>
        </div>
        <Button
          onClick={handleExportPDF}
          disabled={exporting}
          variant="primary"
        >
          <FileDown size={20} />
          {exporting ? 'Exportando...' : 'Exportar a PDF'}
        </Button>
      </div>

      <div className="stats-summary">
        <Card padding="medium">
          <div className="stat-item">
            <div className="stat-value">{chartData.totalPatients}</div>
            <div className="stat-label">Total Pacientes</div>
          </div>
        </Card>
        <Card padding="medium">
          <div className="stat-item">
            <div className="stat-value">{chartData.avgAge}</div>
            <div className="stat-label">Edad Promedio</div>
          </div>
        </Card>
        <Card padding="medium">
          <div className="stat-item">
            <div className="stat-value">{chartData.patientsByMonth.reduce((acc, m) => acc + m.visitas, 0)}</div>
            <div className="stat-label">Visitas (6 meses)</div>
          </div>
        </Card>
      </div>

      <div ref={chartsContainerRef} className="charts-container">
        <Card padding="medium">
          <div className="chart-header">
            <h2>Visitas por Mes</h2>
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
                <Line type="monotone" dataKey="visitas" stroke="#0088FE" strokeWidth={2} name="Visitas" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="medium">
          <div className="chart-header">
            <h2>Pacientes por Rango de Edad</h2>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.patientsByAge}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rango" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="cantidad" fill="#00C49F" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default ReportsPage;
