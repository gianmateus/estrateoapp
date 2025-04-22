import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  Paper,
  IconButton,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Snackbar,
  CircularProgress,
  FormHelperText,
  Tooltip,
  Divider,
  Chip,
  Badge,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Inventory as InventoryIcon,
  PictureAsPdf as PdfIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { jsPDF } from 'jspdf';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { InventarioItem, InventarioInput, InventarioUpdateInput, FrequenciaUso } from '../types/Inventario';
import api from '../services/api';

const categorias = [
  { value: 'alimento', label: 'Alimento' },
  { value: 'bebida', label: 'Bebida' },
  { value: 'limpeza', label: 'Limpeza' },
  { value: 'material', label: 'Material' },
  { value: 'outro', label: 'Outro' }
];

const unidades = [
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'g', label: 'Grama (g)' },
  { value: 'l', label: 'Litro (l)' },
  { value: 'ml', label: 'Mililitro (ml)' },
  { value: 'unidade', label: 'Unidade' },
  { value: 'caixa', label: 'Caixa' },
  { value: 'pacote', label: 'Pacote' }
];

const frequencias = [
  { value: 'diaria', label: 'Diária' },
  { value: 'semanal', label: 'Semanal' },
  { value: 'mensal', label: 'Mensal' },
  { value: 'nenhuma', label: 'Nenhuma' }
];

