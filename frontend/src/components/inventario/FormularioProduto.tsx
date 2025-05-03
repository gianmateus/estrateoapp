/**
 * Componente de formulário para cadastro e edição de produto no inventário
 * 
 * Este componente implementa um formulário responsivo para a criação e edição
 * de produtos no módulo de Estoque, com suporte a todos os campos necessários.
 */
import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Button,
  Box,
  InputAdornment,
  Tooltip,
  FormHelperText,
  Chip,
  Autocomplete,
  Card,
  CardContent,
  Divider,
  IconButton,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Info as InfoIcon,
  QrCode as QrCodeIcon,
  Inventory as InventoryIcon,
  Store as StoreIcon,
  DateRange as DateRangeIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useInventario, ItemInventario } from '../../contexts/InventarioContext';

// Lista de fornecedores mockados (deve ser substituída por dados reais da API)
const FORNECEDORES = [
  { id: '1', nome: 'Fornecedor A' },
  { id: '2', nome: 'Fornecedor B' },
  { id: '3', nome: 'Fornecedor C' },
  { id: '4', nome: 'Fornecedor D' },
];

// Tipos de unidades disponíveis
const UNIDADES = [
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'g', label: 'Grama (g)' },
  { value: 'unidade', label: 'Unidade' },
  { value: 'caixa', label: 'Caixa' },
  { value: 'ml', label: 'Mililitro (ml)' },
  { value: 'litro', label: 'Litro' },
];

// Categorias disponíveis
const CATEGORIAS = [
  'Alimentos', 
  'Bebidas', 
  'Produtos de Limpeza', 
  'Embalagens', 
  'Condimentos',
  'Outros'
];

interface FormularioProdutoProps {
  produtoId?: string;  // Se fornecido, estamos editando um produto existente
  onSave: () => void;  // Callback chamado após salvar com sucesso
  onCancel: () => void; // Callback para cancelar operação
}

