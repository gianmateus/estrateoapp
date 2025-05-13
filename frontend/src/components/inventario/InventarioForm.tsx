import React, { useState, useEffect, ReactNode } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  InputAdornment,
  Divider,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { ItemInventario } from '../../contexts/InventarioContext';

interface InventarioFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: any) => void;
  item?: ItemInventario;
  categorias: string[];
}

interface FormErrors {
  [key: string]: string;
}

const unidadesMedida = [
  { value: 'unidade', label: 'Unidade' },
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'g', label: 'Grama (g)' },
  { value: 'litro', label: 'Litro (L)' },
  { value: 'ml', label: 'Mililitro (ml)' },
  { value: 'caixa', label: 'Caixa' },
  { value: 'pacote', label: 'Pacote' },
  { value: 'peca', label: 'Peça' }
];

const InventarioForm: React.FC<InventarioFormProps> = ({
  open,
  onClose,
  onSubmit,
  item,
  categorias
}) => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: 0,
    preco: 0,
    codigoEAN: '',
    fornecedor: '',
    precoCompra: 0,
    unidadeMedida: 'unidade',
    dataValidade: null as Date | null,
    nivelMinimoEstoque: 0,
    localizacaoArmazem: '',
    categoria: '',
    descricao: '',
    foto: ''
  });

  useEffect(() => {
    if (item) {
      // Converter a data de validade de string para Date, se existir
      let dataValidade = null;
      if (item.dataValidade) {
        dataValidade = typeof item.dataValidade === 'string' 
          ? new Date(item.dataValidade) 
          : item.dataValidade;
      }

      setFormData({
        nome: item.nome || '',
        quantidade: item.quantidade || 0,
        preco: item.preco || 0,
        codigoEAN: item.codigoEAN || '',
        fornecedor: item.fornecedor || '',
        precoCompra: item.precoCompra || 0,
        unidadeMedida: item.unidadeMedida || 'unidade',
        dataValidade,
        nivelMinimoEstoque: item.nivelMinimoEstoque || 0,
        localizacaoArmazem: item.localizacaoArmazem || '',
        categoria: item.categoria || '',
        descricao: item.descricao || '',
        foto: item.foto || ''
      });
    } else {
      // Reset form quando não há item ou modal é aberto
      setFormData({
        nome: '',
        quantidade: 0,
        preco: 0,
        codigoEAN: '',
        fornecedor: '',
        precoCompra: 0,
        unidadeMedida: 'unidade',
        dataValidade: null,
        nivelMinimoEstoque: 0,
        localizacaoArmazem: '',
        categoria: '',
        descricao: '',
        foto: ''
      });
    }
    setErrors({});
  }, [item, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Limpar erro ao editar o campo
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    }
  };

  // Handler específico para selects
  const handleSelectChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
    const { name, value } = event.target;
    if (name) {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Limpar erro ao editar o campo
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: ''
        });
      }
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({
      ...formData,
      dataValidade: date
    });
    
    // Limpar erro ao editar o campo
    if (errors.dataValidade) {
      setErrors({
        ...errors,
        dataValidade: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = t('O nome do produto é obrigatório');
    }
    
    if (formData.quantidade < 0) {
      newErrors.quantidade = t('A quantidade não pode ser negativa');
    }
    
    if (formData.preco < 0) {
      newErrors.preco = t('O preço de venda não pode ser negativo');
    }
    
    if (formData.precoCompra < 0) {
      newErrors.precoCompra = t('O preço de compra não pode ser negativo');
    }
    
    if (formData.nivelMinimoEstoque < 0) {
      newErrors.nivelMinimoEstoque = t('O nível mínimo não pode ser negativo');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Preparar dados para envio
      const formattedData = {
        ...formData,
        quantidade: Number(formData.quantidade),
        preco: Number(formData.preco),
        precoCompra: Number(formData.precoCompra),
        nivelMinimoEstoque: Number(formData.nivelMinimoEstoque)
      };
      
      onSubmit(formattedData);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth 
      maxWidth="md"
    >
      <DialogTitle>
        {item ? t('Editar Item do Inventário') : t('Adicionar Novo Item ao Inventário')}
      </DialogTitle>
      
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {t('Informações Básicas')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="nome"
                label={t('Nome do Produto')}
                value={formData.nome}
                onChange={handleChange}
                error={!!errors.nome}
                helperText={errors.nome}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="codigoEAN"
                label={t('Código EAN')}
                value={formData.codigoEAN}
                onChange={handleChange}
                error={!!errors.codigoEAN}
                helperText={errors.codigoEAN}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="quantidade"
                label={t('Quantidade')}
                value={formData.quantidade}
                onChange={handleChange}
                type="number"
                error={!!errors.quantidade}
                helperText={errors.quantidade}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>{t('Unidade de Medida')}</InputLabel>
                <Select
                  name="unidadeMedida"
                  value={formData.unidadeMedida}
                  onChange={handleSelectChange}
                  label={t('Unidade de Medida')}
                  disabled={isSubmitting}
                >
                  {unidadesMedida.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="nivelMinimoEstoque"
                label={t('Nível Mínimo de Estoque')}
                value={formData.nivelMinimoEstoque}
                onChange={handleChange}
                type="number"
                error={!!errors.nivelMinimoEstoque}
                helperText={errors.nivelMinimoEstoque}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>{t('Categoria')}</InputLabel>
                <Select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleSelectChange}
                  label={t('Categoria')}
                  disabled={isSubmitting}
                >
                  {categorias.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                  <MenuItem value="other">{t('Outra')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3 }} gutterBottom>
            {t('Informações de Preço')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="preco"
                label={t('Preço de Venda')}
                value={formData.preco}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
                error={!!errors.preco}
                helperText={errors.preco}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="precoCompra"
                label={t('Preço de Compra')}
                value={formData.precoCompra}
                onChange={handleChange}
                type="number"
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
                error={!!errors.precoCompra}
                helperText={errors.precoCompra}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="fornecedor"
                label={t('Fornecedor')}
                value={formData.fornecedor}
                onChange={handleChange}
                error={!!errors.fornecedor}
                helperText={errors.fornecedor}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                <DatePicker
                  label={t('Data de Validade')}
                  value={formData.dataValidade}
                  onChange={handleDateChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.dataValidade,
                      helperText: errors.dataValidade,
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 3 }} gutterBottom>
            {t('Informações Adicionais')}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="localizacaoArmazem"
                label={t('Localização no Armazém')}
                value={formData.localizacaoArmazem}
                onChange={handleChange}
                error={!!errors.localizacaoArmazem}
                helperText={errors.localizacaoArmazem}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                name="foto"
                label={t('URL da Foto')}
                value={formData.foto}
                onChange={handleChange}
                error={!!errors.foto}
                helperText={errors.foto}
                disabled={isSubmitting}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="descricao"
                label={t('Descrição')}
                value={formData.descricao}
                onChange={handleChange}
                multiline
                rows={3}
                error={!!errors.descricao}
                helperText={errors.descricao}
                disabled={isSubmitting}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          {t('Cancelar')}
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained" 
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? t('Salvando...') : t('Salvar')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InventarioForm; 