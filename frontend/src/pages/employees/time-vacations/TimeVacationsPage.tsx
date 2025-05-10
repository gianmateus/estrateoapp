import React, { useState, useEffect } from 'react';
import { Box, Typography, Tab, Tabs, Container, Breadcrumbs, Link } from '@mui/material';
import { AccessTime as AccessTimeIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import TimeVacationsTable from './TimeVacationsTable';
import CalendarView from './CalendarView';
import AddVacationModal from './AddVacationModal';
import AddAbsenceModal from './AddAbsenceModal';
import ExportReportButton from './ExportReportButton';

// Interface para os dados de presença
export interface AttendanceData {
  id: string;
  employeeId: string;
  employeeName: string;
  daysWorked: number;
  hoursWorked: number;
  absences: number;
  vacations: number;
  timeOff: number;
  month: number;
  year: number;
}

// Interface para detalhes diários
export interface DailyDetail {
  id: string;
  employeeId: string;
  date: string; // formato ISO 8601
  status: 'presente' | 'ausente' | 'ferias' | 'folga';
  startTime?: string;
  endTime?: string;
  hoursWorked?: number;
  reason?: string;
}

const TimeVacationsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceData[]>([]);
  const [dailyDetails, setDailyDetails] = useState<DailyDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [vacationModalOpen, setVacationModalOpen] = useState(false);
  const [absenceModalOpen, setAbsenceModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  
  // Filtros
  const [monthYear, setMonthYear] = useState<{month: number, year: number}>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [employeeFilter, setEmployeeFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');

  // Mock de dados para exemplo
  const mockAttendanceData: AttendanceData[] = [
    {
      id: '1',
      employeeId: '1',
      employeeName: 'João Silva',
      daysWorked: 20,
      hoursWorked: 160,
      absences: 2,
      vacations: 0,
      timeOff: 1,
      month: 4,
      year: 2025
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'Maria Santos',
      daysWorked: 22,
      hoursWorked: 176,
      absences: 0,
      vacations: 0,
      timeOff: 0,
      month: 4,
      year: 2025
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Pedro Oliveira',
      daysWorked: 15,
      hoursWorked: 120,
      absences: 0,
      vacations: 7,
      timeOff: 0,
      month: 4,
      year: 2025
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: 'Ana Costa',
      daysWorked: 21,
      hoursWorked: 168,
      absences: 1,
      vacations: 0,
      timeOff: 1,
      month: 4,
      year: 2025
    }
  ];

  // Mock de detalhes diários
  const mockDailyDetails: DailyDetail[] = [
    ...Array.from({ length: 23 }, (_, index) => ({
      id: `${index+1}`,
      employeeId: '1',
      date: `2025-04-${index+1 < 10 ? `0${index+1}` : index+1}`,
      status: 'presente' as const,
      startTime: '08:00',
      endTime: '17:00',
      hoursWorked: 8
    })),
    {
      id: '24',
      employeeId: '1',
      date: '2025-04-24',
      status: 'ausente' as const,
      reason: 'Consulta médica'
    },
    {
      id: '25',
      employeeId: '1',
      date: '2025-04-25',
      status: 'ausente' as const,
      reason: 'Doença'
    },
    {
      id: '26',
      employeeId: '1',
      date: '2025-04-26',
      status: 'folga' as const,
      reason: 'Folga compensatória'
    },
    {
      id: '27',
      employeeId: '1',
      date: '2025-04-27',
      status: 'presente' as const,
      startTime: '08:00',
      endTime: '17:00',
      hoursWorked: 8
    },
    {
      id: '28',
      employeeId: '1',
      date: '2025-04-28',
      status: 'presente' as const,
      startTime: '08:00',
      endTime: '17:00',
      hoursWorked: 8
    },
    {
      id: '29',
      employeeId: '1',
      date: '2025-04-29',
      status: 'presente' as const,
      startTime: '08:00',
      endTime: '17:00',
      hoursWorked: 8
    },
    {
      id: '30',
      employeeId: '1',
      date: '2025-04-30',
      status: 'presente' as const,
      startTime: '08:00',
      endTime: '17:00',
      hoursWorked: 8
    }
  ];

  // Buscar dados
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulação de chamada à API
        await new Promise(resolve => setTimeout(resolve, 800));
        setAttendanceData(mockAttendanceData);
        setDailyDetails(mockDailyDetails);
      } catch (error) {
        console.error('Erro ao buscar dados de presença:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Atualizar dados filtrados
  useEffect(() => {
    let filtered = [...attendanceData];
    
    // Filtrar por mês e ano
    filtered = filtered.filter(a => 
      a.month === monthYear.month && a.year === monthYear.year
    );
    
    // Filtrar por funcionário
    if (employeeFilter) {
      filtered = filtered.filter(a => 
        a.employeeName.toLowerCase().includes(employeeFilter.toLowerCase())
      );
    }
    
    // Filtrar por departamento (a ser implementado)
    
    setFilteredData(filtered);
  }, [attendanceData, monthYear, employeeFilter, departmentFilter]);

  // Manipulador para mudança de aba
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Manipulador para abrir modal de férias
  const handleAddVacation = (employeeId?: string) => {
    if (employeeId) {
      setSelectedEmployee(employeeId);
    } else {
      setSelectedEmployee(null);
    }
    setVacationModalOpen(true);
  };

  // Manipulador para abrir modal de ausência/folga
  const handleAddAbsence = (employeeId?: string) => {
    if (employeeId) {
      setSelectedEmployee(employeeId);
    } else {
      setSelectedEmployee(null);
    }
    setAbsenceModalOpen(true);
  };

  // Manipulador para salvar férias
  const handleSaveVacation = (data: any) => {
    // Implementar lógica para salvar férias
    console.log('Férias salvas:', data);
    setVacationModalOpen(false);
  };

  // Manipulador para salvar ausência/folga
  const handleSaveAbsence = (data: any) => {
    // Implementar lógica para salvar ausência/folga
    console.log('Ausência/folga salva:', data);
    setAbsenceModalOpen(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" />} 
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          <Link 
            color="inherit" 
            onClick={() => navigate('/dashboard')}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            {t('dashboardObj.title')}
          </Link>
          <Link 
            color="inherit" 
            onClick={() => navigate('/dashboard/funcionarios')}
            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          >
            {t('funcionarios')}
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ mr: 0.5, fontSize: '1.1rem' }} />
            {t('tempoFerias')}
          </Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {t('timeAndVacations')}
          </Typography>
        </Box>

        <Box sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            textColor="primary"
            indicatorColor="primary"
            aria-label="attendance tabs"
          >
            <Tab label={t('tabela')} />
            <Tab label={t('calendario')} />
          </Tabs>

          <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" sx={{ mt: 2 }}>
            {tabValue === 0 && (
              <>
                <TimeVacationsTable
                  data={filteredData}
                  loading={loading}
                  monthYear={monthYear}
                  setMonthYear={setMonthYear}
                  employeeFilter={employeeFilter}
                  setEmployeeFilter={setEmployeeFilter}
                  onAddVacation={handleAddVacation}
                  onAddAbsence={handleAddAbsence}
                />
                <ExportReportButton data={filteredData} monthYear={monthYear} />
              </>
            )}
          </Box>

          <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" sx={{ mt: 2 }}>
            {tabValue === 1 && (
              <CalendarView
                dailyDetails={dailyDetails}
                monthYear={monthYear}
                setMonthYear={setMonthYear}
                employeeFilter={employeeFilter}
                setEmployeeFilter={setEmployeeFilter}
                onAddVacation={handleAddVacation}
                onAddAbsence={handleAddAbsence}
              />
            )}
          </Box>
        </Box>

        <AddVacationModal
          open={vacationModalOpen}
          onClose={() => setVacationModalOpen(false)}
          onSave={handleSaveVacation}
          selectedEmployeeId={selectedEmployee}
        />

        <AddAbsenceModal
          open={absenceModalOpen}
          onClose={() => setAbsenceModalOpen(false)}
          onSave={handleSaveAbsence}
          selectedEmployeeId={selectedEmployee}
        />
      </Box>
    </Container>
  );
};

export default TimeVacationsPage; 