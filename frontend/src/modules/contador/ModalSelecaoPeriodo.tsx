import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ModalSelecaoPeriodoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (mes: string, ano: string) => void;
}

/**
 * Gera os últimos 12 meses para seleção
 */
const getMeses = () => {
  const meses = [];
  for (let i = 0; i < 12; i++) {
    const data = subMonths(new Date(), i);
    meses.push({
      value: format(data, 'MM'),
      label: format(data, 'MMMM', { locale: ptBR })
    });
  }
  return meses;
};

/**
 * Gera os últimos 5 anos para seleção
 */
const getAnos = () => {
  const anos = [];
  const anoAtual = new Date().getFullYear();
  for (let i = 0; i < 5; i++) {
    anos.push({
      value: String(anoAtual - i),
      label: String(anoAtual - i)
    });
  }
  return anos;
};

const ModalSelecaoPeriodo: React.FC<ModalSelecaoPeriodoProps> = ({ open, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [mes, setMes] = useState(format(new Date(), 'MM'));
  const [ano, setAno] = useState(String(new Date().getFullYear()));
  
  const meses = getMeses();
  const anos = getAnos();
  
  const handleMesChange = (event: SelectChangeEvent) => {
    setMes(event.target.value);
  };
  
  const handleAnoChange = (event: SelectChangeEvent) => {
    setAno(event.target.value);
  };
  
  const handleConfirm = () => {
    onConfirm(mes, ano);
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Selecionar Período para Relatório</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Selecione o mês e ano para gerar o relatório mensal interno.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="mes-label">Mês</InputLabel>
              <Select
                labelId="mes-label"
                id="mes-select"
                value={mes}
                label="Mês"
                onChange={handleMesChange}
              >
                {meses.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="ano-label">Ano</InputLabel>
              <Select
                labelId="ano-label"
                id="ano-select"
                value={ano}
                label="Ano"
                onChange={handleAnoChange}
              >
                {anos.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancelar</Button>
        <Button onClick={handleConfirm} variant="contained" color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalSelecaoPeriodo; 