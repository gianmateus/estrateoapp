import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Search as SearchIcon,
  BeachAccess as VacationIcon,
  EventBusy as AbsenceIcon,
  Weekend as TimeOffIcon,
  Event as EventIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { DailyDetail } from './TimeVacationsPage';

interface CalendarViewProps {
  dailyDetails: DailyDetail[];
  monthYear: { month: number; year: number };
  setMonthYear: React.Dispatch<React.SetStateAction<{ month: number; year: number }>>;
  employeeFilter: string;
  setEmployeeFilter: React.Dispatch<React.SetStateAction<string>>;
  onAddVacation: (employeeId?: string) => void;
  onAddAbsence: (employeeId?: string) => void;
}

interface CalendarDay {
  date: Date;
  currentMonth: boolean;
  details?: DailyDetail;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  dailyDetails,
  monthYear,
  setMonthYear,
  employeeFilter,
  setEmployeeFilter,
  onAddVacation,
  onAddAbsence
}) => {
  const { t } = useTranslation();
  const [calendar, setCalendar] = useState<CalendarDay[][]>([]);
  const [selectedDay, setSelectedDay] = useState<DailyDetail | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  
  // Gerar calendário
  useEffect(() => {
    const generateCalendar = () => {
      const year = monthYear.year;
      const month = monthYear.month - 1; // Ajuste para que Janeiro seja 0
      
      // Primeiro dia do mês
      const firstDay = new Date(year, month, 1);
      
      // Último dia do mês
      const lastDay = new Date(year, month + 1, 0);
      
      // Dia da semana do primeiro dia (0 = Domingo, 1 = Segunda, etc.)
      const firstDayOfWeek = firstDay.getDay();
      
      // Total de dias no mês
      const daysInMonth = lastDay.getDate();
      
      // Array para armazenar todos os dias que serão exibidos
      const days: CalendarDay[] = [];
      
      // Dias do mês anterior
      const prevMonth = new Date(year, month, 0);
      const prevMonthDays = prevMonth.getDate();
      
      for (let i = 0; i < firstDayOfWeek; i++) {
        const day = prevMonthDays - firstDayOfWeek + i + 1;
        days.push({
          date: new Date(year, month - 1, day),
          currentMonth: false
        });
      }
      
      // Dias do mês atual
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];
        
        // Encontrar detalhes para este dia
        const details = dailyDetails.find(detail => 
          detail.date.substring(0, 10) === dateString
        );
        
        days.push({
          date,
          currentMonth: true,
          details
        });
      }
      
      // Dias do próximo mês
      const remainingCells = 7 - (days.length % 7);
      if (remainingCells < 7) {
        for (let day = 1; day <= remainingCells; day++) {
          days.push({
            date: new Date(year, month + 1, day),
            currentMonth: false
          });
        }
      }
      
      // Dividir em linhas de 7 dias (semanas)
      const weeks: CalendarDay[][] = [];
      for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
      }
      
      return weeks;
    };
    
    setCalendar(generateCalendar());
  }, [monthYear, dailyDetails]);
  
  // Manipuladores
  const handleDateChange = (newValue: unknown) => {
    if (newValue instanceof Date) {
      setMonthYear({
        month: newValue.getMonth() + 1,
        year: newValue.getFullYear()
      });
    }
  };
  
  const handleDayClick = (day: CalendarDay) => {
    if (day.details) {
      setSelectedDay(day.details);
      setDetailsOpen(true);
    }
  };
  
  const closeDetails = () => {
    setDetailsOpen(false);
  };
  
  // Calcular data para exibição
  const getDateForPicker = () => {
    const date = new Date();
    date.setMonth(monthYear.month - 1);
    date.setFullYear(monthYear.year);
    return date;
  };
  
  // Formatar data para exibição
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  // Obter classe CSS baseada no status
  const getDayStatusClass = (status?: string) => {
    switch (status) {
      case 'presente':
        return 'present';
      case 'ausente':
        return 'absent';
      case 'ferias':
        return 'vacation';
      case 'folga':
        return 'time-off';
      default:
        return '';
    }
  };
  
  // Renderizar ícone baseado no status
  const renderStatusIcon = (status?: string) => {
    switch (status) {
      case 'presente':
        return <CheckIcon fontSize="small" color="success" />;
      case 'ausente':
        return <AbsenceIcon fontSize="small" color="error" />;
      case 'ferias':
        return <VacationIcon fontSize="small" color="primary" />;
      case 'folga':
        return <TimeOffIcon fontSize="small" color="warning" />;
      default:
        return null;
    }
  };
  
  // Dias da semana
  const weekdays = [
    t('domingo'),
    t('segunda'),
    t('terca'),
    t('quarta'),
    t('quinta'),
    t('sexta'),
    t('sabado')
  ];

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
            placeholder={t('filtrarPorFuncionario') || "Filtrar por funcionário"}
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
              onClick={() => onAddVacation()}
              size="small"
            >
              {t('adicionarFerias')}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<TimeOffIcon />}
              onClick={() => onAddAbsence()}
              size="small"
            >
              {t('registrarFolga')}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<AbsenceIcon />}
              onClick={() => onAddAbsence()}
              size="small"
            >
              {t('registrarAusencia')}
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      {/* Legenda */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 16, 
              height: 16, 
              backgroundColor: 'success.light', 
              borderRadius: 1, 
              mr: 0.5 
            }} 
          />
          <Typography variant="body2">{t('presente')}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 16, 
              height: 16, 
              backgroundColor: 'error.light', 
              borderRadius: 1, 
              mr: 0.5 
            }} 
          />
          <Typography variant="body2">{t('ausente')}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 16, 
              height: 16, 
              backgroundColor: 'primary.light', 
              borderRadius: 1, 
              mr: 0.5 
            }} 
          />
          <Typography variant="body2">{t('ferias')}</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              width: 16, 
              height: 16, 
              backgroundColor: 'warning.light', 
              borderRadius: 1, 
              mr: 0.5 
            }} 
          />
          <Typography variant="body2">{t('folga')}</Typography>
        </Box>
      </Box>
      
      {/* Calendário */}
      <Paper sx={{ p: 2, overflow: 'hidden' }}>
        <Grid container>
          {/* Dias da semana */}
          {weekdays.map((day, index) => (
            <Grid item xs={12/7} key={index}>
              <Box 
                sx={{ 
                  p: 1, 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  borderBottom: 1,
                  borderColor: 'divider'
                }}
              >
                <Typography variant="subtitle2">{day}</Typography>
              </Box>
            </Grid>
          ))}
          
          {/* Dias do calendário */}
          {calendar.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => (
                <Grid item xs={12/7} key={`${weekIndex}-${dayIndex}`}>
                  <div
                    style={{
                      transition: 'transform 0.2s',
                      transformOrigin: 'center',
                    }}
                    className="calendar-day"
                  >
                    <Box 
                      sx={{ 
                        p: 1,
                        minHeight: 80,
                        border: 1,
                        borderColor: 'divider',
                        backgroundColor: day.details ? 
                          day.details.status === 'presente' ? 'success.light' : 
                          day.details.status === 'ausente' ? 'error.light' :
                          day.details.status === 'ferias' ? 'primary.light' :
                          day.details.status === 'folga' ? 'warning.light' : 'transparent'
                          : 'transparent',
                        opacity: day.currentMonth ? 1 : 0.3,
                        cursor: day.details ? 'pointer' : 'default',
                        '&:hover': {
                          backgroundColor: day.details ? 
                            day.details.status === 'presente' ? 'success.main' : 
                            day.details.status === 'ausente' ? 'error.main' :
                            day.details.status === 'ferias' ? 'primary.main' :
                            day.details.status === 'folga' ? 'warning.main' : 'action.hover'
                            : 'action.hover',
                          transform: 'scale(1.05)',
                        },
                        '&:active': {
                          transform: 'scale(0.95)'
                        }
                      }}
                      onClick={() => day.details && handleDayClick(day)}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">
                          {day.date.getDate()}
                        </Typography>
                        {day.details && renderStatusIcon(day.details.status)}
                      </Box>
                      
                      {day.details && day.details.status !== 'presente' && (
                        <Tooltip title={day.details.reason || ''}>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: 'block', 
                              mt: 1, 
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {day.details.reason}
                          </Typography>
                        </Tooltip>
                      )}
                      
                      {day.details && day.details.status === 'presente' && (
                        <Typography 
                          variant="caption" 
                          sx={{ display: 'block', mt: 1 }}
                        >
                          {day.details.startTime} - {day.details.endTime}
                        </Typography>
                      )}
                    </Box>
                  </div>
                </Grid>
              ))}
            </React.Fragment>
          ))}
        </Grid>
      </Paper>
      
      {/* Modal de detalhes */}
      <Dialog open={detailsOpen} onClose={closeDetails} fullWidth maxWidth="xs">
        <DialogTitle>
          {selectedDay ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EventIcon sx={{ mr: 1 }} />
              {formatDate(new Date(selectedDay.date))}
            </Box>
          ) : (
            t('detalhesDoRegistro')
          )}
        </DialogTitle>
        <DialogContent dividers>
          {selectedDay && (
            <Box sx={{ py: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">
                    {t('status')}:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    {renderStatusIcon(selectedDay.status)}
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {selectedDay.status === 'presente' ? t('presente') : 
                       selectedDay.status === 'ausente' ? t('ausente') :
                       selectedDay.status === 'ferias' ? t('ferias') : t('folga')}
                    </Typography>
                  </Box>
                </Grid>
                
                {selectedDay.status === 'presente' && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">
                        {t('entrada')}:
                      </Typography>
                      <Typography variant="body2">
                        {selectedDay.startTime}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">
                        {t('saida')}:
                      </Typography>
                      <Typography variant="body2">
                        {selectedDay.endTime}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">
                        {t('horasTrabalhadas')}:
                      </Typography>
                      <Typography variant="body2">
                        {selectedDay.hoursWorked}h
                      </Typography>
                    </Grid>
                  </>
                )}
                
                {(selectedDay.status === 'ausente' || selectedDay.status === 'folga') && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">
                      {t('motivo')}:
                    </Typography>
                    <Typography variant="body2">
                      {selectedDay.reason || t('naoInformado')}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDetails}>
            {t('fechar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarView; 