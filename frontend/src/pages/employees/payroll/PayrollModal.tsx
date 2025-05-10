import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  SelectChangeEvent
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PaymentData } from './PayrollPage';

interface PayrollModalProps {
  open: boolean;
  onClose: () => void;
  payment: PaymentData | null;
  onSave: (payment: PaymentData) => void;
}

// Mock de dados para os seletores de funcionários
const mockEmployees = [
  { id: '1', name: 'Maria Silva' },
  { id: '2', name: 'João Santos' },
  { id: '3', name: 'Ana Oliveira' },
  { id: '4', name: 'Pedro Costa' },
  { id: '5', name: 'Juliana Pereira' }
];

const PayrollModal: React.FC<PayrollModalProps> = ({
  open,
  onClose,
  payment,
  onSave
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<PaymentData>>({
    employeeId: '',
    employeeName: '',
    contractType: 'mensalista',
    hoursWorked: 160,
    grossAmount: 0,
    deductions: 0,
    netAmount: 0,
    status: 'pendente',
    observations: ''
  });

  // Atualizar o formulário quando o pagamento for alterado
  useEffect(() => {
    if (payment) {
      setFormData({
        ...payment
      });
    } else {
      // Resetar o formulário para um novo pagamento
      setFormData({
        employeeId: '',
        employeeName: '',
        contractType: 'mensalista',
        hoursWorked: 160,
        grossAmount: 0,
        deductions: 0,
        netAmount: 0,
        status: 'pendente',
        observations: ''
      });
    }
  }, [payment]);

  // Manipulador para alterações de campo
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    
    let parsedValue: string | number = value;
    if (name === 'hoursWorked' || name === 'grossAmount' || name === 'deductions') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: parsedValue
      };
      
      // Calcular valor líquido automaticamente
      if (name === 'grossAmount' || name === 'deductions') {
        const grossAmount = name === 'grossAmount' 
          ? parsedValue as number 
          : (prev.grossAmount || 0);
        const deductions = name === 'deductions' 
          ? parsedValue as number 
          : (prev.deductions || 0);
          
        newData.netAmount = grossAmount - deductions;
      }
      
      return newData;
    });
  };

  // Manipulador para alterações em selects
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    
    if (name === 'employeeId') {
      const selectedEmployee = mockEmployees.find(emp => emp.id === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        employeeName: selectedEmployee?.name || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Manipulador para alteração no checkbox de pago
  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      status: event.target.checked ? 'pago' : 'pendente'
    }));
  };

  // Manipulador para salvar
  const handleSave = () => {
    if (formData.employeeId && 
        formData.employeeName && 
        formData.grossAmount && 
        formData.netAmount !== undefined) {
      onSave(formData as PaymentData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {payment ? t('editarPagamento') : t('adicionarPagamento')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="employee-select-label">{t('funcionario')}</InputLabel>
              <Select
                labelId="employee-select-label"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleSelectChange}
                label={t('funcionario')}
                disabled={!!payment}
              >
                {mockEmployees.map(emp => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="contract-type-label">{t('tipoContrato')}</InputLabel>
              <Select
                labelId="contract-type-label"
                name="contractType"
                value={formData.contractType}
                onChange={handleSelectChange}
                label={t('tipoContrato')}
              >
                <MenuItem value="mensalista">{t('mensalista')}</MenuItem>
                <MenuItem value="horista">{t('horista')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="hoursWorked"
              label={t('horasTrabalhadas')}
              type="number"
              fullWidth
              value={formData.hoursWorked}
              onChange={handleChange}
              InputProps={{ 
                endAdornment: <Box component="span">h</Box>,
                inputProps: { min: 0 }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="grossAmount"
              label={t('valorBruto')}
              type="number"
              fullWidth
              value={formData.grossAmount}
              onChange={handleChange}
              InputProps={{ 
                startAdornment: <Box component="span" sx={{ mr: 1 }}>€</Box>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              name="deductions"
              label={t('descontos')}
              type="number"
              fullWidth
              value={formData.deductions}
              onChange={handleChange}
              InputProps={{ 
                startAdornment: <Box component="span" sx={{ mr: 1 }}>€</Box>,
                inputProps: { min: 0, step: 0.01 }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t('valorLiquido')}
              </Typography>
              <Typography variant="h5" color="primary">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'EUR' })
                  .format(formData.netAmount || 0)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.status === 'pago'}
                  onChange={handleStatusChange}
                  name="status"
                  color="success"
                />
              }
              label={t('marcaComoPago')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="observations"
              label={t('observacoes')}
              multiline
              rows={3}
              fullWidth
              value={formData.observations || ''}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancelar')}</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={!formData.employeeId || !formData.grossAmount}
        >
          {t('salvar')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayrollModal; 