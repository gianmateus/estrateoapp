/**
 * Componente de formulário para cadastro e edição de produto no inventário
 * 
 * Este componente implementa um formulário responsivo para a criação e edição
 * de produtos no módulo de Estoque, com suporte a todos os campos necessários.
 */
import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
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
  Warning as WarningIcon,
  Euro as EuroIcon,
  CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { useInventario, ItemInventario } from '../../contexts/InventarioContext';
import api from '../../services/api'; // Importando o cliente axios configurado
import axios from 'axios';

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

// Opções de periodicidade da necessidade de estoque
const PERIODICIDADE_NECESSIDADE = [
  { value: 'diario', label: 'Diário' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'trimestral', label: 'Trimestral' },
];

interface FormularioProdutoProps {
  produtoId?: string;  // Se fornecido, estamos editando um produto existente
  onSave: () => void;  // Callback chamado após salvar com sucesso
  onCancel: () => void; // Callback para cancelar operação
}

// Interface para mapear os nomes de campos locais para os campos da interface ItemInventario
interface FormularioProdutoData {
  nome: string;
  quantidade: number;
  unidadeMedida: string;
  preco: number;
  categoria?: string;
  codigoEAN?: string;
  fornecedor?: string;
  precoCompra?: number;
  dataValidade?: string;
  nivelMinimoEstoque?: number;
  periodicidadeNecessidade: 'diario' | 'semanal' | 'mensal' | 'trimestral'; // Campo obrigatório com tipos específicos
  localizacaoArmazem?: string;
  descricao?: string;
  foto?: string;
}

