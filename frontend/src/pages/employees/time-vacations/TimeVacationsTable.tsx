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
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  CalendarMonth as CalendarIcon,
  AccessTime as ClockIcon,
  EventBusy as AbsenceIcon,
  BeachAccess as VacationIcon,
  Weekend as TimeOffIcon
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

  return (
    <Box sx={{ width: '100%' }}>
      {/* Filtros e botões de ação */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              views={['month', 'year']}
              label={t('meseAno')}
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
            placeholder={String(t('filtrarPorFuncionario'))}
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
            <Button
              variant="outlined"
              startIcon={<VacationIcon />}
              onClick={handleAddVacation}
              size="small"
            >
              {t('adicionarFerias')}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<TimeOffIcon />}
              onClick={handleAddTimeOff}
              size="small"
            >
              {t('registrarFolga')}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<AbsenceIcon />}
              onClick={handleAddAbsence}
              size="small"
            >
              {t('registrarAusencia')}
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      {/* Tabela */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('funcionario')}</TableCell>
              <TableCell align="center">
                <Tooltip title={t('diasTrabalhadosNoMes')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {t('diasTrabalhados')}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={t('horasTrabalhadasNoMes')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ClockIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {t('horasTrabalhadas')}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={t('ausenciasNoMes')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AbsenceIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {t('ausencias')}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={t('feriasNoMes')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <VacationIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {t('ferias')}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="center">
                <Tooltip title={t('folgasNoMes')}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TimeOffIcon fontSize="small" sx={{ mr: 0.5 }} />
                    {t('folgas')}
                  </Box>
                </Tooltip>
              </TableCell>
              <TableCell align="center">{t('acoes')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('nenhumRegistroEncontrado')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.employeeName}</TableCell>
                  <TableCell align="center">{row.daysWorked} {t('dias')}</TableCell>
                  <TableCell align="center">{row.hoursWorked}h</TableCell>
                  <TableCell align="center">
                    {row.absences > 0 ? (
                      <Typography variant="body2" color="error">
                        {row.absences} {t('dias')}
                      </Typography>
                    ) : (
                      `${row.absences} ${t('dias')}`
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {row.vacations > 0 ? (
                      <Typography variant="body2" color="primary">
                        {row.vacations} {t('dias')}
                      </Typography>
                    ) : (
                      `${row.vacations} ${t('dias')}`
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {row.timeOff > 0 ? (
                      <Typography variant="body2" color="warning.main">
                        {row.timeOff} {t('dias')}
                      </Typography>
                    ) : (
                      `${row.timeOff} ${t('dias')}`
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Tooltip title={t('editar')}>
                        <IconButton size="small">
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('adicionarFerias')}>
                        <IconButton 
                          size="small" 
                          onClick={() => onAddVacation(row.employeeId)}
                        >
                          <VacationIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('registrarAusenciaOuFolga')}>
                        <IconButton 
                          size="small"
                          onClick={() => onAddAbsence(row.employeeId)}
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