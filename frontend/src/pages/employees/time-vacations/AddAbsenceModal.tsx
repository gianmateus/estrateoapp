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
  FormHelperText,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Box
} from '@mui/material';
import { EventBusy as AbsenceIcon, Weekend as TimeOffIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { differenceInDays, isAfter, isBefore, addDays } from 'date-fns';
import { eventBus } from '../../../services/EventBus';
import { AUSENCIA_EVENTS, FOLGA_EVENTS } from '../../../constants/events';

interface Employee {
  id: string;
  name: string;
}

interface AddAbsenceModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  selectedEmployeeId: string | null;
}

const AddAbsenceModal: React.FC<AddAbsenceModalProps> = ({
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
  const [type, setType] = useState<'ausencia' | 'folga'>('ausencia');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reason, setReason] = useState<string>('');
  
  // Errors
  const [employeeError, setEmployeeError] = useState<string>('');
  const [startDateError, setStartDateError] = useState<string>('');
  const [endDateError, setEndDateError] = useState<string>('');
  const [reasonError, setReasonError] = useState<string>('');
  
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
    setType('ausencia');
    setStartDate(null);
    setEndDate(null);
    setReason('');
    setEmployeeError('');
    setStartDateError('');
    setEndDateError('');
    setReasonError('');
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
    
    // Validar motivo
    if (!reason.trim()) {
      setReasonError(t('motivoObrigatorio') || "Motivo é obrigatório");
      isValid = false;
    } else {
      setReasonError('');
    }
    
    return isValid;
  };
  
  // Calcular dias
  const calculateDays = (): number => {
    if (startDate && endDate) {
      return differenceInDays(endDate, startDate) + 1;
    }
    return 0;
  };
  
  // Handler para mudança de tipo
  const handleTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: 'ausencia' | 'folga' | null
  ) => {
    if (newType !== null) {
      setType(newType);
    }
  };
  
  // Handler para salvar
  const handleSave = () => {
    if (validateForm()) {
      const selectedEmployee = employees.find(e => e.id === employee);
      
      if (type === 'ausencia') {
        const ausenciaDados = {
          id: `ausencia-${Date.now()}`, // Gera um ID único
          funcionarioId: employee,
          funcionarioNome: selectedEmployee ? selectedEmployee.name : 'Desconhecido',
          dataInicio: startDate!,
          dataFim: endDate!,
          motivo: reason,
          dias: calculateDays()
        };
        
        // Emitir evento de ausência registrada
        eventBus.emit(AUSENCIA_EVENTS.REGISTRADA, {
          funcionarioId: employee,
          funcionarioNome: selectedEmployee ? selectedEmployee.name : 'Desconhecido',
          tipo: 'outro',
          dataInicio: startDate!.toISOString(),
          dataFim: endDate!.toISOString(),
          motivo: reason
        });
      } else {
        const folgaDados = {
          id: `folga-${Date.now()}`, // Gera um ID único
          funcionarioId: employee,
          funcionarioNome: selectedEmployee ? selectedEmployee.name : 'Desconhecido',
          dataFolga: startDate!,
          motivo: reason
        };
        
        // Emitir evento de folga registrada
        eventBus.emit(FOLGA_EVENTS.REGISTRADA, {
          funcionarioId: employee,
          funcionarioNome: selectedEmployee ? selectedEmployee.name : 'Desconhecido',
          data: startDate!.toISOString(),
          tipo: 'folga'
        });
      }
      
      // Chamar o callback original
      onSave({
        employeeId: employee,
        employeeName: selectedEmployee ? selectedEmployee.name : '',
        type,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        days: calculateDays(),
        reason
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
        {type === 'ausencia' ? (
          <AbsenceIcon sx={{ mr: 1 }} />
        ) : (
          <TimeOffIcon sx={{ mr: 1 }} />
        )}
        {type === 'ausencia' ? t('registrarAusencia') : t('registrarFolga')}
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
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              {t('tipo')}
            </Typography>
            <ToggleButtonGroup
              value={type}
              exclusive
              onChange={handleTypeChange}
              aria-label="tipo de registro"
              fullWidth
              size="small"
            >
              <ToggleButton value="ausencia" aria-label="ausência">
                <AbsenceIcon sx={{ mr: 1 }} />
                {t('ausencia')}
              </ToggleButton>
              <ToggleButton value="folga" aria-label="folga">
                <TimeOffIcon sx={{ mr: 1 }} />
                {t('folga')}
              </ToggleButton>
            </ToggleButtonGroup>
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
                backgroundColor: type === 'ausencia' ? 'error.light' : 'warning.light', 
                p: 1, 
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Typography variant="body2" color={type === 'ausencia' ? 'error.contrastText' : 'warning.contrastText'}>
                  {type === 'ausencia' ? t('diasDeAusencia') : t('diasDeFolga')}: <strong>{calculateDays()}</strong>
                </Typography>
              </Box>
            </Grid>
          )}
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('motivo')}
              multiline
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              error={!!reasonError}
              helperText={reasonError}
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
          color={type === 'ausencia' ? 'error' : 'warning'} 
          onClick={handleSave}
          disabled={loading}
        >
          {t('salvar')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAbsenceModal; 