const Inventario = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  
  // Estados
  const [itens, setItens] = useState<InventarioItem[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [itemEmEdicao, setItemEmEdicao] = useState<InventarioItem | null>(null);
  const [formData, setFormData] = useState<InventarioInput>({
    nome: '',
    categoria: 'alimento',
    unidade: 'unidade',
    quantidadeAtual: 0,
    quantidadeIdeal: 0,
    frequencia: 'nenhuma',
    observacao: '',
    estoqueNecessario: 0
  });
  const [formErrors, setFormErrors] = useState({
    nome: '',
    categoria: '',
    unidade: '',
    quantidadeAtual: '',
    quantidadeIdeal: '',
    frequencia: '',
    observacao: ''
  });
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string }>({
    open: false,
    id: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  
  // Estado para armazenar itens com estoque necessário e atual
  const [estoqueManual, setEstoqueManual] = useState<Record<string, { atual: number, necessario: number }>>({});

  // Buscar dados da API
  useEffect(() => {
    fetchInventario();
  }, []);

  const fetchInventario = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await api.get<InventarioItem[]>('/inventario');
      setItens(response.data);
    } catch (error) {
      console.error('Erro ao buscar inventário:', error);
      setSnackbar({
        open: true,
        message: t('erroAoBuscarInventario'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: InventarioItem) => {
    if (item) {
      // Modo edição
      setEditando(true);
      setItemEmEdicao(item);
      setFormData({
        nome: item.nome,
        categoria: item.categoria,
        unidade: item.unidade,
        quantidadeAtual: item.quantidadeAtual,
        quantidadeIdeal: item.quantidadeIdeal,
        frequencia: item.frequencia,
        observacao: item.observacao,
        estoqueNecessario: item.estoqueNecessario
      });
    } else {
      // Modo criação
      setEditando(false);
      setItemEmEdicao(null);
      setFormData({
        nome: '',
        categoria: 'alimento',
        unidade: 'unidade',
        quantidadeAtual: 0,
        quantidadeIdeal: 0,
        frequencia: 'nenhuma',
        observacao: '',
        estoqueNecessario: 0
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormErrors({
      nome: '',
      categoria: '',
      unidade: '',
      quantidadeAtual: '',
      quantidadeIdeal: '',
      frequencia: '',
      observacao: ''
    });
  };

  const validateForm = (): boolean => {
    const errors = {
      nome: '',
      categoria: '',
      unidade: '',
      quantidadeAtual: '',
      quantidadeIdeal: '',
      frequencia: '',
      observacao: ''
    };
    
    let isValid = true;
    
    // Validar nome
    if (!formData.nome.trim()) {
      errors.nome = t('campoObrigatorio');
      isValid = false;
    }
    
    // Validar categoria
    if (!formData.categoria) {
      errors.categoria = t('campoObrigatorio');
      isValid = false;
    }
    
    // Validar unidade
    if (!formData.unidade) {
      errors.unidade = t('campoObrigatorio');
      isValid = false;
    }
    
    // Validar quantidade atual
    if (formData.quantidadeAtual < 0) {
      errors.quantidadeAtual = t('valorDeveSerPositivo');
      isValid = false;
    }
    
    // Validar quantidade ideal
    if (formData.quantidadeIdeal < 0) {
      errors.quantidadeIdeal = t('valorDeveSerPositivo');
      isValid = false;
    }
    
    // Validar frequência
    if (!formData.frequencia) {
      errors.frequencia = t('campoObrigatorio');
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (editando && itemEmEdicao) {
        // Atualizar item existente
        await api.put<InventarioItem>(`/inventario/${itemEmEdicao.id}`, formData);
        setSnackbar({
          open: true,
          message: t('itemAtualizadoComSucesso'),
          severity: 'success'
        });
      } else {
        // Criar novo item
        await api.post<InventarioItem>('/inventario', formData);
        setSnackbar({
          open: true,
          message: t('itemAdicionadoComSucesso'),
          severity: 'success'
        });
      }
      
      // Recarregar lista
      await fetchInventario();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      setSnackbar({
        open: true,
        message: t('erroAoSalvarItem'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Excluir item
  const handleDeleteItem = async (id: string) => {
    try {
      await api.delete(`/inventario/${id}`);
      setItens(itens.filter(item => item.id !== id));
      
      // Remover do estoque manual
      const novoEstoqueManual = { ...estoqueManual };
      delete novoEstoqueManual[id];
      setEstoqueManual(novoEstoqueManual);
      
      setSnackbar({
        open: true,
        message: t('itemExcluidoComSucesso'),
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      setSnackbar({
        open: true,
        message: t('erroAoExcluirItem'),
        severity: 'error'
      });
    }
    setConfirmDelete({ open: false, id: '' });
  };

  const handleOpenConfirmDelete = (id: string) => {
    setConfirmDelete({ open: true, id });
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDelete({ open: false, id: '' });
  };

  // Verificar se o item está abaixo do nível recomendado
  const isItemCritico = (item: InventarioItem): boolean => {
    // Usar o valor de estoque manual se existir, senão usar o valor do item
    const estoqueAtual = estoqueManual[item.id]?.atual ?? item.quantidadeAtual;
    const estoqueNecessario = estoqueManual[item.id]?.necessario ?? item.quantidadeIdeal;
    
    return estoqueAtual < estoqueNecessario;
  };
  
  // Função para atualizar o estoque atual manualmente
  const handleUpdateEstoqueAtual = (id: string, valor: number) => {
    setEstoqueManual(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        atual: valor
      }
    }));
  };
  
  // Função para atualizar o estoque necessário manualmente
  const handleUpdateEstoqueNecessario = (id: string, valor: number) => {
    setEstoqueManual(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        necessario: valor
      }
    }));
  };

  // Gerar relatório de compras em PDF
  const handleGerarRelatorioPDF = () => {
    try {
      const doc = new jsPDF();

      // Título
      doc.setFontSize(18);
      doc.text(t('inventario_buyReport'), 105, 15, { align: 'center' });

      // Data
      doc.setFontSize(12);
      const dateFormatted = new Intl.DateTimeFormat(i18n.language, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }).format(new Date());
      doc.text(`${t('data')}: ${dateFormatted}`, 105, 25, { align: 'center' });

      // Cabeçalho da tabela
      doc.setFontSize(12);
      doc.text(t('nome'), 20, 40);
      doc.text(t('categoria'), 70, 40);
      doc.text(t('inventario_currentStock'), 120, 40);
      doc.text(t('inventario_toBuy'), 170, 40);

      doc.line(20, 43, 190, 43);

      // Dados - somente itens que precisam ser comprados (estoque atual < necessário)
      let y = 50;
      let totalItensAComprar = 0;
      
      itens.forEach((item, index) => {
        const estoqueAtual = estoqueManual[item.id]?.atual ?? item.quantidadeAtual;
        const estoqueNecessario = estoqueManual[item.id]?.necessario ?? item.quantidadeIdeal;
        const quantidadeAComprar = estoqueNecessario - estoqueAtual;
        
        if (quantidadeAComprar <= 0) return; // Pular itens que não precisam ser comprados
        
        totalItensAComprar++;
        
        doc.text(item.nome.substring(0, 20), 20, y);
        doc.text(
          categorias.find(c => c.value === item.categoria)?.label || item.categoria,
          70, y
        );
        doc.text(`${estoqueAtual} ${item.unidade}`, 120, y);
        doc.text(`${quantidadeAComprar} ${item.unidade}`, 170, y);

        y += 10;

        // Nova página se necessário
        if (y > 280 && index < itens.length - 1) {
          doc.addPage();
          y = 20;

          // Cabeçalho na nova página
          doc.text(t('nome'), 20, y);
          doc.text(t('categoria'), 70, y);
          doc.text(t('inventario_currentStock'), 120, y);
          doc.text(t('inventario_toBuy'), 170, y);

          doc.line(20, y+3, 190, y+3);
          y += 10;
        }
      });
      
      // Se não houver itens a comprar, exibir mensagem
      if (totalItensAComprar === 0) {
        doc.text(t('nenhumItemParaComprar'), 105, 60, { align: 'center' });
      }

      // Salvar PDF
      doc.save('relatorio-compras.pdf');

      setSnackbar({
        open: true,
        message: t('relatorioGeradoComSucesso'),
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setSnackbar({
        open: true,
        message: t('erroAoGerarRelatorio'),
        severity: 'error'
      });
    }
  };

  // Gerar relatório em PDF
  const handleGerarPdf = () => {
    try {
      const doc = new jsPDF();

      // Título
      doc.setFontSize(18);
      doc.text(t('inventario_inventoryReport'), 105, 15, { align: 'center' });

      // Data
      doc.setFontSize(12);
      const dateFormatted = new Intl.DateTimeFormat(i18n.language, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }).format(new Date());
      doc.text(`${t('data')}: ${dateFormatted}`, 105, 25, { align: 'center' });

      // Cabeçalho da tabela
      doc.setFontSize(12);
      doc.text(t('nome'), 20, 40);
      doc.text(t('categoria'), 70, 40);
      doc.text(t('quantidade'), 120, 40);
      doc.text(t('status'), 170, 40);

      doc.line(20, 43, 190, 43);

      // Dados
      let y = 50;
      itens.forEach((item, index) => {
        const estoqueAtual = estoqueManual[item.id]?.atual ?? item.quantidadeAtual;
        const estoqueNecessario = estoqueManual[item.id]?.necessario ?? item.quantidadeIdeal;
        const status = estoqueAtual < estoqueNecessario ? 'BAIXO' : 'OK';

        doc.text(item.nome.substring(0, 20), 20, y);
        doc.text(
          categorias.find(c => c.value === item.categoria)?.label || item.categoria,
          70, y
        );
        doc.text(`${estoqueAtual} ${item.unidade}`, 120, y);
        doc.text(status, 170, y);

        y += 10;

        // Nova página se necessário
        if (y > 280 && index < itens.length - 1) {
          doc.addPage();
          y = 20;

          // Cabeçalho na nova página
          doc.text(t('nome'), 20, y);
          doc.text(t('categoria'), 70, y);
          doc.text(t('quantidade'), 120, y);
          doc.text(t('status'), 170, y);

          doc.line(20, y+3, 190, y+3);
          y += 10;
        }
      });

      // Resumo
      const totalItens = itens.length;
      const itensCriticos = itens.filter(item => {
        const estoqueAtual = estoqueManual[item.id]?.atual ?? item.quantidadeAtual;
        const estoqueNecessario = estoqueManual[item.id]?.necessario ?? item.quantidadeIdeal;
        return estoqueAtual < estoqueNecessario;
      }).length;

      doc.addPage();
      doc.setFontSize(16);
      doc.text(t('resumoInventario'), 105, 20, { align: 'center' });

      doc.setFontSize(12);
      doc.text(`${t('itensTotal')}: ${totalItens}`, 20, 40);
      doc.text(`${t('itensAbaixoMin')}: ${itensCriticos}`, 20, 50);
      doc.text(`${t('porcentagem')}: ${totalItens > 0 ? ((itensCriticos / totalItens) * 100).toFixed(2) : 0}%`, 20, 60);

      // Salvar PDF
      doc.save('inventario.pdf');

      setSnackbar({
        open: true,
        message: t('relatorioGeradoComSucesso'),
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setSnackbar({
        open: true,
        message: t('erroAoGerarRelatorio'),
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Calcular total de itens críticos (abaixo do ideal)
  const getTotalItensCriticos = () => {
    return itens.filter(isItemCritico).length;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{t('inventario')}</Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<PdfIcon />}
            onClick={handleGerarPdf}
            sx={{ mr: 1 }}
          >
            {t('gerarRelatorio')}
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<PdfIcon />}
            onClick={handleGerarRelatorioPDF}
          >
            {t('inventario_buyReport')}
          </Button>
        </Box>
      </Box>

      {/* Mostrar indicador de carregamento se estiver carregando */}
      {loading && !openDialog && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Mostrar mensagem se não houver itens */}
      {!loading && itens.length === 0 && (
        <Alert severity="info" sx={{ mt: 2, mb: 4 }}>
          {t('nenhumItemCadastrado')}
        </Alert>
      )}

      {/* Mostrar alerta se houver itens críticos */}
      {getTotalItensCriticos() > 0 && (
        <Alert
          severity="warning"
          sx={{ mt: 2, mb: 4 }}
          icon={<WarningIcon />}
        >
          {t('existemItensCriticos', { count: getTotalItensCriticos() })}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'primary.light',
              color: 'white',
            }}
          >
            <IconButton
              onClick={() => handleOpenDialog()}
              sx={{ backgroundColor: 'white', color: 'primary.main', mb: 2 }}
            >
              <AddIcon />
            </IconButton>
            <Typography variant="h6">{t('adicionarItem')}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('itensCadastrados')}
            </Typography>

            <List>
              {itens
                .sort((a, b) => a.nome.localeCompare(b.nome))
                .map((item) => {
                  const isCritico = isItemCritico(item);
                  const estoqueAtual = estoqueManual[item.id]?.atual ?? item.quantidadeAtual;
                  const estoqueNecessario = estoqueManual[item.id]?.necessario ?? item.quantidadeIdeal;

                  return (
                    <ListItem
                      key={item.id}
                      sx={{
                        border: '1px solid',
                        borderColor: isCritico ? 'warning.main' : 'divider',
                        borderRadius: 1,
                        mb: 1,
                        backgroundColor: isCritico ? 'warning.light' : 'transparent',
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {item.nome}
                                {isCritico && (
                                  <Tooltip title={t('itemAbaixoDoIdeal')}>
                                    <WarningIcon color="warning" sx={{ ml: 1 }} fontSize="small" />
                                  </Tooltip>
                                )}
                              </Box>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" component="span">
                                  {`${t('categoria')}: ${categorias.find(c => c.value === item.categoria)?.label || item.categoria}`}
                                </Typography>
                                <br />
                                <Typography variant="body2" component="span">
                                  {`${t('inventario_unit')}: ${item.unidade} | ${t('inventario_frequency')}: ${
                                    frequencias.find(f => f.value === item.frequencia)?.label || t('inventario_frequency_none')
                                  }`}
                                </Typography>
                                {item.observacao && (
                                  <>
                                    <br />
                                    <Typography variant="body2" component="span">
                                      {`${t('inventario_notes')}: ${item.observacao}`}
                                    </Typography>
                                  </>
                                )}
                              </>
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ minWidth: 120 }}>
                                {t('inventario_currentStock')}:
                              </Typography>
                              <TextField
                                size="small"
                                type="number"
                                value={estoqueAtual}
                                onChange={(e) => handleUpdateEstoqueAtual(item.id, Number(e.target.value))}
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">{item.unidade}</InputAdornment>,
                                  inputProps: { min: 0, step: 1 }
                                }}
                                sx={{ width: 120 }}
                              />
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography variant="body2" sx={{ minWidth: 120 }}>
                                {t('inventario_stockNeeded')}:
                              </Typography>
                              <TextField
                                size="small"
                                type="number"
                                value={estoqueNecessario}
                                onChange={(e) => handleUpdateEstoqueNecessario(item.id, Number(e.target.value))}
                                InputProps={{
                                  endAdornment: <InputAdornment position="end">{item.unidade}</InputAdornment>,
                                  inputProps: { min: 0, step: 1 }
                                }}
                                sx={{ width: 120 }}
                              />
                            </Box>
                            {estoqueAtual < estoqueNecessario && (
                              <Typography variant="body2" color="error">
                                {t('inventario_toBuy')}: {estoqueNecessario - estoqueAtual} {item.unidade}
                              </Typography>
                            )}
                          </Box>
                        </Grid>
                      </Grid>
                      <ListItemSecondaryAction>
                        <Tooltip title={t('editar')}>
                          <IconButton edge="end" onClick={() => handleOpenDialog(item)} sx={{ mr: 1 }}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('excluir')}>
                          <IconButton edge="end" onClick={() => handleOpenConfirmDelete(item.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogo para criar/editar item */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editando ? t('editarItem') : t('adicionarItem')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('nome')}
            fullWidth
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            error={!!formErrors.nome}
            helperText={formErrors.nome}
          />
          <TextField
            margin="dense"
            label={t('categoria')}
            select
            fullWidth
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            error={!!formErrors.categoria}
            helperText={formErrors.categoria}
          >
            {categorias.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label={t('unidade')}
            select
            fullWidth
            value={formData.unidade}
            onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
            error={!!formErrors.unidade}
            helperText={formErrors.unidade}
          >
            {unidades.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label={t('inventario_frequency')}
            select
            fullWidth
            value={formData.frequencia}
            onChange={(e) => setFormData({ ...formData, frequencia: e.target.value as FrequenciaUso })}
            error={!!formErrors.frequencia}
            helperText={formErrors.frequencia}
          >
            {frequencias.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {t(`inventario_frequency_${option.value}`)}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              margin="dense"
              label={t('quantidadeAtual')}
              type="number"
              fullWidth
              value={formData.quantidadeAtual}
              onChange={(e) => setFormData({ ...formData, quantidadeAtual: parseInt(e.target.value) })}
              error={!!formErrors.quantidadeAtual}
              helperText={formErrors.quantidadeAtual}
              InputProps={{ inputProps: { min: 0 } }}
            />
            <TextField
              margin="dense"
              label={t('quantidadeIdeal')}
              type="number"
              fullWidth
              value={formData.quantidadeIdeal}
              onChange={(e) => setFormData({ ...formData, quantidadeIdeal: parseInt(e.target.value) })}
              error={!!formErrors.quantidadeIdeal}
              helperText={formErrors.quantidadeIdeal}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Box>
          <TextField
            margin="dense"
            label={t('inventario_notes')}
            fullWidth
            multiline
            rows={2}
            value={formData.observacao}
            onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
            error={!!formErrors.observacao}
            helperText={formErrors.observacao}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            {t('cancelar')}
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : t('salvar')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmação para exclusão */}
      <Dialog
        open={confirmDelete.open}
        onClose={handleCloseConfirmDelete}
      >
        <DialogTitle>{t('confirmarExclusao')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('confirmarExclusaoItem')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete} color="primary">
            {t('cancelar')}
          </Button>
          <Button onClick={() => handleDeleteItem(confirmDelete.id)} color="error">
            {t('excluir')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Inventario;