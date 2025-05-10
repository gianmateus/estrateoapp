/**
 * Componente de formulário de entrada financeira
 * 
 * Form component for financial income entries
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
  Paper
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { format, addMonths } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { Transacao, TipoEntrada, StatusRecebimento, FormaPagamento, Parcela } from '../../contexts/FinanceiroContext';
import { EventBus } from '../../services/EventBus';

interface FormularioEntradaProps {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formErrors: any;
  setFormErrors: React.Dispatch<React.SetStateAction<any>>;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const FormularioEntrada: React.FC<FormularioEntradaProps> = ({
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
    'Vendas', 'Serviços', 'Aluguel', 'Investimentos', 'Outros'
  ]);

  // Opções para os novos campos
  const tiposEntrada: TipoEntrada[] = ['venda', 'aluguel', 'servico', 'comissao', 'outros'];
  const statusRecebimento: StatusRecebimento[] = ['recebido', 'pendente', 'parcialmente_recebido'];
  const formasPagamento: FormaPagamento[] = ['cartao', 'transferencia', 'boleto', 'dinheiro', 'outros'];

  // Inicializar os campos adicionais no formData
  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      tipoEntrada: prev.tipoEntrada || 'venda',
      statusRecebimento: prev.statusRecebimento || 'recebido',
      dataPrevistaRecebimento: prev.dataPrevistaRecebimento || format(new Date(), 'yyyy-MM-dd'),
      parcelamento: prev.parcelamento || { habilitado: false, quantidadeParcelas: 1 },
      cliente: prev.cliente || '',
      formaPagamento: prev.formaPagamento || 'transferencia',
      numeroDocumento: prev.numeroDocumento || '',
      categoria: prev.categoria || 'Vendas',
    }));
  }, [setFormData]);

  // Gerar parcelas quando a quantidade mudar
  useEffect(() => {
    if (formData.parcelamento?.habilitado && formData.parcelamento?.quantidadeParcelas > 0) {
      const quantidade = formData.parcelamento.quantidadeParcelas;
      const valorTotal = parseFloat(formData.valor || 0);
      const valorParcela = valorTotal / quantidade;
      const dataBase = formData.dataPrevistaRecebimento || formData.data || format(new Date(), 'yyyy-MM-dd');
      
      const novasParcelas: Parcela[] = [];
      
      for (let i = 0; i < quantidade; i++) {
        novasParcelas.push({
          numero: i + 1,
          valorParcela: valorParcela,
          dataPrevista: format(addMonths(new Date(dataBase), i), 'yyyy-MM-dd'),
          pago: i === 0 && formData.statusRecebimento === 'recebido',
          dataPagamento: i === 0 && formData.statusRecebimento === 'recebido' ? formData.data : undefined
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
    formData.dataPrevistaRecebimento, 
    formData.data,
    formData.statusRecebimento,
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

  const handleSubmitForm = () => {
    // Se for uma entrada parcelada, emitir evento específico
    if (formData.parcelamento?.habilitado) {
      EventBus.emit('entrada.parcelada.criada', {
        ...formData,
        tipo: 'entrada',
        parcelas
      });
    }
    
    // Chamar a função de submit do componente pai
    onSubmit();
  };

  return (
    <Grid container spacing={3} sx={{ px: 2, pt: 2 }}>
      {/* Barra de Navegação Rápida */}
      <Grid item xs={12}>
        <Paper elevation={1} sx={{ borderRadius: 1, overflow: 'hidden' }}>
          <Box 
            sx={{ 
              display: 'flex',
              flexWrap: 'nowrap',
              overflowX: 'auto',
              bgcolor: 'background.default',
              borderBottom: 2,
              borderColor: theme.palette.primary.light
            }}
          >
            {[
              { id: 'descricao-section', label: 'Descrição' },
              { id: 'info-principais-section', label: 'Informações Principais' },
              { id: 'cliente-section', label: 'Cliente' },
              { id: 'categoria-section', label: 'Categoria' },
              { id: 'parcelamento-section', label: 'Parcelamento' }
            ].map((item, index) => (
              <React.Fragment key={item.id}>
                <Button 
                  variant="text"
                  size="small" 
                  onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                  sx={{ 
                    py: 1.5, 
                    px: 2,
                    minWidth: 'auto',
                    color: theme.palette.text.primary,
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    borderBottom: 2,
                    borderColor: 'transparent',
                    borderRadius: 0,
                    '&:hover': {
                      bgcolor: 'action.hover',
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  {item.label}
                </Button>
                {index < 4 && <Divider orientation="vertical" flexItem />}
              </React.Fragment>
            ))}
          </Box>
        </Paper>
      </Grid>
      
      {/* Descrição - Campo completo em cima */}
      <Grid item xs={12} id="descricao-section">
        <Card elevation={2}>
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
            />
          </CardContent>
        </Card>
      </Grid>

      {/* Valor e Data */}
      <Grid item xs={12} id="info-principais-section">
        <Card elevation={2} sx={{ bgcolor: 'background.default' }}>
          <CardHeader 
            title="Informações Principais" 
            sx={{ 
              bgcolor: theme.palette.primary.light, 
              color: theme.palette.primary.contrastText,
              py: 1
            }} 
          />
          <CardContent>
            <Grid container spacing={2}>
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
                  label="Data"
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
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 'bold' }}>Tipo de Entrada</InputLabel>
                  <Select
                    name="tipoEntrada"
                    value={formData.tipoEntrada || ''}
                    onChange={handleSelectChange}
                    label="Tipo de Entrada"
                  >
                    {tiposEntrada.map(tipo => (
                      <MenuItem key={tipo} value={tipo}>
                        {tipo === 'venda' ? 'Venda' : 
                         tipo === 'aluguel' ? 'Aluguel' : 
                         tipo === 'servico' ? 'Serviço' : 
                         tipo === 'comissao' ? 'Comissão' : 'Outros'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 'bold' }}>Status de Recebimento</InputLabel>
                  <Select
                    name="statusRecebimento"
                    value={formData.statusRecebimento || ''}
                    onChange={handleSelectChange}
                    label="Status de Recebimento"
                  >
                    {statusRecebimento.map(status => (
                      <MenuItem key={status} value={status}>
                        {status === 'recebido' ? 'Recebido' :
                         status === 'pendente' ? 'Pendente' : 'Parcialmente Recebido'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Data Prevista de Recebimento"
                  name="dataPrevistaRecebimento"
                  type="date"
                  value={formData.dataPrevistaRecebimento || ''}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true, style: { fontWeight: 'bold' } }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Cliente */}
      <Grid item xs={12} id="cliente-section">
        <Card elevation={2} sx={{ bgcolor: 'background.default' }}>
          <CardHeader 
            title="Informações do Cliente" 
            sx={{ 
              bgcolor: theme.palette.secondary.light, 
              color: theme.palette.secondary.contrastText,
              py: 1
            }} 
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nome do Cliente"
                  name="cliente"
                  value={formData.cliente || ''}
                  onChange={handleChange}
                  placeholder="Nome do cliente"
                  InputLabelProps={{ 
                    style: { fontWeight: 'bold' }
                  }}
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
                         forma === 'dinheiro' ? 'Dinheiro' : 'Outros'}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
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
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Categoria */}
      <Grid item xs={12} id="categoria-section">
        <Card elevation={2} sx={{ bgcolor: 'background.default' }}>
          <CardHeader 
            title="Categorização" 
            sx={{ 
              bgcolor: theme.palette.info.light, 
              color: theme.palette.info.contrastText,
              py: 1
            }} 
          />
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel sx={{ fontWeight: 'bold' }}>Categoria</InputLabel>
                  <Select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleSelectChange}
                    error={!!formErrors.categoria}
                    label="Categoria"
                  >
                    {categoriasDisponiveis.map(categoria => (
                      <MenuItem key={categoria} value={categoria}>
                        {categoria}
                      </MenuItem>
                    ))}
                    <MenuItem value="personalizado">
                      <em>Personalizado</em>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {formData.categoria === 'personalizado' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Categoria Personalizada"
                    name="categoriaPersonalizada"
                    value={formData.categoriaPersonalizada || ''}
                    onChange={(e) => {
                      setFormData((prev: any) => ({
                        ...prev,
                        categoriaPersonalizada: e.target.value,
                        categoria: e.target.value // Atualizar a categoria principal com o valor personalizado
                      }));
                    }}
                    InputLabelProps={{ 
                      style: { fontWeight: 'bold' }
                    }}
                  />
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
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Parcelamento */}
      <Grid item xs={12} id="parcelamento-section">
        <Card elevation={2}>
          <CardHeader 
            title="Parcelamento" 
            sx={{ 
              bgcolor: theme.palette.warning.light, 
              color: theme.palette.warning.contrastText,
              py: 1
            }} 
          />
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
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
              <Box mt={2}>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Quantidade de Parcelas"
                      name="quantidadeParcelas"
                      type="number"
                      value={formData.parcelamento?.quantidadeParcelas || 1}
                      onChange={handleQuantidadeParcelasChange}
                      InputProps={{ inputProps: { min: 1, max: 36 } }}
                      InputLabelProps={{ 
                        style: { fontWeight: 'bold' }
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
                  Detalhe das Parcelas
                </Typography>
                
                {parcelas.map((parcela, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2, border: `1px solid ${theme.palette.divider}` }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={12}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                            Parcela {index + 1}
                          </Typography>
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
                          />
                        </Grid>
                        
                        <Grid item xs={12} sm={4}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={parcela.pago}
                                onChange={(e) => handleParcelaChange(index, 'pago', e.target.checked)}
                                color="success"
                              />
                            }
                            label={<Typography fontWeight="bold">Pago</Typography>}
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
                            />
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Collapse>
          </CardContent>
        </Card>
      </Grid>
      
      {/* Botão de envio */}
      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleSubmitForm}
            disabled={isSubmitting}
            sx={{ fontWeight: 'bold', px: 4 }}
          >
            {isSubmitting ? "Processando..." : "Salvar"}
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default FormularioEntrada; 