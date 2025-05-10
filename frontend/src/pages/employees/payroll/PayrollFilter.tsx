import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface PayrollFilterProps {
  monthYear: { month: number; year: number };
  setMonthYear: React.Dispatch<React.SetStateAction<{ month: number; year: number }>>;
  statusFilter: 'todos' | 'pago' | 'pendente';
  setStatusFilter: React.Dispatch<React.SetStateAction<'todos' | 'pago' | 'pendente'>>;
  onAddPayment: () => void;
}

const PayrollFilter: React.FC<PayrollFilterProps> = ({
  monthYear,
  setMonthYear,
  statusFilter,
  setStatusFilter,
  onAddPayment
}) => {
  const { t } = useTranslation();
  const [tempMonth, setTempMonth] = useState(monthYear.month);
  const [tempYear, setTempYear] = useState(monthYear.year);

  // Manipulador para alterar o mês
  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setTempMonth(event.target.value as number);
  };

  // Manipulador para alterar o ano
  const handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(event.target.value);
    if (!isNaN(newYear) && newYear > 2000 && newYear < 2100) {
      setTempYear(newYear);
    }
  };

  // Manipulador para alterar o status
  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value as 'todos' | 'pago' | 'pendente');
  };

  // Manipulador para aplicar os filtros
  const handleApplyFilters = () => {
    setMonthYear({ month: tempMonth, year: tempYear });
  };

  // Lista de meses para o seletor
  const meses = [
    { value: 1, label: t('janeiro') },
    { value: 2, label: t('fevereiro') },
    { value: 3, label: t('marco') },
    { value: 4, label: t('abril') },
    { value: 5, label: t('maio') },
    { value: 6, label: t('junho') },
    { value: 7, label: t('julho') },
    { value: 8, label: t('agosto') },
    { value: 9, label: t('setembro') },
    { value: 10, label: t('outubro') },
    { value: 11, label: t('novembro') },
    { value: 12, label: t('dezembro') }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="month-select-label">{t('mes')}</InputLabel>
            <Select
              labelId="month-select-label"
              value={tempMonth}
              onChange={handleMonthChange}
              label={t('mes')}
            >
              {meses.map((mes) => (
                <MenuItem key={mes.value} value={mes.value}>
                  {mes.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={2} md={1}>
          <TextField
            label={t('ano')}
            type="number"
            size="small"
            value={tempYear}
            onChange={handleYearChange}
            InputProps={{ inputProps: { min: 2000, max: 2099 } }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={3} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-select-label">{t('status')}</InputLabel>
            <Select
              labelId="status-select-label"
              value={statusFilter}
              onChange={handleStatusChange}
              label={t('status')}
            >
              <MenuItem value="todos">{t('todos')}</MenuItem>
              <MenuItem value="pago">{t('pago')}</MenuItem>
              <MenuItem value="pendente">{t('pendente')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={2} md={1}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={handleApplyFilters}
            fullWidth
          >
            {t('filtrar')}
          </Button>
        </Grid>
        <Grid item xs={6} sm={2} md={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddPayment}
            fullWidth
          >
            {t('adicionarPagamento')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PayrollFilter; 