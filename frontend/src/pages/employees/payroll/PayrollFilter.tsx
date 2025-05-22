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
  SelectChangeEvent,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterIcon,
  Euro as EuroIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface PayrollFilterProps {
  monthYear: { month: number; year: number };
  setMonthYear: React.Dispatch<React.SetStateAction<{ month: number; year: number }>>;
  statusFilter: 'todos' | 'pago' | 'pendente' | 'atrasado';
  setStatusFilter: React.Dispatch<React.SetStateAction<'todos' | 'pago' | 'pendente' | 'atrasado'>>;
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
    setStatusFilter(event.target.value as 'todos' | 'pago' | 'pendente' | 'atrasado');
  };

  // Manipulador para aplicar os filtros
  const handleApplyFilters = () => {
    setMonthYear({ month: tempMonth, year: tempYear });
  };

  // Lista de meses para o seletor
  const meses = [
    { value: 1, label: 'Janeiro' },
    { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' },
    { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' },
    { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' },
    { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' },
    { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' },
    { value: 12, label: 'Dezembro' }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3} md={2}>
          <FormControl fullWidth size="small">
            <InputLabel id="month-select-label">Mês</InputLabel>
            <Select
              labelId="month-select-label"
              value={tempMonth}
              onChange={handleMonthChange}
              label="Mês"
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
            label="Ano"
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
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={statusFilter}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="pago">Pago</MenuItem>
              <MenuItem value="pendente">Pendente</MenuItem>
              <MenuItem value="atrasado">Atrasado</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} sm={2} md={1}>
          <Tooltip title="Aplicar os filtros selecionados">
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={handleApplyFilters}
              fullWidth
              sx={{ height: '40px' }}
            >
              Filtrar
            </Button>
          </Tooltip>
        </Grid>
        <Grid item xs={6} sm={2} md={2}>
          <Tooltip title="Cadastrar um novo pagamento para um funcionário">
            <Button
              variant="contained"
              color="primary"
              startIcon={<EuroIcon />}
              onClick={onAddPayment}
              fullWidth
              sx={{ height: '40px' }}
            >
              Registrar Pagamento
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PayrollFilter; 