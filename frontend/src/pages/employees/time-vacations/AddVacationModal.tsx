import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  FormHelperText
} from '@mui/material';
import { BeachAccess as VacationIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { differenceInDays, isAfter, isBefore, addDays } from 'date-fns';

interface Employee {
  id: string;
  name: string;
}

interface AddVacationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  selectedEmployeeId: string | null;
}

const AddVacationModal: React.FC<AddVacationModalProps> = ({
  open,
  onClose,
  onSave,
  selectedEmployeeId
}) => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [employee, setEmployee] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [observations, setObservations] = useState<string>('');
  
  // Errors
  const [employeeError, setEmployeeError] = useState<string>('');
  const [startDateError, setStartDateError] = useState<string>('');
  const [endDateError, setEndDateError] = useState<string>('');
  
  // Buscar funcionários (mock)
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        // Simulação de chamada à API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Dados simulados
        const mockEmployees: Employee[] = [
          { id: '1', name: 'João Silva' },
          { id: '2', name: 'Maria Santos' },
          { id: '3', name: 'Pedro Oliveira' },
          { id: '4', name: 'Ana Costa' }
        ];
        
        setEmployees(mockEmployees);
      } catch (error) {
        console.error('Erro ao buscar funcionários:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (open) {
      fetchEmployees();
      
      // Setar funcionário selecionado se houver
      if (selectedEmployeeId) {
        setEmployee(selectedEmployeeId);
      }
    }
  }, [open, selectedEmployeeId]);
  
  // Limpar formulário ao fechar
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);
  
  // Reset form
  const resetForm = () => {
    setEmployee('');
    setStartDate(null);
    setEndDate(null);
    setObservations('');
    setEmployeeError('');
    setStartDateError('');
    setEndDateError('');
  };
  
  // Funções de validação
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Validar funcionário
    if (!employee) {
      setEmployeeError(t('funcionarioObrigatorio') || "Funcionário é obrigatório");
      isValid = false;
    } else {
      setEmployeeError('');
    }
    
    // Validar data de início
    if (!startDate) {
      setStartDateError(t('dataInicioObrigatoria') || "Data de início é obrigatória");
      isValid = false;
    } else {
      setStartDateError('');
    }
    
    // Validar data de fim
    if (!endDate) {
      setEndDateError(t('dataFimObrigatoria') || "Data de fim é obrigatória");
      isValid = false;
    } else if (startDate && isBefore(endDate, startDate)) {
      setEndDateError(t('dataFimMaiorQueInicio') || "Data de fim deve ser maior que início");
      isValid = false;
    } else {
      setEndDateError('');
    }
    
    return isValid;
  };
  
  // Calcular dias de férias
  const calculateDays = (): number => {
    if (startDate && endDate) {
      return differenceInDays(endDate, startDate) + 1;
    }
    return 0;
  };
  
  // Handler para salvar
  const handleSave = () => {
    if (validateForm()) {
      const data = {
        employeeId: employee,
        employeeName: employees.find(e => e.id === employee)?.name || '',
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        days: calculateDays(),
        observations,
        type: 'ferias'
      };
      
      onSave(data);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        <VacationIcon sx={{ mr: 1 }} />
        {t('adicionarFerias')}
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <FormControl fullWidth error={!!employeeError}>
              <InputLabel id="employee-label">{t('funcionario')}</InputLabel>
              <Select
                labelId="employee-label"
                value={employee}
                onChange={(e) => setEmployee(e.target.value as string)}
                label={t('funcionario')}
                disabled={!!selectedEmployeeId}
              >
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
              {employeeError && <FormHelperText>{employeeError}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label={t('dataInicio')}
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!startDateError,
                    helperText: startDateError
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
              <DatePicker
                label={t('dataFim')}
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                minDate={startDate || undefined}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!endDateError,
                    helperText: endDateError
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          {startDate && endDate && (
            <Grid item xs={12}>
              <Box sx={{ 
                backgroundColor: 'primary.light', 
                p: 1, 
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Typography variant="body2" color="primary.contrastText">
                  {t('diasDeFerias')}: <strong>{calculateDays()}</strong>
                </Typography>
              </Box>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('observacoes')}
              multiline
              rows={4}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>
          {t('cancelar')}
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSave}
          disabled={loading}
        >
          {t('salvar')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddVacationModal; 