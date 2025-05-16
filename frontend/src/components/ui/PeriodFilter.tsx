import React from 'react';
import { 
  Paper, 
  Grid, 
  Button, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Typography,
  Box,
  useTheme,
  alpha
} from '@mui/material';
import { 
  FilterAlt as FilterIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ptBR } from 'date-fns/locale';

interface PeriodFilterProps {
  startDate: Date | null;
  endDate: Date | null;
  departmentFilter: string;
  departments: string[];
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onDepartmentChange: (event: SelectChangeEvent) => void;
  onFilterApply: () => void;
}

/**
 * Componente para filtrar dados por período e departamento
 * Estilizado de forma moderna e responsiva
 */
const PeriodFilter: React.FC<PeriodFilterProps> = ({
  startDate,
  endDate,
  departmentFilter,
  departments,
  onStartDateChange,
  onEndDateChange,
  onDepartmentChange,
  onFilterApply
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: '16px',
        border: `1px solid ${theme.palette.divider}`,
        background: alpha(theme.palette.background.paper, 0.8)
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            fontSize: '1rem',
            fontWeight: 600,
            color: theme.palette.text.primary 
          }}
        >
          <DateRangeIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
          {t('funcionarios.estatisticas.selecionarPeriodo')}
        </Typography>
      </Box>
      
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              label={t('funcionarios.estatisticas.dataInicio')}
              value={startDate}
              onChange={onStartDateChange}
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
        
        <Grid item xs={12} sm={6} md={3}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <DatePicker
              label={t('funcionarios.estatisticas.dataFim')}
              value={endDate}
              onChange={onEndDateChange}
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
        
        <Grid item xs={12} sm={8} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="department-filter-label">
              {t('funcionarios.estatisticas.departamento')}
            </InputLabel>
            <Select
              labelId="department-filter-label"
              value={departmentFilter}
              onChange={onDepartmentChange}
              label={t('funcionarios.estatisticas.departamento')}
            >
              <MenuItem value="todos">{t('funcionarios.estatisticas.todos')}</MenuItem>
              {departments.map(dep => (
                <MenuItem key={dep} value={dep}>{dep}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={4} md={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<FilterIcon />}
            onClick={onFilterApply}
            sx={{ 
              py: 1,
              borderRadius: '8px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
            }}
          >
            {t('funcionarios.estatisticas.aplicar')}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PeriodFilter; 