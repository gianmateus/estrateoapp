import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Grid,
  Typography,
  CircularProgress,
  Chip
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as ClockIcon,
  EventBusy as AbsenceIcon,
  BeachAccess as VacationIcon,
  Weekend as TimeOffIcon,
  CalendarMonthOutlined,
  WorkOffOutlined,
  EventBusyOutlined
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { AttendanceData } from './TimeVacationsPage';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';

interface TimeVacationsTableProps {
  data: AttendanceData[];
  loading: boolean;
  monthYear: { month: number; year: number };
  setMonthYear: React.Dispatch<React.SetStateAction<{ month: number; year: number }>>;
  employeeFilter: string;
  setEmployeeFilter: React.Dispatch<React.SetStateAction<string>>;
  onAddVacation: (employeeId?: string) => void;
  onAddAbsence: (employeeId?: string) => void;
}

// Configuração dos botões de ação para evitar duplicação de código
interface ActionButton {
  icon: React.ReactNode;
  label: string;
  tooltipText: string;
  onClick: () => void;
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
}

const TimeVacationsTable: React.FC<TimeVacationsTableProps> = ({
  data,
  loading,
  monthYear,
  setMonthYear,
  employeeFilter,
  setEmployeeFilter,
  onAddVacation,
  onAddAbsence
}) => {
  const { t } = useTranslation();
  
  // Handlers
  const handleDateChange = (newValue: unknown) => {
    if (newValue instanceof Date) {
      setMonthYear({
        month: newValue.getMonth() + 1,
        year: newValue.getFullYear()
      });
    }
  };
  
  // Actions
  const handleAddVacation = () => {
    onAddVacation();
  };
  
  const handleAddTimeOff = () => {
    onAddAbsence();
  };
  
  const handleAddAbsence = () => {
    onAddAbsence();
  };
  
  // Calcular data para exibição
  const getDateForPicker = () => {
    const date = new Date();
    date.setMonth(monthYear.month - 1);
    date.setFullYear(monthYear.year);
    return date;
  };

  // Array de ações para os botões
  const actionButtons: ActionButton[] = [
    {
      icon: <CalendarMonthOutlined />,
      label: t('tempo.button.registrarFerias'),
      tooltipText: t('tempo.tooltip.registrarFerias'),
      onClick: handleAddVacation
    },
    {
      icon: <WorkOffOutlined />,
      label: t('tempo.button.registrarFolga'),
      tooltipText: t('tempo.tooltip.registrarFolga'),
      onClick: handleAddTimeOff
    },
    {
      icon: <EventBusyOutlined />,
      label: t('tempo.button.registrarAusencia'),
      tooltipText: t('tempo.tooltip.registrarAusencia'),
      onClick: handleAddAbsence
    }
  ];

  // Renderizar status do funcionário
  const renderStatusChips = (row: AttendanceData) => {
    const chips = [];
    
    if (row.vacations > 0) {
      chips.push(
        <Chip 
          key="ferias"
          label={t('tempo.label.ferias')}
          size="small"
          color="primary"
          sx={{ mr: 0.5 }}
        />
      );
    }
    
    if (row.absences > 0) {
      chips.push(
        <Chip 
          key="ausencias"
          label={t('tempo.label.ausencias')}
          size="small"
          color="warning"
          sx={{ mr: 0.5 }}
        />
      );
    }
    
    if (row.timeOff > 0) {
      chips.push(
        <Chip 
          key="folgas"
          label={t('tempo.label.folgas')}
          size="small"
          color="success"
        />
      );
    }
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 0.5 }}>
        {chips}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Filtros e botões de ação */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              views={['month', 'year']}
              label={t('tempo.label.mesAno')}
              value={getDateForPicker()}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  variant: 'outlined',
                  size: 'small'
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            placeholder={String(t('tempo.placeholder.filtrarPorFuncionario'))}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            {actionButtons.map((button, index) => (
              <Tooltip key={index} title={button.tooltipText}>
                <Button
                  variant="outlined"
                  startIcon={button.icon}
                  onClick={button.onClick}
                  size="small"
                  color={button.color}
                >
                  {button.label}
                </Button>
              </Tooltip>
            ))}
          </Box>
        </Grid>
      </Grid>
      
      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('tempo.label.funcionario')}</TableCell>
              <TableCell align="center">
                <Tooltip title={t('tempo.tooltip.diasTrabalhados')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {t('tempo.label.diasTrabalhados')}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={t('tempo.tooltip.horasTrabalhadas')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ClockIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {t('tempo.label.horasTrabalhadas')}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={t('tempo.tooltip.ausencias')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AbsenceIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {t('tempo.label.ausencias')}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={t('tempo.tooltip.ferias')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <VacationIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {t('tempo.label.ferias')}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={t('tempo.tooltip.folgas')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TimeOffIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {t('tempo.label.folgas')}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="center">{t('tempo.label.status')}</TableCell>
              <TableCell align="center">{t('tempo.label.acoes')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('tempo.mensagem.nenhumRegistroEncontrado')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.employeeName}</TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="medium">
                      {row.daysWorked} {t('tempo.label.dias')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight="medium">
                      {row.hoursWorked}h
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography 
                      variant="body2" 
                      fontWeight="medium"
                      color={row.absences > 0 ? "error" : "text.primary"}
                    >
                      {row.absences} {t('tempo.label.dias')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography 
                      variant="body2" 
                      fontWeight="medium"
                      color={row.vacations > 0 ? "primary" : "text.primary"}
                    >
                      {row.vacations} {t('tempo.label.dias')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography 
                      variant="body2" 
                      fontWeight="medium"
                      color={row.timeOff > 0 ? "success.main" : "text.primary"}
                    >
                      {row.timeOff} {t('tempo.label.dias')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {renderStatusChips(row)}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Tooltip title={t('tempo.tooltip.editar')}>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('tempo.tooltip.registrarFerias')}>
                        <IconButton 
                          size="small" 
                          onClick={() => onAddVacation(row.employeeId)}
                          color="primary"
                        >
                          <VacationIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('tempo.tooltip.registrarAusencia')}>
                        <IconButton 
                          size="small"
                          onClick={() => onAddAbsence(row.employeeId)}
                          color="warning"
                        >
                          <AbsenceIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TimeVacationsTable; 