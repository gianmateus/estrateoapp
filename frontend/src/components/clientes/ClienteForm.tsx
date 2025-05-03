import React, { useState } from 'react';
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
  Paper,
  Divider,
  SelectChangeEvent
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Cliente, ClienteFormValues } from '../../types/clienteTypes';
import api from '../../services/api';

interface ClienteFormProps {
  cliente?: Cliente;
  onSubmitSuccess?: (cliente: Cliente) => void;
  onCancel?: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ cliente, onSubmitSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = Boolean(cliente?.id);

  // Esquema de validação com Yup
  const validationSchema = Yup.object({
    tipo: Yup.string()
      .oneOf(['pessoa_fisica', 'pessoa_juridica'])
      .required(t('cliente.campoObrigatorio') || 'Campo obrigatório'),
    nome: Yup.string()
      .required(t('cliente.campoObrigatorio') || 'Campo obrigatório')
      .min(3, t('cliente.nomeMinimo') || 'Mínimo de 3 caracteres'),
    email: Yup.string()
      .email(t('cliente.emailInvalido') || 'E-mail inválido'),
    telefone: Yup.string()
      .nullable(),
    documentoPrincipal: Yup.string()
      .nullable(),
    status: Yup.string()
      .oneOf(['ativo', 'inativo', 'prospecto', 'arquivado'])
      .required(t('cliente.campoObrigatorio') || 'Campo obrigatório')
  });

  // Configuração do formik
  const formik = useFormik<ClienteFormValues>({
    initialValues: {
      id: cliente?.id,
      tipo: cliente?.tipo || 'pessoa_fisica',
      nome: cliente?.nome || '',
      empresa: cliente?.empresa || '',
      email: cliente?.email || '',
      telefone: cliente?.telefone || '',
      documentoPrincipal: cliente?.documentoPrincipal || '',
      endereco: cliente?.endereco || '',
      website: cliente?.website || '',
      segmento: cliente?.segmento || '',
      anotacoes: cliente?.anotacoes || '',
      status: cliente?.status || 'ativo'
    },
    validationSchema,
    onSubmit: async (values: ClienteFormValues) => {
      setLoading(true);
      setError(null);
      
      try {
        let response;
        
        if (isEditMode) {
          // Atualização
          response = await api.put<Cliente>(`/clientes/clientes/${values.id}`, values);
        } else {
          // Criação
          response = await api.post<Cliente>('/clientes/clientes', values);
        }
        
        if (onSubmitSuccess) {
          onSubmitSuccess(response.data);
        }
      } catch (err) {
        console.error('Erro ao salvar cliente:', err);
        setError(t('cliente.erroSalvar') || 'Erro ao salvar cliente');
      } finally {
        setLoading(false);
      }
    }
  });

  const handleTipoChange = (event: SelectChangeEvent<string>) => {
    formik.setFieldValue('tipo', event.target.value);
    
    // Limpar campos específicos dependendo do tipo
    if (event.target.value === 'pessoa_fisica') {
      formik.setFieldValue('empresa', '');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box component="form" onSubmit={formik.handleSubmit} noValidate>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? t('cliente.editar') : t('cliente.novo')}
        </Typography>
        
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <Grid container spacing={3}>
          {/* Tipo de cliente */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={formik.touched.tipo && Boolean(formik.errors.tipo)}>
              <InputLabel id="tipo-label">{t('cliente.tipo')}</InputLabel>
              <Select
                labelId="tipo-label"
                id="tipo"
                name="tipo"
                value={formik.values.tipo}
                onChange={handleTipoChange}
                label={t('cliente.tipo')}
              >
                <MenuItem value="pessoa_fisica">{t('cliente.pessoaFisica')}</MenuItem>
                <MenuItem value="pessoa_juridica">{t('cliente.pessoaJuridica')}</MenuItem>
              </Select>
              {formik.touched.tipo && formik.errors.tipo && (
                <FormHelperText>{formik.errors.tipo}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          {/* Status */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
              <InputLabel id="status-label">{t('cliente.status.titulo')}</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                label={t('cliente.status.titulo')}
              >
                <MenuItem value="ativo">{t('cliente.status.ativo')}</MenuItem>
                <MenuItem value="inativo">{t('cliente.status.inativo')}</MenuItem>
                <MenuItem value="prospecto">{t('cliente.status.prospecto')}</MenuItem>
                <MenuItem value="arquivado">{t('cliente.status.arquivado')}</MenuItem>
              </Select>
              {formik.touched.status && formik.errors.status && (
                <FormHelperText>{formik.errors.status}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          {/* Nome */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="nome"
              name="nome"
              label={formik.values.tipo === 'pessoa_fisica' ? t('cliente.nome') : t('cliente.razaoSocial')}
              value={formik.values.nome}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.nome && Boolean(formik.errors.nome)}
              helperText={formik.touched.nome && formik.errors.nome}
              required
            />
          </Grid>
          
          {/* Empresa (apenas para pessoa jurídica) */}
          {formik.values.tipo === 'pessoa_juridica' && (
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="empresa"
                name="empresa"
                label={t('cliente.nomeFantasia')}
                value={formik.values.empresa}
                onChange={formik.handleChange}
              />
            </Grid>
          )}
          
          {/* Documento Principal */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="documentoPrincipal"
              name="documentoPrincipal"
              label={formik.values.tipo === 'pessoa_fisica' ? 'CPF' : 'CNPJ'}
              value={formik.values.documentoPrincipal}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.documentoPrincipal && Boolean(formik.errors.documentoPrincipal)}
              helperText={formik.touched.documentoPrincipal && formik.errors.documentoPrincipal}
              inputProps={{
                maxLength: formik.values.tipo === 'pessoa_fisica' ? 14 : 18
              }}
            />
          </Grid>
          
          {/* Email */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label={t('cliente.email')}
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          
          {/* Telefone */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="telefone"
              name="telefone"
              label={t('cliente.telefone')}
              value={formik.values.telefone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.telefone && Boolean(formik.errors.telefone)}
              helperText={formik.touched.telefone && formik.errors.telefone}
              inputProps={{
                maxLength: 20
              }}
            />
          </Grid>
          
          {/* Segmento */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="segmento"
              name="segmento"
              label={t('cliente.segmento')}
              value={formik.values.segmento}
              onChange={formik.handleChange}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Divider />
          </Grid>
          
          {/* Endereço */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="endereco"
              name="endereco"
              label={t('cliente.endereco')}
              value={formik.values.endereco}
              onChange={formik.handleChange}
              multiline
              rows={2}
            />
          </Grid>
          
          {/* Website */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              id="website"
              name="website"
              label={t('cliente.website')}
              value={formik.values.website}
              onChange={formik.handleChange}
            />
          </Grid>
          
          {/* Anotações */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="anotacoes"
              name="anotacoes"
              label={t('cliente.anotacoes')}
              value={formik.values.anotacoes}
              onChange={formik.handleChange}
              multiline
              rows={4}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          {onCancel && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={onCancel}
              disabled={loading}
            >
              {t('cancelar')}
            </Button>
          )}
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={isEditMode ? <SaveIcon /> : <AddIcon />}
            disabled={loading}
          >
            {isEditMode ? t('salvar') : t('adicionar')}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ClienteForm; 