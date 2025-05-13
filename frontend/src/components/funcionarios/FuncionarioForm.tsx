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
  Checkbox,
  ListItemText,
  OutlinedInput,
  SelectChangeEvent,
  TextFieldProps
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR, enUS, de, it } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

const idiomasDisponiveis = ['Alemão', 'Inglês', 'Português', 'Italiano', 'Espanhol', 'Francês', 'Turco', 'Árabe', 'Polonês', 'Russo', 'Outro'];
const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const tiposContrato = ['Minijob', 'Teilzeit', 'Vollzeit', 'Freelancer'];
const paises = ['Alemanha', 'Áustria', 'Suíça', 'Itália', 'Portugal', 'Espanha', 'França', 'Outro'];

// Define a interface para o Funcionário
export interface Funcionario {
  id?: string;
  nomeCompleto: string;
  cargo: string;
  departamento?: string;
  emailProfissional: string;
  telefone: string;
  endereco: string;
  cidade: string;
  cep: string;
  pais: string;
  steurId?: string;
  nacionalidade: string;
  idiomas: string[];
  dataAdmissao: Date;
  tipoContrato: string;
  jornadaSemanal: number;
  diasTrabalho: string[];
  salarioBruto: number;
  status: string;
  observacoes?: string;
  contratoUploadUrl?: string;
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
    nomeCompleto: '',
    cargo: '',
    departamento: '',
    emailProfissional: '',
    telefone: '',
    endereco: '',
    cidade: '',
    cep: '',
    pais: 'Alemanha',
    steurId: '',
    nacionalidade: '',
    idiomas: [],
    dataAdmissao: new Date(),
    tipoContrato: 'Vollzeit',
    jornadaSemanal: 40,
    diasTrabalho: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
    salarioBruto: 0,
    status: 'ativo',
    observacoes: '',
    contratoUploadUrl: ''
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
  const handleSelectChange = (name: string, value: string[] | string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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
  
  // Função para lidar com Selects de valor único (pais, tipoContrato, status)
  const handleSingleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Valida o formulário antes de enviar
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nomeCompleto) {
      newErrors.nomeCompleto = t('campoObrigatorio');
    }
    
    if (!formData.cargo) {
      newErrors.cargo = t('campoObrigatorio');
    }
    
    if (!formData.jornadaSemanal || formData.jornadaSemanal <= 0) {
      newErrors.jornadaSemanal = t('valorDeveSerPositivo');
    }
    
    if (!formData.tipoContrato) {
      newErrors.tipoContrato = t('campoObrigatorio');
    }
    
    if (!formData.dataAdmissao) {
      newErrors.dataAdmissao = t('campoObrigatorio');
    }
    
    if (!formData.salarioBruto || formData.salarioBruto <= 0) {
      newErrors.salarioBruto = t('valorDeveSerPositivo');
    }
    