const FormularioProduto: React.FC<FormularioProdutoProps> = ({
  produtoId,
  onSave,
  onCancel
}) => {
  const { t } = useTranslation();
  const { buscarItem, adicionarItem, atualizarItem } = useInventario();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado do formulário
  const [formData, setFormData] = useState<Partial<ItemInventario>>({
    nome: '',
    quantidade: 0,
    unidade: 'unidade',
    precoUnitario: 0,
    categoria: 'Outros',
    codigoSKU: '',
    fornecedor: '',
    precoCusto: 0,
    precoVenda: 0,
    dataValidade: '',
    quantidadeMinima: 0,
    localArmazenamento: '',
  });
  
  // Estado de erros do formulário
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Carregar dados do produto se estivermos no modo de edição
  useEffect(() => {
    if (produtoId) {
      const produto = buscarItem(produtoId);
      if (produto) {
        setFormData({
          nome: produto.nome,
          quantidade: produto.quantidade,
          unidade: produto.unidade,
          precoUnitario: produto.precoUnitario,
          categoria: produto.categoria,
          codigoSKU: produto.codigoSKU || '',
          fornecedor: produto.fornecedor || '',
          precoCusto: produto.precoCusto || 0,
          precoVenda: produto.precoVenda || 0,
          dataValidade: produto.dataValidade || '',
          quantidadeMinima: produto.quantidadeMinima || 0,
          localArmazenamento: produto.localArmazenamento || '',
        });
      }
    }
  }, [produtoId, buscarItem]);
  
  // Manipulador para alterações nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name as string]: value
    }));
    
    // Limpar erro quando o campo for alterado
    if (formErrors[name as string]) {
      setFormErrors((prev) => ({
        ...prev,
        [name as string]: ''
      }));
    }
  };
  
  // Manipulador específico para o componente Select
  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name as string]: value
    }));
    
    // Limpar erro quando o campo for alterado
    if (formErrors[name as string]) {
      setFormErrors((prev) => ({
        ...prev,
        [name as string]: ''
      }));
    }
  };
  
  // Manipulador para o campo de fornecedor (Autocomplete)
  const handleFornecedorChange = (event: React.SyntheticEvent, newValue: string | null) => {
    setFormData((prev) => ({
      ...prev,
      fornecedor: newValue || ''
    }));
    
    // Limpar erro
    if (formErrors.fornecedor) {
      setFormErrors((prev) => ({
        ...prev,
        fornecedor: ''
      }));
    }
  };
  
  // Manipulador para a data de validade
  const handleDataValidadeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      dataValidade: value
    }));
    
    // Verificar se a data é anterior à data atual
    if (value) {
      const dataValidade = new Date(value);
      const hoje = new Date();
      
      if (dataValidade < hoje) {
        setFormErrors((prev) => ({
          ...prev,
          dataValidade: t('data_validade_passada') || 'Data de validade não pode ser anterior à data atual'
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          dataValidade: ''
        }));
      }
    }
  };
  
  // Validar o formulário antes de enviar
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validações básicas para campos obrigatórios
    if (!formData.nome || formData.nome.trim() === '') {
      errors.nome = t('campo_obrigatorio') || 'Campo obrigatório';
    }
    
    if (formData.quantidade === undefined || formData.quantidade < 0) {
      errors.quantidade = t('valor_deve_ser_positivo') || 'Valor deve ser positivo';
    }
    
    if (!formData.unidade) {
      errors.unidade = t('campo_obrigatorio') || 'Campo obrigatório';
    }
    
    if (formData.precoUnitario === undefined || formData.precoUnitario < 0) {
      errors.precoUnitario = t('valor_deve_ser_positivo') || 'Valor deve ser positivo';
    }
    
    if (formData.precoCusto === undefined || formData.precoCusto < 0) {
      errors.precoCusto = t('valor_deve_ser_positivo') || 'Valor deve ser positivo';
    }
    
    if (formData.precoVenda === undefined || formData.precoVenda < 0) {
      errors.precoVenda = t('valor_deve_ser_positivo') || 'Valor deve ser positivo';
    }
    
    if (formData.precoVenda !== undefined && 
        formData.precoCusto !== undefined && 
        formData.precoVenda < formData.precoCusto) {
      errors.precoVenda = t('preco_venda_menor_custo') || 'Preço de venda não pode ser menor que o custo';
    }
    
    if (formData.quantidadeMinima === undefined || formData.quantidadeMinima < 0) {
      errors.quantidadeMinima = t('valor_deve_ser_positivo') || 'Valor deve ser positivo';
    }
    
    // Se houver qualquer erro, atualizar o estado de erros
    setFormErrors(errors);
    
    // O formulário é válido se não houver erros
    return Object.keys(errors).length === 0;
  };
  
  // Manipulador para o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar o formulário
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Converter valores numéricos
      const produtoData = {
        ...formData,
        quantidade: Number(formData.quantidade),
        precoUnitario: Number(formData.precoUnitario),
        precoCusto: Number(formData.precoCusto),
        precoVenda: Number(formData.precoVenda),
        quantidadeMinima: Number(formData.quantidadeMinima),
      } as Omit<ItemInventario, 'id' | 'dataAtualizacao'>;
      
      // Se estamos editando ou criando um novo produto
      if (produtoId) {
        await atualizarItem(produtoId, produtoData);
      } else {
        await adicionarItem(produtoData);
      }
      
      // Chamar o callback de sucesso
      onSave();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      // Aqui poderia adicionar um toast ou mensagem de erro
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          {produtoId ? t('editar_produto') || 'Editar Produto' : t('novo_produto') || 'Novo Produto'}
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {/* Seção de Informações Básicas */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t('informacoes_basicas') || 'Informações Básicas'}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      required
                      label={t('nome_produto') || 'Nome do Produto'}
                      name="nome"
                      value={formData.nome || ''}
                      onChange={handleChange}
                      error={!!formErrors.nome}
                      helperText={formErrors.nome}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('codigo_sku') || 'Código de Barras / SKU'}
                      name="codigoSKU"
                      value={formData.codigoSKU || ''}
                      onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <QrCodeIcon />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title={t('tooltip_codigo_sku') || 'Código único para identificação do produto'}>
                              <InfoIcon fontSize="small" color="action" />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label={t('quantidade') || 'Quantidade'}
                      name="quantidade"
                      value={formData.quantidade || ''}
                      onChange={handleChange}
                      error={!!formErrors.quantidade}
                      helperText={formErrors.quantidade}
                      InputProps={{
                        inputProps: { min: 0, step: 0.01 }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth required error={!!formErrors.unidade}>
                      <InputLabel>{t('unidade') || 'Unidade'}</InputLabel>
                      <Select
                        name="unidade"
                        value={formData.unidade || 'unidade'}
                        onChange={handleSelectChange}
                        label={t('unidade') || 'Unidade'}
                      >
                        {UNIDADES.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors.unidade && (
                        <FormHelperText>{formErrors.unidade}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth required>
                      <InputLabel>{t('categoria') || 'Categoria'}</InputLabel>
                      <Select
                        name="categoria"
                        value={formData.categoria || 'Outros'}
                        onChange={handleSelectChange}
                        label={t('categoria') || 'Categoria'}
                      >
                        {CATEGORIAS.map(categoria => (
                          <MenuItem key={categoria} value={categoria}>
                            {categoria}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Seção de Preços */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t('informacoes_precos') || 'Informações de Preços'}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label={t('preco_custo') || 'Preço de Custo'}
                      name="precoCusto"
                      value={formData.precoCusto || ''}
                      onChange={handleChange}
                      error={!!formErrors.precoCusto}
                      helperText={formErrors.precoCusto}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        inputProps: { min: 0, step: 0.01 },
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title={t('tooltip_preco_custo') || 'Valor pago ao fornecedor'}>
                              <InfoIcon fontSize="small" color="action" />
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label={t('preco_venda') || 'Preço de Venda'}
                      name="precoVenda"
                      value={formData.precoVenda || ''}
                      onChange={handleChange}
                      error={!!formErrors.precoVenda}
                      helperText={formErrors.precoVenda}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        inputProps: { min: 0, step: 0.01 }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      type="number"
                      label={t('preco_unitario') || 'Preço Unitário'}
                      name="precoUnitario"
                      value={formData.precoUnitario || ''}
                      onChange={handleChange}
                      error={!!formErrors.precoUnitario}
                      helperText={formErrors.precoUnitario}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">€</InputAdornment>,
                        inputProps: { min: 0, step: 0.01 }
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Seção de Fornecedor e Armazenamento */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t('fornecedor_armazenamento') || 'Fornecedor e Armazenamento'}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      freeSolo
                      options={FORNECEDORES.map(f => f.nome)}
                      value={formData.fornecedor || null}
                      onChange={handleFornecedorChange}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t('fornecedor') || 'Fornecedor'}
                          name="fornecedor"
                          error={!!formErrors.fornecedor}
                          helperText={formErrors.fornecedor}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <StoreIcon />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('local_armazenamento') || 'Local de Armazenamento'}
                      name="localArmazenamento"
                      value={formData.localArmazenamento || ''}
                      onChange={handleChange}
                      placeholder={t('ex_prateleira_a5') || 'Ex: Prateleira A5, Freezer 2'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <InventoryIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Seção de Controle de Estoque */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {t('controle_estoque') || 'Controle de Estoque'}
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      type="number"
                      label={t('quantidade_minima') || 'Quantidade Mínima'}
                      name="quantidadeMinima"
                      value={formData.quantidadeMinima || ''}
                      onChange={handleChange}
                      error={!!formErrors.quantidadeMinima}
                      helperText={formErrors.quantidadeMinima || (t('alerta_estoque_minimo') || 'Quantidade que ativa alertas')}
                      InputProps={{
                        inputProps: { min: 0 },
                        startAdornment: (
                          <InputAdornment position="start">
                            <WarningIcon color="warning" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="date"
                      label={t('data_validade') || 'Data de Validade'}
                      name="dataValidade"
                      value={formData.dataValidade || ''}
                      onChange={handleDataValidadeChange}
                      error={!!formErrors.dataValidade}
                      helperText={formErrors.dataValidade}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <DateRangeIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onCancel}
            startIcon={<CancelIcon />}
            disabled={isSubmitting}
          >
            {t('cancelar') || 'Cancelar'}
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={isSubmitting}
          >
            {isSubmitting ? (t('salvando') || 'Salvando...') : (t('salvar') || 'Salvar')}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default FormularioProduto; 