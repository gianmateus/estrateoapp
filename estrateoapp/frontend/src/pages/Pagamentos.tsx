import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  Chip,
  Checkbox,
  FormControlLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  BarChart as ChartIcon, 
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, Legend, ResponsiveContainer } from 'recharts';
import { Pagamento, PagamentoInput, PagamentoUpdateInput } from '../types/Pagamento';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import PermissionButton from '../components/PermissionButton';
import { 
  CREATE_PAYMENT_PERMISSION, 
  EDIT_PAYMENT_PERMISSION, 
  DELETE_PAYMENT_PERMISSION 
} from '../constants/permissions';

const categorias = [
  { value: 'aluguel', label: 'Aluguel' },
  { value: 'fornecedor', label: 'Fornecedor' },
  { value: 'funcionario', label: 'Funcionário' },
  { value: 'imposto', label: 'Imposto' },
  { value: 'servico', label: 'Serviço' },
  { value: 'outro', label: 'Outro' }
];

const Pagamentos = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  
  // Estados
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRelatorio, setOpenRelatorio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [pagamentoEmEdicao, setPagamentoEmEdicao] = useState<Pagamento | null>(null);
  const [formData, setFormData] = useState<PagamentoInput>({
    descricao: '',
    valor: 0,
    categoria: 'outro',
    vencimento: format(new Date(), 'yyyy-MM-dd'),
    pago: false
  });
  const [formErrors, setFormErrors] = useState({
    descricao: '',
    valor: '',
    categoria: '',
    vencimento: ''
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

  // Buscar dados da API
  useEffect(() => {
    fetchPagamentos();
  }, []);

  const fetchPagamentos = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await api.get<Pagamento[]>('/pagamentos');
      setPagamentos(response.data);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      setSnackbar({
        open: true,
        message: t('erroAoBuscarPagamentos'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (pagamento?: Pagamento) => {
    if (pagamento) {
      // Modo edição
      setEditando(true);
      setPagamentoEmEdicao(pagamento);
      setFormData({
        descricao: pagamento.descricao,
        valor: pagamento.valor,
        categoria: pagamento.categoria,
        vencimento: pagamento.vencimento.split('T')[0], // Remover parte de tempo
        pago: pagamento.pago
      });
    } else {
      // Modo criação
      setEditando(false);
      setPagamentoEmEdicao(null);
      setFormData({
        descricao: '',
        valor: 0,
        categoria: 'outro',
        vencimento: format(new Date(), 'yyyy-MM-dd'),
        pago: false
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormErrors({
      descricao: '',
      valor: '',
      categoria: '',
      vencimento: ''
    });
  };

  const validateForm = (): boolean => {
    const errors = {
      descricao: '',
      valor: '',
      categoria: '',
      vencimento: ''
    };
    
    let isValid = true;
    
    // Validar descrição
    if (!formData.descricao.trim()) {
      errors.descricao = t('campoObrigatorio');
      isValid = false;
    }
    
    // Validar valor
    if (!formData.valor || formData.valor <= 0) {
      errors.valor = t('valorDeveSerPositivo');
      isValid = false;
    }
    
    // Validar categoria
    if (!formData.categoria) {
      errors.categoria = t('campoObrigatorio');
      isValid = false;
    }
    
    // Validar vencimento
    if (!formData.vencimento) {
      errors.vencimento = t('campoObrigatorio');
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      if (editando && pagamentoEmEdicao) {
        // Atualizar pagamento existente
        await api.put<Pagamento>(`/pagamentos/${pagamentoEmEdicao.id}`, formData);
        setSnackbar({
          open: true,
          message: t('pagamentoAtualizadoComSucesso'),
          severity: 'success'
        });
      } else {
        // Criar novo pagamento
        await api.post<Pagamento>('/pagamentos', formData);
        setSnackbar({
          open: true,
          message: t('pagamentoCriadoComSucesso'),
          severity: 'success'
        });
      }
      
      // Recarregar lista
      await fetchPagamentos();
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
      setSnackbar({
        open: true,
        message: t('erroAoSalvarPagamento'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Marcar pagamento como pago ou não pago
  const togglePagamentoPago = async (pagamento: Pagamento) => {
    try {
      await api.put<Pagamento>(`/pagamentos/${pagamento.id}`, {
        ...pagamento,
        pago: !pagamento.pago
      });
      
      // Atualizar lista local
      setPagamentos(pagamentos.map(p => 
        p.id === pagamento.id ? {...p, pago: !p.pago} : p
      ));
      
      setSnackbar({
        open: true,
        message: pagamento.pago ? t('pagamentoMarcadoComoPendente') : t('pagamentoMarcadoComoPago'),
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao atualizar status do pagamento:', error);
      setSnackbar({
        open: true,
        message: t('erroAoAtualizarStatusPagamento'),
        severity: 'error'
      });
    }
  };

  // Excluir pagamento
  const handleDeletePagamento = async (id: string) => {
    try {
      await api.delete(`/pagamentos/${id}`);
      setPagamentos(pagamentos.filter(p => p.id !== id));
      setSnackbar({
        open: true,
        message: t('pagamentoExcluidoComSucesso'),
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao excluir pagamento:', error);
      setSnackbar({
        open: true,
        message: t('erroAoExcluirPagamento'),
        severity: 'error'
      });
    } finally {
      setConfirmDelete({ open: false, id: '' });
    }
  };

  const handleOpenConfirmDelete = (id: string) => {
    setConfirmDelete({ open: true, id });
  };

  const handleCloseConfirmDelete = () => {
    setConfirmDelete({ open: false, id: '' });
  };

  const getGastosPorCategoria = () => {
    const gastos = new Map<string, number>();
    
    pagamentos.forEach(pagamento => {
      const valorAtual = gastos.get(pagamento.categoria) || 0;
      gastos.set(pagamento.categoria, valorAtual + pagamento.valor);
    });

    return Array.from(gastos.entries())
      .map(([name, valor]) => ({ 
        name: categorias.find(c => c.value === name)?.label || name, 
        valor 
      }))
      .sort((a, b) => b.valor - a.valor);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          {t('pagamentos')}
        </Typography>
        <Box>
          <PermissionButton
            permission={CREATE_PAYMENT_PERMISSION}
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mr: 1 }}
          >
            {t('novoPagamento')}
          </PermissionButton>
          <Button
            variant="outlined"
            startIcon={<ChartIcon />}
            onClick={() => setOpenRelatorio(true)}
          >
            {t('relatorio')}
          </Button>
        </Box>
      </Box>

      {/* Mostrar indicador de carregamento se estiver carregando */}
      {loading && !openDialog && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Mostrar mensagem se não houver pagamentos */}
      {!loading && pagamentos.length === 0 && (
        <Alert severity="info" sx={{ mt: 2, mb: 4 }}>
          {t('nenhumPagamentoCadastrado')}
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
            <Typography variant="h6">{t('novoPagamento')}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              {t('pagamentosCadastrados')}
            </Typography>
            <List>
              {pagamentos
                .sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime())
                .map((pagamento) => (
                  <ListItem 
                    key={pagamento.id}
                    sx={{
                      textDecoration: pagamento.pago ? 'line-through' : 'none',
                      color: pagamento.pago ? 'text.disabled' : 'text.primary',
                      backgroundColor: pagamento.pago ? 'action.disabledBackground' : 'transparent',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox 
                          checked={pagamento.pago} 
                          onChange={() => togglePagamentoPago(pagamento)} 
                          color="primary"
                        />
                      }
                      label=""
                    />
                    <ListItemText
                      primary={pagamento.descricao}
                      secondary={`${format(new Date(pagamento.vencimento), "dd/MM/yyyy")} - €${pagamento.valor.toFixed(2)}`}
                    />
                    <ListItemSecondaryAction>
                      <Chip
                        label={categorias.find((c) => c.value === pagamento.categoria)?.label || pagamento.categoria}
                        color={pagamento.pago ? 'success' : 'default'}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title={t('editar')}>
                        <IconButton edge="end" onClick={() => handleOpenDialog(pagamento)} sx={{ mr: 1 }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('excluir')}>
                        <IconButton edge="end" onClick={() => handleOpenConfirmDelete(pagamento.id)} color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Diálogo para criar/editar pagamento */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editando ? t('editarPagamento') : t('novoPagamento')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('descricao')}
            fullWidth
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            error={!!formErrors.descricao}
            helperText={formErrors.descricao}
          />
          <TextField
            margin="dense"
            label={t('valor')}
            type="number"
            fullWidth
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: parseFloat(e.target.value) })}
            error={!!formErrors.valor}
            helperText={formErrors.valor}
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
            label={t('dataVencimento')}
            type="date"
            fullWidth
            value={formData.vencimento}
            onChange={(e) => setFormData({ ...formData, vencimento: e.target.value })}
            InputLabelProps={{ shrink: true }}
            error={!!formErrors.vencimento}
            helperText={formErrors.vencimento}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.pago || false}
                onChange={(e) => setFormData({ ...formData, pago: e.target.checked })}
                color="primary"
              />
            }
            label={t('pago')}
            sx={{ mt: 2 }}
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

      {/* Diálogo de relatório de gastos */}
      <Dialog
        open={openRelatorio}
        onClose={() => setOpenRelatorio(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('relatorioGastos')}</DialogTitle>
        <DialogContent>
          <Box sx={{ height: 400, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getGastosPorCategoria()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip formatter={(value) => `€${value}`} />
                <Legend />
                <Bar dataKey="valor" fill="#3f51b5" name={t('valor')} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            {t('resumoPorCategoria')}
          </Typography>
          
          <List>
            {getGastosPorCategoria().map((item, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={item.name}
                  secondary={`€${item.valor.toFixed(2)}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRelatorio(false)} color="primary">
            {t('fechar')}
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
            {t('confirmarExclusaoPagamento')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete} color="primary">
            {t('cancelar')}
          </Button>
          <Button onClick={() => handleDeletePagamento(confirmDelete.id)} color="error">
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

export default Pagamentos; 