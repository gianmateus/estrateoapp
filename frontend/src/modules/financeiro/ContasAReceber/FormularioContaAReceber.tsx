import React, { useState } from 'react';
import { 
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  IconButton,
  InputAdornment,
  Switch,
  FormControlLabel,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useFinanceiro, FormaPagamento, TipoEntrada, StatusRecebimento } from '../../../contexts/FinanceiroContext';

interface FormularioContaAReceberProps {
  onClose?: () => void;
}

const FormularioContaAReceber: React.FC<FormularioContaAReceberProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { adicionarTransacao } = useFinanceiro();
  
  // Estado do formulário
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    data: new Date().toISOString().split('T')[0],
    categoria: '',
    cliente: '',
    observacao: '',
    notaFiscal: '',
    formaPagamento: 'transferencia' as FormaPagamento,
    temParcelamento: false,
    quantidadeParcelas: 1
  });
  
  // Estado de erros
  const [erros, setErros] = useState({
    descricao: false,
    valor: false,
    data: false,
    categoria: false
  });
  
  // Categorias de entradas
  const categorias = [
    { valor: 'venda', label: t('tipoEntrada.venda') },
    { valor: 'aluguel', label: t('tipoEntrada.aluguel') },
    { valor: 'servico', label: t('tipoEntrada.servico') },
    { valor: 'comissao', label: t('tipoEntrada.comissao') },
    { valor: 'outros', label: t('tipoEntrada.outros') }
  ];
  
  // Formas de pagamento
  const formasPagamento = [
    { valor: 'transferencia', label: t('formaPagamento.transferencia') },
    { valor: 'cartao', label: t('formaPagamento.cartao') },
    { valor: 'dinheiro', label: t('formaPagamento.dinheiro') },
    { valor: 'pix', label: t('formaPagamento.pix') },
    { valor: 'boleto', label: t('formaPagamento.boleto') },
    { valor: 'outros', label: t('formaPagamento.outros') }
  ];
  
  // Atualizar campo do formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value
    });
    
    // Limpar erro ao editar
    if (name && erros[name as keyof typeof erros] !== undefined) {
      setErros({
        ...erros,
        [name]: false
      });
    }
  };
  
  // Lidar com select change
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name as string]: value
    });
    
    if (name && erros[name as keyof typeof erros] !== undefined) {
      setErros({
        ...erros,
        [name]: false
      });
    }
  };
  
  // Lidar com o toggle de parcelamento
  const handleToggleParcelamento = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      temParcelamento: e.target.checked,
      quantidadeParcelas: e.target.checked ? formData.quantidadeParcelas : 1
    });
  };
  
  // Validar o formulário
  const validarFormulario = () => {
    const novosErros = {
      descricao: formData.descricao.trim() === '',
      valor: formData.valor === '' || parseFloat(formData.valor) <= 0,
      data: formData.data === '',
      categoria: formData.categoria === ''
    };
    
    setErros(novosErros);
    
    return !Object.values(novosErros).some(Boolean);
  };
  
  // Enviar o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarFormulario()) {
      return;
    }
    
    // Criar parcelas se houver parcelamento
    let parcelamento = undefined;
    
    if (formData.temParcelamento && formData.quantidadeParcelas > 1) {
      const parcelas = [];
      const valorParcela = parseFloat(formData.valor) / formData.quantidadeParcelas;
      const dataBase = new Date(formData.data);
      
      for (let i = 0; i < formData.quantidadeParcelas; i++) {
        const dataParcela = new Date(dataBase);
        dataParcela.setMonth(dataBase.getMonth() + i);
        
        parcelas.push({
          numero: i + 1,
          valorParcela,
          dataPrevista: dataParcela.toISOString(),
          pago: false
        });
      }
      
      parcelamento = {
        quantidadeParcelas: formData.quantidadeParcelas,
        parcelas
      };
    }
    
    // Criar objeto de transação
    const novaTransacao = {
      tipo: 'entrada' as const,
      descricao: formData.descricao,
      valor: parseFloat(formData.valor),
      data: formData.data,
      categoria: formData.categoria,
      cliente: formData.cliente,
      observacao: formData.observacao,
      notaFiscal: formData.notaFiscal,
      formaPagamento: formData.formaPagamento,
      tipoEntrada: formData.categoria as TipoEntrada,
      statusRecebimento: 'pendente' as StatusRecebimento,
      parcelamento
    };
    
    // Adicionar transação
    adicionarTransacao(novaTransacao);
    
    // Resetar formulário ou fechar
    if (onClose) {
      onClose();
    } else {
      setFormData({
        descricao: '',
        valor: '',
        data: new Date().toISOString().split('T')[0],
        categoria: '',
        cliente: '',
        observacao: '',
        notaFiscal: '',
        formaPagamento: 'transferencia' as FormaPagamento,
        temParcelamento: false,
        quantidadeParcelas: 1
      });
    }
  };
  
  return (
    <Paper sx={{ p: 3, maxWidth: '800px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          {t('novaContaAReceber')}
        </Typography>
        
        {onClose && (
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Campos básicos */}
          <Grid item xs={12} md={6}>
            <TextField
              name="descricao"
              label={t('descricao')}
              fullWidth
              required
              value={formData.descricao}
              onChange={handleChange}
              error={erros.descricao}
              helperText={erros.descricao ? t('campoObrigatorio') : ''}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="valor"
              label={t('valor')}
              fullWidth
              required
              type="number"
              InputProps={{
                startAdornment: <InputAdornment position="start">€</InputAdornment>,
              }}
              value={formData.valor}
              onChange={handleChange}
              error={erros.valor}
              helperText={erros.valor ? t('valorDeveSerPositivo') : ''}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="data"
              label={t('dataPrevistaRecebimento')}
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.data}
              onChange={handleChange}
              error={erros.data}
              helperText={erros.data ? t('campoObrigatorio') : ''}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={erros.categoria}>
              <InputLabel>{t('categoria')}</InputLabel>
              <Select
                name="categoria"
                value={formData.categoria}
                onChange={handleSelectChange}
                label={t('categoria')}
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat.valor} value={cat.valor}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
              {erros.categoria && (
                <FormHelperText>{t('campoObrigatorio')}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="cliente"
              label={t('cliente')}
              fullWidth
              value={formData.cliente}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>{t('formaPagamento')}</InputLabel>
              <Select
                name="formaPagamento"
                value={formData.formaPagamento}
                onChange={handleSelectChange}
                label={t('formaPagamento')}
              >
                {formasPagamento.map((forma) => (
                  <MenuItem key={forma.valor} value={forma.valor}>
                    {forma.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              name="notaFiscal"
              label={t('notaFiscal')}
              fullWidth
              value={formData.notaFiscal}
              onChange={handleChange}
            />
          </Grid>
          
          {/* Parcelamento */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch 
                  checked={formData.temParcelamento}
                  onChange={handleToggleParcelamento}
                />
              }
              label={t('parcelamento')}
            />
            
            {formData.temParcelamento && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  name="quantidadeParcelas"
                  label={t('quantidadeParcelas')}
                  type="number"
                  value={formData.quantidadeParcelas}
                  onChange={handleChange}
                  InputProps={{ 
                    inputProps: { min: 2, max: 24 } 
                  }}
                  sx={{ width: '200px' }}
                />
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              name="observacao"
              label={t('observacao')}
              fullWidth
              multiline
              rows={3}
              value={formData.observacao}
              onChange={handleChange}
            />
          </Grid>
          
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              startIcon={<AddIcon />}
              fullWidth
            >
              {t('adicionarContaAReceber')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default FormularioContaAReceber; 