const FormularioProduto: React.FC<FormularioProdutoProps> = ({
  produtoId,
  onSave,
  onCancel
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();
  const { buscarItem, adicionarItem, atualizarItem } = useInventario();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado do formulário
  const [formData, setFormData] = useState<FormularioProdutoData>({
    nome: '',
    quantidade: 0,
    unidadeMedida: 'unidade',
    preco: 0,
    categoria: 'Outros',
    codigoEAN: '',
    fornecedor: '',
    precoCompra: 0,
    dataValidade: '',
    nivelMinimoEstoque: 0,
    periodicidadeNecessidade: 'semanal', // Valor padrão
    localizacaoArmazem: '',
    descricao: '',
  });
  
  // Estado de erros do formulário
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Carregar dados do produto se estivermos no modo de edição
  useEffect(() => {
    const carregarProduto = async () => {
      if (produtoId) {
        const produto = await buscarItem(produtoId);
        if (produto) {
          setFormData({
            nome: produto.nome,
            quantidade: produto.quantidade,
            unidadeMedida: produto.unidadeMedida,
            preco: produto.preco,
            categoria: produto.categoria,
            codigoEAN: produto.codigoEAN || '',
            fornecedor: produto.fornecedor || '',
            precoCompra: produto.precoCompra || 0,
            dataValidade: produto.dataValidade ? (typeof produto.dataValidade === 'string' ? produto.dataValidade : produto.dataValidade.toISOString().split('T')[0]) : '',
            nivelMinimoEstoque: produto.nivelMinimoEstoque || 0,
            periodicidadeNecessidade: produto.periodicidadeNecessidade || 'semanal',
            localizacaoArmazem: produto.localizacaoArmazem || '',
            descricao: produto.descricao || '',
          });
        }
      }
    };
    carregarProduto();
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
  
  // Validação do formulário
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Validações básicas para campos obrigatórios
    if (!formData.nome || formData.nome.trim() === '') {
      errors.nome = t('campo_obrigatorio') || 'Campo obrigatório';
    }
    
    if (formData.quantidade === undefined || formData.quantidade < 0) {
      errors.quantidade = t('valor_deve_ser_positivo') || 'Valor deve ser positivo';
    }
    
    if (!formData.unidadeMedida) {
      errors.unidadeMedida = t('campo_obrigatorio') || 'Campo obrigatório';
    }
    
    if (formData.preco === undefined || formData.preco < 0) {
      errors.preco = t('valor_deve_ser_positivo') || 'Valor deve ser positivo';
    }
    
    if (formData.precoCompra === undefined || formData.precoCompra < 0) {
      errors.precoCompra = t('valor_deve_ser_positivo') || 'Valor deve ser positivo';
    }
    
    if (formData.precoCompra !== undefined && 
        formData.preco !== undefined && 
        formData.preco < formData.precoCompra) {
      errors.preco = t('preco_venda_menor_custo') || 'Preço de venda não pode ser menor que o custo';
    }
    
    if (formData.nivelMinimoEstoque === undefined || formData.nivelMinimoEstoque < 0) {
      errors.nivelMinimoEstoque = t('valor_deve_ser_positivo') || 'Valor deve ser positivo';
    }
    
    if (!formData.periodicidadeNecessidade) {
      errors.periodicidadeNecessidade = t('campo_obrigatorio') || 'Campo obrigatório';
    }
    
    // Se houver qualquer erro, atualizar o estado de erros
    setFormErrors(errors);
    
    // O formulário é válido se não houver erros
    return Object.keys(errors).length === 0;
  };
  
  // Manipulador para o envio do formulário (para submit via form)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleManualSubmit();
  };
  
  // Versão manual do handleSubmit sem o evento
  const handleManualSubmit = async () => {
    console.log('handleManualSubmit chamado');
    
    // Validar o formulário
    if (!validateForm()) {
      console.error('Validação do formulário falhou:', formErrors);
      return;
    }
    
    setIsSubmitting(true);
    console.log('Iniciando salvamento de produto');
    
    try {
      // Converter valores numéricos e mapear para a interface ItemInventario
      const produtoData: Omit<ItemInventario, 'id' | 'createdAt' | 'updatedAt'> = {
        nome: formData.nome,
        quantidade: Number(formData.quantidade),
        preco: Number(formData.preco),
        unidadeMedida: formData.unidadeMedida,
        codigoEAN: formData.codigoEAN,
        fornecedor: formData.fornecedor,
        precoCompra: Number(formData.precoCompra),
        dataValidade: formData.dataValidade ? new Date(formData.dataValidade) : undefined,
        nivelMinimoEstoque: Number(formData.nivelMinimoEstoque),
        localizacaoArmazem: formData.localizacaoArmazem,
        categoria: formData.categoria,
        descricao: formData.descricao,
        foto: formData.foto,
        periodicidadeNecessidade: formData.periodicidadeNecessidade
      };
      
      console.log('Dados do produto a salvar:', produtoData);
      
      // Função para criar um item local no localStorage quando o backend falha
      const salvarNoLocalStorage = (dados: Omit<ItemInventario, 'id' | 'createdAt' | 'updatedAt'>) => {
        console.log('Salvando produto no localStorage (modo offline)');
        
        const mockId = `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const novoItem: ItemInventario = {
          id: produtoId || mockId, // Usar o ID existente em caso de atualização
          ...dados,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        try {
          const itensAtuais = JSON.parse(localStorage.getItem('mockInventario') || '[]');
          
          if (produtoId) {
            // Se for uma atualização, substitui o item existente
            const index = itensAtuais.findIndex((item: ItemInventario) => item.id === produtoId);
            if (index >= 0) {
              itensAtuais[index] = novoItem;
            } else {
              itensAtuais.push(novoItem);
            }
          } else {
            // Se for novo, adiciona ao array
            itensAtuais.push(novoItem);
          }
          
          localStorage.setItem('mockInventario', JSON.stringify(itensAtuais));
          console.log('Produto salvo com sucesso no localStorage:', novoItem);
          return true;
        } catch (storageError) {
          console.error('Erro ao salvar no localStorage:', storageError);
          return false;
        }
      };
      
      // PRIMEIRA TENTATIVA: Usar o contexto (método preferido)
      try {
        console.log('Tentando salvar via contexto...');
        if (produtoId) {
          await atualizarItem(produtoId, produtoData);
        } else {
          await adicionarItem(produtoData);
        }
        console.log('Produto salvo com sucesso via contexto');
        onSave();
        return;
      } catch (contextError) {
        console.error('Erro ao salvar via contexto:', contextError);
      }
      
      // SEGUNDA TENTATIVA: Chamar a API diretamente
      try {
        console.log('Tentando salvar via chamada direta à API...');
        const baseURL = 'http://localhost:3333/api';
        const url = produtoId 
          ? `${baseURL}/inventario/${produtoId}`
          : `${baseURL}/inventario`;
          
        const token = localStorage.getItem('auth_token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        };
        
        const response = produtoId
          ? await axios.put(url, produtoData, { headers })
          : await axios.post(url, produtoData, { headers });
          
        console.log('Produto salvo com sucesso via API direta:', response.data);
        onSave();
        return;
      } catch (apiError) {
        console.error('Erro ao salvar via API direta:', apiError);
      }
      
      // TERCEIRA TENTATIVA: Salvar localmente no modo offline
      if (salvarNoLocalStorage(produtoData)) {
        console.log('Produto salvo no modo offline com sucesso');
        onSave();
      } else {
        throw new Error('Falha ao salvar no modo offline');
      }
    } catch (error) {
      console.error('Todos os métodos de salvamento falharam:', error);
      alert(`Erro ao salvar o produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" color="primary" align="center" sx={{ mb: 3 }}>
          {produtoId ? "Editar Produto no Inventário" : "Novo Produto no Inventário"}
          <Divider sx={{ mt: 1 }} />
        </Typography>
        
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            {produtoId 
              ? "Atualize os dados do produto conforme necessário." 
              : "Preencha os dados do produto para adicionar ao inventário."}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Campos marcados com * são obrigatórios.
          </Typography>
        </Box>
        
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
                      name="codigoEAN"
                      value={formData.codigoEAN || ''}
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
                    <FormControl fullWidth required error={!!formErrors.unidadeMedida}>
                      <InputLabel>{t('unidade') || 'Unidade'}</InputLabel>
                      <Select
                        name="unidadeMedida"
                        value={formData.unidadeMedida || 'unidade'}
                        onChange={handleSelectChange}
                        label={t('unidade') || 'Unidade'}
                      >
                        {UNIDADES.map(option => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors.unidadeMedida && (
                        <FormHelperText>{formErrors.unidadeMedida}</FormHelperText>
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
                      name="precoCompra"
                      value={formData.precoCompra || ''}
                      onChange={handleChange}
                      error={!!formErrors.precoCompra}
                      helperText={formErrors.precoCompra}
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
                      name="preco"
                      value={formData.preco || ''}
                      onChange={handleChange}
                      error={!!formErrors.preco}
                      helperText={formErrors.preco}
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
                      name="localizacaoArmazem"
                      value={formData.localizacaoArmazem || ''}
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
          
          {/* Seção de Estoque */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                  <InventoryIcon sx={{ mr: 1 }} />
                  {t('Informações de Estoque')}
                </Typography>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="quantidade"
                      label={t('Quantidade')}
                      value={formData.quantidade}
                      onChange={handleChange}
                      fullWidth
                      required
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {formData.unidadeMedida}
                          </InputAdornment>
                        ),
                      }}
                      error={!!formErrors.quantidade}
                      helperText={formErrors.quantidade}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth required>
                      <InputLabel>{t('Unidade de Medida')}</InputLabel>
                      <Select
                        name="unidadeMedida"
                        value={formData.unidadeMedida}
                        onChange={handleSelectChange}
                        label={t('Unidade de Medida')}
                        error={!!formErrors.unidadeMedida}
                      >
                        {UNIDADES.map((unidade) => (
                          <MenuItem key={unidade.value} value={unidade.value}>
                            {unidade.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors.unidadeMedida && (
                        <FormHelperText error>{formErrors.unidadeMedida}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <TextField
                      name="nivelMinimoEstoque"
                      label={t('Nível Mínimo de Estoque')}
                      value={formData.nivelMinimoEstoque}
                      onChange={handleChange}
                      fullWidth
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {formData.unidadeMedida}
                          </InputAdornment>
                        ),
                        startAdornment: (
                          <Tooltip title={t('Quantidade mínima para gerar alertas de baixo estoque')}>
                            <InputAdornment position="start">
                              <WarningIcon color="warning" fontSize="small" />
                            </InputAdornment>
                          </Tooltip>
                        ),
                      }}
                      error={!!formErrors.nivelMinimoEstoque}
                      helperText={formErrors.nivelMinimoEstoque}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          {/* NOVA SEÇÃO: Necessidade Periódica */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                  <CalendarMonthIcon sx={{ mr: 1 }} />
                  {t('Necessidade Periódica')}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t('Defina a quantidade necessária por período para cálculo automático de sugestões de compra')}
                  </Typography>
                </Box>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>{t('Periodicidade')}</InputLabel>
                      <Select
                        name="periodicidadeNecessidade"
                        value={formData.periodicidadeNecessidade}
                        onChange={handleSelectChange}
                        label={t('Periodicidade')}
                        error={!!formErrors.periodicidadeNecessidade}
                      >
                        {PERIODICIDADE_NECESSIDADE.map((periodo) => (
                          <MenuItem key={periodo.value} value={periodo.value}>
                            {periodo.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {formErrors.periodicidadeNecessidade && (
                        <FormHelperText error>{formErrors.periodicidadeNecessidade}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="nivelMinimoEstoque"
                      label={t('Quantidade Necessária')}
                      value={formData.nivelMinimoEstoque}
                      onChange={handleChange}
                      fullWidth
                      required
                      type="number"
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {formData.unidadeMedida}
                          </InputAdornment>
                        ),
                        startAdornment: (
                          <Tooltip title={t('Quantidade necessária para o período selecionado')}>
                            <InputAdornment position="start">
                              <InfoIcon color="primary" fontSize="small" />
                            </InputAdornment>
                          </Tooltip>
                        ),
                      }}
                      error={!!formErrors.nivelMinimoEstoque}
                      helperText={formErrors.nivelMinimoEstoque || t('Ex: para consumo diário de 5kg, coloque 5')}
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
                      name="nivelMinimoEstoque"
                      value={formData.nivelMinimoEstoque || ''}
                      onChange={handleChange}
                      error={!!formErrors.nivelMinimoEstoque}
                      helperText={formErrors.nivelMinimoEstoque || (t('alerta_estoque_minimo') || 'Quantidade que ativa alertas')}
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
            type="button"
            variant="contained"
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
            disabled={isSubmitting}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Clique no botão de salvar detectado');
              handleManualSubmit();
            }}
          >
            {isSubmitting ? (t('salvando') || 'Salvando...') : (t('salvar') || 'Salvar')}
          </Button>
        </Box>
      </Box>
    </form>
  );
};

export default FormularioProduto; 