import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  FormHelperText,
  Divider,
  Paper,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR, enUS, de, it } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { SituacaoAtual, FormaPagamento, TipoContrato, DiaSemana } from '../../types/funcionarioTypes';

// Define a interface para o Funcionário
interface Funcionario {
  id?: string;
  nome: string;
  cargo: string;
  tipoContrato: string;
  dataAdmissao: Date;
  salarioBruto: number;
  pagamentoPorHora: boolean;
  horasSemana: number;
  diasTrabalho: string[];
  iban?: string;
  status: string;
  observacoes?: string;
  formaPagamento?: string;
  situacaoAtual?: string;
  telefone?: string;
  email?: string;
}

// Props do componente
interface FuncionarioFormProps {
  funcionario?: Funcionario;
  onSubmit: (funcionario: Funcionario) => void;
  isLoading?: boolean;
}

// Componente de formulário
const FuncionarioForm: React.FC<FuncionarioFormProps> = ({
  funcionario,
  onSubmit,
  isLoading = false
}) => {
  const { t, i18n } = useTranslation();
  
  // Define o locale do date picker com base no idioma selecionado
  const getDatePickerLocale = () => {
    switch (i18n.language) {
      case 'pt':
      case 'pt-BR':
        return ptBR;
      case 'de':
        return de;
      case 'it':
        return it;
      default:
        return enUS;
    }
  };
  
  // Estado inicial do formulário
  const [formData, setFormData] = useState<Funcionario>({
    nome: '',
    cargo: '',
    tipoContrato: 'Vollzeit',
    dataAdmissao: new Date(),
    salarioBruto: 0,
    pagamentoPorHora: false,
    horasSemana: 40,
    diasTrabalho: ['segunda', 'terça', 'quarta', 'quinta', 'sexta'],
    status: 'ativo',
    formaPagamento: 'mensal',
    situacaoAtual: 'ativo',
    telefone: '',
    email: '',
  });
  
  // Erros de validação
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Inicializa o formulário com os dados do funcionário se existirem
  useEffect(() => {
    if (funcionario) {
      setFormData({
        ...funcionario,
        dataAdmissao: new Date(funcionario.dataAdmissao),
      });
    }
  }, [funcionario]);
  
  // Função para lidar com mudanças nos campos de texto
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Limpa o erro para o campo que foi modificado
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };
  
  // Função para lidar com mudanças nos selects
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Limpa o erro para o campo que foi modificado
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };
  
  // Função para lidar com mudanças na data
  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({ ...prev, dataAdmissao: date }));
      if (errors.dataAdmissao) {
        setErrors(prev => ({ ...prev, dataAdmissao: '' }));
      }
    }
  };
  
  // Valida o formulário antes de enviar
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome) {
      newErrors.nome = t('campoObrigatorio');
    }
    
    if (!formData.cargo) {
      newErrors.cargo = t('campoObrigatorio');
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('emailInvalido');
    }
    
    if (formData.telefone && !/^[0-9+() -]{8,20}$/.test(formData.telefone)) {
      newErrors.telefone = t('telefoneInvalido');
    }
    
    if (formData.salarioBruto <= 0) {
      newErrors.salarioBruto = t('valorDeveSerPositivo');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Envia o formulário
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" color="primary">
              {t('funcionario.dadosPessoais')}
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label={t('nome')}
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              error={!!errors.nome}
              helperText={errors.nome}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label={t('funcionario.cargo')}
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              error={!!errors.cargo}
              helperText={errors.cargo}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mt: 2 }}>
              {t('funcionario.dadosProfissionais')}
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('tipoContrato')}</InputLabel>
              <Select
                name="tipoContrato"
                value={formData.tipoContrato}
                onChange={handleSelectChange}
                disabled={isLoading}
              >
                <MenuItem value="Minijob">Minijob</MenuItem>
                <MenuItem value="Teilzeit">Teilzeit</MenuItem>
                <MenuItem value="Vollzeit">Vollzeit</MenuItem>
                <MenuItem value="Freelancer">Freelancer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('funcionario.formaPagamento')}</InputLabel>
              <Select
                name="formaPagamento"
                value={formData.formaPagamento}
                onChange={handleSelectChange}
                disabled={isLoading}
              >
                <MenuItem value="mensal">{t('funcionario.mensal')}</MenuItem>
                <MenuItem value="hora">{t('funcionario.hora')}</MenuItem>
                <MenuItem value="comissao">{t('funcionario.comissao')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getDatePickerLocale()}>
              <DatePicker
                label={t('funcionario.dataAdmissao')}
                value={formData.dataAdmissao}
                onChange={handleDateChange}
                format="dd/MM/yyyy"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.dataAdmissao,
                    helperText: errors.dataAdmissao
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('funcionario.situacaoAtual')}</InputLabel>
              <Select
                name="situacaoAtual"
                value={formData.situacaoAtual}
                onChange={handleSelectChange}
                disabled={isLoading}
              >
                <MenuItem value="ativo">{t('funcionario.ativo')}</MenuItem>
                <MenuItem value="ferias">{t('funcionario.ferias')}</MenuItem>
                <MenuItem value="afastado">{t('funcionario.afastado')}</MenuItem>
                <MenuItem value="desligado">{t('funcionario.desligado')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              type="number"
              label={t('salarioBruto')}
              name="salarioBruto"
              value={formData.salarioBruto}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.01 }}
              error={!!errors.salarioBruto}
              helperText={errors.salarioBruto}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              type="number"
              label={t('horasSemana')}
              name="horasSemana"
              value={formData.horasSemana}
              onChange={handleChange}
              inputProps={{ min: 0, step: 0.5 }}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="h6" fontWeight="bold" color="primary" sx={{ mt: 2 }}>
              {t('funcionario.contato')}
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('funcionario.telefone')}
              name="telefone"
              value={formData.telefone || ''}
              onChange={handleChange}
              error={!!errors.telefone}
              helperText={errors.telefone}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('funcionario.email')}
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={12}>
            <TextField
              fullWidth
              label={t('observacao')}
              name="observacoes"
              value={formData.observacoes || ''}
              onChange={handleChange}
              multiline
              rows={4}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
              <Button
                variant="outlined"
                color="secondary"
                disabled={isLoading}
                onClick={() => window.history.back()}
              >
                {t('cancelar')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {funcionario ? t('salvar') : t('adicionar')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default FuncionarioForm; 