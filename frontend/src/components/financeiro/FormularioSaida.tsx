/**
 * Componente de formulário de saída financeira
 * 
 * Este componente implementa o formulário de Nova Saída do módulo Financeiro,
 * permitindo o registro detalhado de despesas com os seguintes recursos:
 * 
 * - Campos básicos: descrição, valor, data
 * - Categorização por tipo de despesa
 * - Informações de fornecedor/prestador
 * - Sistema de parcelamento
 * - Formas de pagamento incluindo PIX
 * - Categorização customizável
 * 
 * O formulário utiliza Material UI para layout responsivo em grid,
 * adaptando-se aos diferentes tamanhos de tela conforme solicitado:
 * - Desktop: 2 colunas
 * - Tablet: 1 coluna agrupada
 * - Mobile: 1 coluna vertical
 * 
 * Integração com back-end:
 * - Todos os dados do formulário são enviados via EventBus
 * - Eventos específicos para saídas parceladas 
 * - Validação de campos obrigatórios antes do envio
 */
import React, { useState, useEffect } from 'react';
import {
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  Button,
  Box,
  IconButton,
  Collapse,
  InputAdornment,
  SelectChangeEvent,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  Paper,
  Chip,
  FormHelperText,
  Tooltip
} from '@mui/material';
import { Delete as DeleteIcon, ExpandMore, ExpandLess, Add as AddIcon, Info as InfoIcon } from '@mui/icons-material';
import { format, addMonths } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Transacao, TipoDespesa, FormaPagamento, Parcela } from '../../contexts/FinanceiroContext';
import { EventBus } from '../../services/EventBus';