    if (!formData.emailProfissional || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailProfissional)) {
      newErrors.emailProfissional = t('emailInvalido');
    }
    
    if (!formData.telefone || !/^\+?[0-9\s()-]{8,20}$/.test(formData.telefone)) {
      newErrors.telefone = t('telefoneInvalido');
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
              {t('funcionario.dadosPessoais') || 'Dados Pessoais'}
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label={t('Nome completo') || 'Nome completo'}
              name="nomeCompleto"
              value={formData.nomeCompleto}
              onChange={handleChange}
              error={!!errors.nomeCompleto}
              helperText={errors.nomeCompleto}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label={t('Cargo') || 'Cargo'}
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              error={!!errors.cargo}
              helperText={errors.cargo}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('Departamento') || 'Departamento'}
              name="departamento"
              value={formData.departamento}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label={t('E-mail profissional') || 'E-mail profissional'}
              name="emailProfissional"
              value={formData.emailProfissional}
              onChange={handleChange}
              error={!!errors.emailProfissional}
              helperText={errors.emailProfissional}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label={t('Telefone') || 'Telefone'}
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              error={!!errors.telefone}
              helperText={errors.telefone}
              disabled={isLoading}
              placeholder="+49 ..."
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label={t('Endereço') || 'Endereço'}
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              required
              label={t('Cidade') || 'Cidade'}
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              required
              label={t('CEP') || 'CEP'}
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required>
              <InputLabel>{t('País') || 'País'}</InputLabel>
              <Select
                name="pais"
                value={formData.pais}
                onChange={handleSingleSelectChange}
                disabled={isLoading}
                label={t('País') || 'País'}
              >
                {paises.map(pais => (
                  <MenuItem key={pais} value={pais}>
                    {pais}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('Steuer-ID (opcional') || 'Steuer-ID (opcional)'}
              name="steurId"
              value={formData.steurId}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label={t('Nacionalidade') || 'Nacionalidade'}
              name="nacionalidade"
              value={formData.nacionalidade}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={!!errors.idiomas}>
              <InputLabel>{t('Idiomas falados') || 'Idiomas falados'}</InputLabel>
              <Select
                multiple
                name="idiomas"
                value={formData.idiomas}
                onChange={e => handleSelectChange('idiomas', typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                input={<OutlinedInput label={t('Idiomas falados') || 'Idiomas falados'} />}
                renderValue={selected => (selected as string[]).join(', ')}
                disabled={isLoading}
              >
                {idiomasDisponiveis.map(idioma => (
                  <MenuItem key={idioma} value={idioma}>
                    <Checkbox checked={formData.idiomas.indexOf(idioma) > -1} />
                    <ListItemText primary={idioma} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.idiomas}</FormHelperText>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={getDatePickerLocale()}>
              <DatePicker
                label={t('Data de admissão') || 'Data de admissão'}
                value={formData.dataAdmissao}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    error: !!errors.dataAdmissao,
                    helperText: errors.dataAdmissao,
                    disabled: isLoading,
                  }
                }}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={!!errors.tipoContrato}>
              <InputLabel>{t('Tipo de contrato') || 'Tipo de contrato'}</InputLabel>
              <Select
                name="tipoContrato"
                value={formData.tipoContrato}
                onChange={handleSingleSelectChange}
                label={t('Tipo de contrato') || 'Tipo de contrato'}
                disabled={isLoading}
              >
                {tiposContrato.map(tipo => (
                  <MenuItem key={tipo} value={tipo}>
                    {tipo}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{errors.tipoContrato}</FormHelperText>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label={t('Jornada semanal (horas)') || 'Jornada semanal (horas)'}
              name="jornadaSemanal"
              type="number"
              value={formData.jornadaSemanal}
              onChange={handleChange}
              error={!!errors.jornadaSemanal}
              helperText={errors.jornadaSemanal}
              disabled={isLoading}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('Dias de trabalho') || 'Dias de trabalho'}</InputLabel>
              <Select
                multiple
                name="diasTrabalho"
                value={formData.diasTrabalho}
                onChange={e => handleSelectChange('diasTrabalho', typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value)}
                input={<OutlinedInput label={t('Dias de trabalho') || 'Dias de trabalho'} />}
                renderValue={selected => (selected as string[]).join(', ')}
                disabled={isLoading}
              >
                {diasSemana.map(dia => (
                  <MenuItem key={dia} value={dia}>
                    <Checkbox checked={formData.diasTrabalho.indexOf(dia) > -1} />
                    <ListItemText primary={dia} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label={t('Salário bruto mensal (€)') || 'Salário bruto mensal (€)'}
              name="salarioBruto"
              type="number"
              value={formData.salarioBruto}
              onChange={handleChange}
              error={!!errors.salarioBruto}
              helperText={errors.salarioBruto}
              disabled={isLoading}
              InputProps={{ startAdornment: <span>€&nbsp;</span> }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>{t('Status') || 'Status'}</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleSingleSelectChange}
                label={t('Status') || 'Status'}
                disabled={isLoading}
              >
                <MenuItem value="ativo">Ativo</MenuItem>
                <MenuItem value="inativo">Inativo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('Observações') || 'Observações'}
              name="observacoes"
              value={formData.observacoes}
              onChange={handleChange}
              multiline
              minRows={2}
              maxRows={6}
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
                {t('cancelar') || 'Cancelar'}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                fullWidth
                sx={{ mt: 2 }}
              >
                {isLoading ? (t('salvando') || 'Salvando...') : (t('salvar') || 'Salvar')}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default FuncionarioForm; 