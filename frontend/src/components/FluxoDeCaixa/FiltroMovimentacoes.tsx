import React from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent
} from '@mui/material';
import { FilterList as FilterIcon, ClearAll as ClearAllIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Interfaces
interface FiltrosProps {
  tipo: 'todos' | 'entrada' | 'saida';
  status: 'todos' | 'confirmado' | 'pendente';
  periodo: {
    inicio: string;
    fim: string;
  };
  origem: 'todos' | 'contas-a-pagar' | 'contas-a-receber' | 'manual';
}

interface FiltroMovimentacoesProps {
  filtros: FiltrosProps;
  onFiltroChange: (filtros: Partial<FiltrosProps>) => void;
  onLimparFiltros: () => void;
}

const FiltroMovimentacoes: React.FC<FiltroMovimentacoesProps> = ({
  filtros,
  onFiltroChange,
  onLimparFiltros
}) => {
  const { t } = useTranslation();

  // Handler para selects
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    onFiltroChange({ [name as keyof FiltrosProps]: value });
  };

  // Handler para inputs de data
  const handleDateChange = (field: 'inicio' | 'fim') => (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltroChange({
      periodo: {
        ...filtros.periodo,
        [field]: event.target.value
      }
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" component="div">
          {t('fluxoCaixa.filtros.titulo')}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Button 
          startIcon={<ClearAllIcon />} 
          onClick={onLimparFiltros}
          size="small"
        >
          {t('fluxoCaixa.filtros.limpar')}
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="tipo-label">{t('fluxoCaixa.filtros.tipo')}</InputLabel>
            <Select
              labelId="tipo-label"
              name="tipo"
              value={filtros.tipo}
              label={t('fluxoCaixa.filtros.tipo')}
              onChange={handleSelectChange}
            >
              <MenuItem value="todos">{t('fluxoCaixa.filtros.todos')}</MenuItem>
              <MenuItem value="entrada">{t('fluxoCaixa.filtros.entrada')}</MenuItem>
              <MenuItem value="saida">{t('fluxoCaixa.filtros.saida')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-label">{t('fluxoCaixa.filtros.status')}</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={filtros.status}
              label={t('fluxoCaixa.filtros.status')}
              onChange={handleSelectChange}
            >
              <MenuItem value="todos">{t('fluxoCaixa.filtros.todos')}</MenuItem>
              <MenuItem value="confirmado">{t('fluxoCaixa.filtros.confirmado')}</MenuItem>
              <MenuItem value="pendente">{t('fluxoCaixa.filtros.pendente')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="origem-label">{t('fluxoCaixa.filtros.origem')}</InputLabel>
            <Select
              labelId="origem-label"
              name="origem"
              value={filtros.origem}
              label={t('fluxoCaixa.filtros.origem')}
              onChange={handleSelectChange}
            >
              <MenuItem value="todos">{t('fluxoCaixa.filtros.todos')}</MenuItem>
              <MenuItem value="contas-a-pagar">{t('fluxoCaixa.filtros.contasAPagar')}</MenuItem>
              <MenuItem value="contas-a-receber">{t('fluxoCaixa.filtros.contasAReceber')}</MenuItem>
              <MenuItem value="manual">{t('fluxoCaixa.filtros.manual')}</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              label={t('fluxoCaixa.filtros.de')}
              type="date"
              size="small"
              fullWidth
              value={filtros.periodo.inicio}
              onChange={handleDateChange('inicio')}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label={t('fluxoCaixa.filtros.ate')}
              type="date"
              size="small"
              fullWidth
              value={filtros.periodo.fim}
              onChange={handleDateChange('fim')}
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FiltroMovimentacoes; 