interface FormularioSaidaProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formErrors: any;
  setFormErrors: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const FormularioSaida: React.FC<FormularioSaidaProps> = ({
  formData,
  setFormData,
  formErrors,
  setFormErrors,
  onSubmit,
  isSubmitting
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [mostrarParcelamento, setMostrarParcelamento] = useState(false);
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [categoriasDisponiveis, setCategoriasDisponiveis] = useState<string[]>([
    'Fornecedores', 'Aluguel', 'Salários', 'Impostos', 'Operacionais', 'Outros'
  ]);
  const [novaCategoria, setNovaCategoria] = useState<string>('');

  // Opções para os campos de dropdown
  const tiposDespesa: TipoDespesa[] = ['fornecedor', 'aluguel', 'salario', 'imposto', 'outros'];
  const formasPagamento: FormaPagamento[] = ['cartao', 'transferencia', 'boleto', 'dinheiro', 'pix', 'outros'];

  // Inicializar os campos adicionais no formData
  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      tipoDespesa: prev.tipoDespesa || 'fornecedor',
      dataPrevistaPagamento: prev.dataPrevistaPagamento || format(new Date(), 'yyyy-MM-dd'),
      parcelamento: prev.parcelamento || { habilitado: false, quantidadeParcelas: 1 },
      fornecedor: prev.fornecedor || '',
      formaPagamento: prev.formaPagamento || 'transferencia',
      numeroDocumento: prev.numeroDocumento || '',
      notaFiscal: prev.notaFiscal || '',
      categoria: prev.categoria || 'Fornecedores',
    }));
  }, [setFormData]);

  // Gerar parcelas quando a quantidade mudar
  useEffect(() => {
    if (formData.parcelamento?.habilitado && formData.parcelamento?.quantidadeParcelas > 0) {
      const quantidade = formData.parcelamento.quantidadeParcelas;
      const valorTotal = parseFloat(formData.valor || 0);
      const valorParcela = valorTotal / quantidade;
      const dataBase = formData.dataPrevistaPagamento || formData.data || format(new Date(), 'yyyy-MM-dd');
      
      const novasParcelas: Parcela[] = [];
      
      for (let i = 0; i < quantidade; i++) {
        novasParcelas.push({
          numero: i + 1,
          valorParcela: valorParcela,
          dataPrevista: format(addMonths(new Date(dataBase), i), 'yyyy-MM-dd'),
          pago: i === 0, // Primeira parcela assume que é paga na data do lançamento
          dataPagamento: i === 0 ? formData.data : undefined
        });
      }
      
      setParcelas(novasParcelas);
      setFormData((prev: any) => ({
        ...prev,
        parcelamento: {
          ...prev.parcelamento,
          parcelas: novasParcelas
        }
      }));
    }
  }, [
    formData.parcelamento?.habilitado, 
    formData.parcelamento?.quantidadeParcelas, 
    formData.valor, 
    formData.dataPrevistaPagamento, 
    formData.data,
    setFormData
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name as string]: value
    }));

    // Limpar erro quando o campo for preenchido
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev: any) => ({
        ...prev,
        [name as string]: ''
      }));
    }
  };

  // Manipulador específico para eventos de Select do MUI
  const handleSelectChange = (e: SelectChangeEvent<any>) => {
    handleChange(e as unknown as React.ChangeEvent<{ name?: string; value: unknown }>);
  };

  const handleParcelamentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setMostrarParcelamento(checked);
    setFormData((prev: any) => ({
      ...prev,
      parcelamento: {
        ...prev.parcelamento,
        habilitado: checked
      }
    }));
  };

  const handleQuantidadeParcelasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setFormData((prev: any) => ({
      ...prev,
      parcelamento: {
        ...prev.parcelamento,
        quantidadeParcelas: value
      }
    }));
  };

  const handleParcelaChange = (index: number, field: keyof Parcela, value: any) => {
    const novasParcelas = [...parcelas];
    novasParcelas[index] = { ...novasParcelas[index], [field]: value };
    
    setParcelas(novasParcelas);
    setFormData((prev: any) => ({
      ...prev,
      parcelamento: {
        ...prev.parcelamento,
        parcelas: novasParcelas
      }
    }));
  };

  const handleAddNovaCategoria = () => {
    if (novaCategoria && !categoriasDisponiveis.includes(novaCategoria)) {
      const novasCategorias = [...categoriasDisponiveis, novaCategoria];
      setCategoriasDisponiveis(novasCategorias);
      setFormData((prev: any) => ({
        ...prev,
        categoria: novaCategoria
      }));
      setNovaCategoria('');
      
      // Feedback visual de sucesso
      const mensagemSucesso = `Nova categoria '${novaCategoria}' adicionada com sucesso`;
      if (typeof window !== 'undefined') {
        // Usar API nativa de notificação do navegador
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Estrateo - Financeiro', {
            body: mensagemSucesso,
            icon: '/logo.png'
          });
        } else {
          // Fallback para console
          console.log(mensagemSucesso);
        }
      }
    }
  };

  const handleSubmitForm = () => {
    // Validar campos obrigatórios
    const errors: Record<string, string> = {};
    if (!formData.descricao) errors.descricao = "Descrição é obrigatória";
    if (!formData.valor) errors.valor = "Valor é obrigatório";
    if (!formData.data) errors.data = "Data é obrigatória";
    
    // Validação condicional: se tipo de despesa for fornecedor, o campo fornecedor é obrigatório
    if (formData.tipoDespesa === 'fornecedor' && !formData.fornecedor) {
      errors.fornecedor = "Fornecedor é obrigatório quando o tipo de despesa é 'Fornecedor'";
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Se for uma saída parcelada, emitir evento específico
    if (formData.parcelamento?.habilitado) {
      // Emite o evento com todos os detalhes do parcelamento
      EventBus.emit('saida.parcelada.criada', {
        ...formData,
        tipo: 'saida',
        parcelas
      });
    } else {
      // Caso não seja uma saída parcelada, emite um evento de saída padrão
      // Todos os campos são enviados, incluindo os novos campos adicionados
      EventBus.emit('saida.criada', {
        ...formData,
        tipo: 'saida'
      });
    }
    
    // Chamar a função de submit do componente pai
    onSubmit();
  };

  return (
    <Grid container spacing={3} sx={{ px: 2, pt: 1 }}>
      {/* Barra de Navegação Rápida - Versão melhorada */}
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ borderRadius: 1, overflow: 'hidden' }}>
          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              bgcolor: theme.palette.error.dark,
              borderBottom: 2,
              borderColor: theme.palette.error.main
            }}
          >
            {[
              { id: 'descricao-section', label: 'Descrição', icon: null },
              { id: 'info-principais-section', label: 'Informações Principais', icon: null },
              { id: 'fornecedor-section', label: 'Fornecedor', icon: null },
              { id: 'categoria-section', label: 'Categoria', icon: null },
              { id: 'parcelamento-section', label: 'Parcelamento', icon: null }
            ].map((item, index) => (
              <React.Fragment key={item.id}>
                <Button 
                  variant="text"
                  size="medium" 
                  onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                  sx={{ 
                    py: 1.5, 
                    px: 2,
                    minWidth: 'auto',
                    color: theme.palette.common.white,
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                    whiteSpace: 'nowrap',
                    borderBottom: 2,
                    borderColor: 'transparent',
                    borderRadius: 0,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderColor: theme.palette.common.white
                    }
                  }}
                >
                  {item.label}
                </Button>
                {index < 4 && <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.3)' }} />}
              </React.Fragment>
            ))}
          </Box>
        </Paper>
      </Grid>
      
      {/* Descrição - Campo completo em cima */}
      <Grid item xs={12} id="descricao-section">
        <Card elevation={3}>
          <CardHeader 
            title="Descrição da Despesa" 
            sx={{ 
              bgcolor: theme.palette.grey[100], 
              py: 1,
              '& .MuiCardHeader-title': {
                fontSize: '1rem',
                fontWeight: 'bold',
                color: theme.palette.text.primary
              }
            }} 
          />
          <CardContent>
            <TextField
              fullWidth
              label="Descrição"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              error={!!formErrors.descricao}
              helperText={formErrors.descricao}
              required
              InputLabelProps={{ 
                style: { fontWeight: 'bold' }
              }}
              placeholder="Descreva esta despesa"
            />
            
            <Box mt={2}>
              <TextField
                fullWidth
                label="Nota Fiscal (opcional)"
                name="notaFiscal"
                value={formData.notaFiscal || ''}
                onChange={handleChange}
                placeholder="Ex: 123456789 ou INV-DE-2025-01"
                InputLabelProps={{ 
                  style: { fontWeight: 'bold' }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Número da nota fiscal ou invoice relacionada a esta despesa">
                        <InfoIcon fontSize="small" color="action" />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Campos básicos */}
      <Grid item xs={12} id="info-principais-section">
        <Card elevation={3} sx={{ bgcolor: 'background.default' }}>
          <CardHeader 
            title="Informações Principais" 
            sx={{ 
              bgcolor: theme.palette.error.light, 
              color: theme.palette.error.contrastText,
              py: 1,
              '& .MuiCardHeader-title': {
                fontSize: '1rem',
                fontWeight: 'bold'
              }
            }} 
          />
          <CardContent>
            <Grid container spacing={2}>
              {/* Primeira linha - Valor e Data */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Valor (€)"
                  name="valor"
                  value={formData.valor}
                  onChange={handleChange}
                  error={!!formErrors.valor}
                  helperText={formErrors.valor}
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                  }}
                  required
                  InputLabelProps={{ 
                    style: { fontWeight: 'bold' }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data do Lançamento"
                  name="data"
                  type="date"
                  value={formData.data}
                  onChange={handleChange}
                  error={!!formErrors.data}
                  helperText={formErrors.data}
                  InputLabelProps={{ shrink: true, style: { fontWeight: 'bold' } }}
                  required
                />
              </Grid>
              
              {/* Segunda linha - Tipo de despesa e Data prevista */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.tipoDespesa}>
                  <InputLabel sx={{ fontWeight: 'bold' }}>Tipo de Despesa</InputLabel>
                  <Select
                    name="tipoDespesa"
                    value={formData.tipoDespesa || ''}
                    onChange={handleSelectChange}
                    label="Tipo de Despesa"
                  >
                    {tiposDespesa.map(tipo => (
                      <MenuItem key={tipo} value={tipo}>
                        {tipo === 'fornecedor' ? 'Fornecedor' : 
                         tipo === 'aluguel' ? 'Aluguel' : 
                         tipo === 'salario' ? 'Salário' : 
                         tipo === 'imposto' ? 'Imposto' : 'Outros'}
                      </MenuItem>
                    ))}
                  </Select>
                  {formErrors.tipoDespesa && (
                    <FormHelperText>{formErrors.tipoDespesa}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Data Prevista de Pagamento"
                  name="dataPrevistaPagamento"
                  type="date"
                  value={formData.dataPrevistaPagamento || ''}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true, style: { fontWeight: 'bold' } }}
                  error={!!formErrors.dataPrevistaPagamento}
                  helperText={formErrors.dataPrevistaPagamento}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Fornecedor */}
      <Grid item xs={12} id="fornecedor-section">
        <Card elevation={3} sx={{ bgcolor: 'background.default' }}>
          <CardHeader 
            title="Informações do Fornecedor" 
            sx={{ 
              bgcolor: theme.palette.secondary.light, 
              color: theme.palette.secondary.contrastText,
              py: 1,
              '& .MuiCardHeader-title': {
                fontSize: '1rem',
                fontWeight: 'bold'
              }
            }} 
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <span>Nome do Fornecedor / Prestador de Serviço</span>
                      {formData.tipoDespesa === 'fornecedor' && (
                        <Chip 
                          label="Obrigatório" 
                          size="small" 
                          color="error" 
                          sx={{ ml: 1, height: '20px', fontSize: '0.7rem' }} 
                        />
                      )}
                    </Box>
                  }
                  name="fornecedor"
                  value={formData.fornecedor || ''}
                  onChange={handleChange}
                  placeholder="Nome do fornecedor ou prestador de serviço"
                  InputLabelProps={{ 
                    style: { fontWeight: 'bold' }
                  }}
                  required={formData.tipoDespesa === 'fornecedor'}
                  error={!!formErrors.fornecedor}
                  helperText={formErrors.fornecedor || (formData.tipoDespesa === 'fornecedor' ? 'Campo obrigatório para tipo Fornecedor' : '')}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 'bold' }}>Forma de Pagamento</InputLabel>
                  <Select
                    name="formaPagamento"
                    value={formData.formaPagamento || ''}
                    onChange={handleSelectChange}
                    label="Forma de Pagamento"
                  >
                    {formasPagamento.map(forma => (
                      <MenuItem key={forma} value={forma}>
                        {forma === 'cartao' ? 'Cartão' :
                         forma === 'transferencia' ? 'Transferência' :
                         forma === 'boleto' ? 'Boleto' :
                         forma === 'dinheiro' ? 'Dinheiro' :
                         forma === 'pix' ? 'PIX' : 'Outros'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Número do Documento"
                  name="numeroDocumento"
                  value={formData.numeroDocumento || ''}
                  onChange={handleChange}
                  placeholder="Nota fiscal, recibo ou contrato"
                  InputLabelProps={{ 
                    style: { fontWeight: 'bold' }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Número da nota fiscal, recibo ou contrato relacionado a esta despesa">
                          <InfoIcon fontSize="small" color="action" />
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Categoria */}
      <Grid item xs={12} id="categoria-section">
        <Card elevation={3} sx={{ bgcolor: 'background.default' }}>
          <CardHeader 
            title="Categorização" 
            sx={{ 
              bgcolor: theme.palette.info.light, 
              color: theme.palette.info.contrastText,
              py: 1,
              '& .MuiCardHeader-title': {
                fontSize: '1rem',
                fontWeight: 'bold'
              }
            }} 
            action={
              <Tooltip title="As categorias ajudam a organizar as despesas para relatórios financeiros. Você pode criar novas categorias conforme necessário.">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            }
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth error={!!formErrors.categoria}>
                  <InputLabel sx={{ fontWeight: 'bold' }}>Categoria</InputLabel>
                  <Select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleSelectChange}
                    label="Categoria"
                  >
                    {categoriasDisponiveis.map(categoria => (
                      <MenuItem key={categoria} value={categoria}>
                        {categoria}
                      </MenuItem>
                    ))}
                    <MenuItem value="personalizado">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AddIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <em>Nova Categoria...</em>
                      </Box>
                    </MenuItem>
                  </Select>
                  {formErrors.categoria && (
                    <FormHelperText>{formErrors.categoria}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              {formData.categoria === 'personalizado' && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      label="Nova Categoria"
                      value={novaCategoria}
                      onChange={(e) => setNovaCategoria(e.target.value)}
                      InputLabelProps={{ 
                        style: { fontWeight: 'bold' }
                      }}
                    />
                    <Button 
                      variant="contained" 
                      color="primary" 
                      onClick={handleAddNovaCategoria}
                      disabled={!novaCategoria}
                      sx={{ minWidth: '120px' }}
                    >
                      Adicionar
                    </Button>
                  </Box>
                </Grid>
              )}
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Observação"
                  name="observacao"
                  value={formData.observacao || ''}
                  onChange={handleChange}
                  InputLabelProps={{ 
                    style: { fontWeight: 'bold' }
                  }}
                  placeholder="Observações adicionais sobre esta despesa"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Parcelamento - Redesenhado para melhor visualização */}
      <Grid item xs={12} id="parcelamento-section">
        <Card elevation={3}>
          <CardHeader 
            title="Parcelamento" 
            sx={{ 
              bgcolor: theme.palette.warning.light, 
              color: theme.palette.warning.contrastText,
              py: 1,
              '& .MuiCardHeader-title': {
                fontSize: '1rem',
                fontWeight: 'bold'
              }
            }} 
          />
          <CardContent>
            <Box mt={1} mb={1}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={!!formData.parcelamento?.habilitado} 
                    onChange={handleParcelamentoChange} 
                    name="parcelamentoHabilitado"
                    color="primary"
                  />
                }
                label={<Typography fontWeight="bold">Habilitar Parcelamento</Typography>}
              />
              
              <IconButton
                onClick={() => setMostrarParcelamento(!mostrarParcelamento)}
                disabled={!formData.parcelamento?.habilitado}
                color="primary"
              >
                {mostrarParcelamento ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            
            <Collapse in={formData.parcelamento?.habilitado && mostrarParcelamento}>
              <Box p={2} border={1} borderColor="divider" borderRadius={1} mt={2} bgcolor={theme.palette.background.paper}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.warning.dark }}>
                  Configurações de Parcelamento
                </Typography>
                
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Quantidade de Parcelas"
                      name="quantidadeParcelas"
                      type="number"
                      value={formData.parcelamento?.quantidadeParcelas || 1}
                      onChange={handleQuantidadeParcelasChange}
                      InputProps={{ 
                        inputProps: { min: 1, max: 36 },
                      }}
                      InputLabelProps={{ 
                        style: { fontWeight: 'bold' }
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                      <Chip 
                        label={`Valor por parcela: ${(parseFloat(formData.valor || '0') / (formData.parcelamento?.quantidadeParcelas || 1)).toFixed(2)}€`} 
                        color="primary" 
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mb: 1, 
                      backgroundColor: theme.palette.warning.light,
                      p: 1,
                      borderRadius: 1
                    }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: theme.palette.warning.contrastText }}>
                        Detalhe das Parcelas
                      </Typography>
                      <Box>
                        <Chip 
                          label={`Total: ${parseFloat(formData.valor || '0').toFixed(2)}€`} 
                          color="default" 
                          size="small"
                          sx={{ fontWeight: 'bold', bgcolor: theme.palette.common.white, mr: 1 }}
                        />
                        <Chip 
                          label={`${formData.parcelamento?.quantidadeParcelas || 1}x de ${(parseFloat(formData.valor || '0') / (formData.parcelamento?.quantidadeParcelas || 1)).toFixed(2)}€`} 
                          color="success" 
                          size="small"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>
                    </Box>
                    
                    <Box sx={{ maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
                      {parcelas.map((parcela, index) => (
                        <Card key={index} variant="outlined" sx={{ 
                          mb: 2, 
                          border: `1px solid ${parcela.pago ? theme.palette.success.light : theme.palette.grey[300]}`,
                          bgcolor: parcela.pago ? 'rgba(76, 175, 80, 0.1)' : 'transparent'
                        }}>
                          <CardContent sx={{ py: 1, pb: '8px !important' }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12}>
                                <Box sx={{ 
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  borderBottom: 1,
                                  borderColor: 'divider',
                                  pb: 0.5
                                }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                                    Parcela {index + 1} de {parcelas.length}
                                  </Typography>
                                  {parcela.pago && (
                                    <Chip label="Pago" size="small" color="success" />
                                  )}
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} sm={4}>
                                <TextField
                                  fullWidth
                                  label="Valor"
                                  type="number"
                                  value={parcela.valorParcela}
                                  onChange={(e) => handleParcelaChange(index, 'valorParcela', parseFloat(e.target.value))}
                                  InputProps={{
                                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                  }}
                                  variant="outlined"
                                  size="small"
                                  InputLabelProps={{ 
                                    style: { fontWeight: 'bold' }
                                  }}
                                />
                              </Grid>
                              
                              <Grid item xs={12} sm={4}>
                                <TextField
                                  fullWidth
                                  label="Data Prevista"
                                  type="date"
                                  value={parcela.dataPrevista}
                                  onChange={(e) => handleParcelaChange(index, 'dataPrevista', e.target.value)}
                                  InputLabelProps={{ shrink: true, style: { fontWeight: 'bold' } }}
                                  variant="outlined"
                                  size="small"
                                />
                              </Grid>
                              
                              <Grid item xs={6} sm={4}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={parcela.pago}
                                      onChange={(e) => handleParcelaChange(index, 'pago', e.target.checked)}
                                      color="success"
                                      size="small"
                                    />
                                  }
                                  label={<Typography fontSize="0.875rem" fontWeight="bold">Pago</Typography>}
                                />
                              </Grid>
                              
                              {parcela.pago && (
                                <Grid item xs={12}>
                                  <TextField
                                    fullWidth
                                    label="Data de Pagamento"
                                    type="date"
                                    value={parcela.dataPagamento || ''}
                                    onChange={(e) => handleParcelaChange(index, 'dataPagamento', e.target.value)}
                                    InputLabelProps={{ shrink: true, style: { fontWeight: 'bold' } }}
                                    variant="outlined"
                                    size="small"
                                  />
                                </Grid>
                              )}
                            </Grid>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            variant="contained"
            color="error"
            onClick={handleSubmitForm}
            disabled={isSubmitting}
            sx={{ fontWeight: 'bold', px: 4, py: 1.5, fontSize: '1rem' }}
          >
            {isSubmitting ? "Processando..." : "Salvar Saída"}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default FormularioSaida; 