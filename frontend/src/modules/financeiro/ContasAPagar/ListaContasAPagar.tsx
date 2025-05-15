import React, { useState, useMemo, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Grid,
  Button,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { 
  Search as SearchIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  EuroSymbol as EuroIcon,
  AssignmentLate as AssignmentLateIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { format, parseISO, isAfter, addDays, isBefore } from 'date-fns';
import { ptBR, enUS, de, it } from 'date-fns/locale';
import { useFinanceiro } from '../../../contexts/FinanceiroContext';
import CardResumo from '../componentes/CardResumo';

// Status das contas a pagar
type StatusContaPagar = 'pendente' | 'pago' | 'atrasado' | 'cancelado';

// Interface para as parcelas
interface ParcelaItem {
  numero: number;
  valorParcela: number;
  dataPrevista: string;
  pago: boolean;
  dataPagamento?: string;
}

const ListaContasAPagar = () => {
  const { t, i18n } = useTranslation();
  const { transacoes, editarTransacao } = useFinanceiro();
  
  // Estado para diálogo de confirmação
  const [dialogoConfirmacao, setDialogoConfirmacao] = useState<{aberto: boolean, id: string | null}>({
    aberto: false,
    id: null
  });
  
  // Estado para filtro de texto (busca)
  const [textoBusca, setTextoBusca] = useState('');
  
  // Filtros
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    fornecedor: '',
    status: '',
    descricao: ''
  });
  
  const [mostrarFiltros, setMostrarFiltros] = useState(true);
  
  // Lista de fornecedores únicos para o select
  const [fornecedoresUnicos, setFornecedoresUnicos] = useState<string[]>([]);
  
  // Obter o locale correto para formatação de datas
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'pt':
        return ptBR;
      case 'de':
        return de;
      case 'it':
        return it;
      default:
        return enUS;
    }
  };
  
  // Formatar valor para exibir em euros (padrão europeu)
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor);
  };
  
  // Filtrar somente saídas (contas a pagar)
  const contasAPagar = useMemo(() => {
    return transacoes.filter(t => 
      t.tipo === 'saida' && 
      (!t.parcelamento || t.parcelamento.parcelas.some(p => !p.pago))
    );
  }, [transacoes]);
  
  // Obter fornecedores únicos das contas
  useEffect(() => {
    const fornecedores = contasAPagar
      .map(conta => conta.fornecedor || '')
      .filter(fornecedor => fornecedor.trim() !== '')
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    
    setFornecedoresUnicos(fornecedores);
  }, [contasAPagar]);
  
  // Verificar status de uma conta
  const verificarStatus = (conta: any): StatusContaPagar => {
    // Se todas as parcelas estão pagas
    if (conta.parcelamento && !conta.parcelamento.parcelas.some((p: ParcelaItem) => !p.pago)) {
      return 'pago';
    }
    
    // Se a data de vencimento já passou
    const dataAtual = new Date();
    const dataVencimento = parseISO(conta.dataPrevistaPagamento || conta.data);
    
    if (isBefore(dataVencimento, dataAtual) && (!conta.parcelamento || conta.parcelamento.parcelas.some((p: ParcelaItem) => !p.pago))) {
      return 'atrasado';
    }
    
    // Se foi cancelada (verificar campo específico na conta)
    if (conta.status === 'cancelado') {
      return 'cancelado';
    }
    
    // Se não se encaixa em nenhum caso acima, está pendente
    return 'pendente';
  };
  
  // Obter cor e label com base no status
  const getStatusConfig = (status: StatusContaPagar) => {
    switch (status) {
      case 'pago':
        return { color: 'success', label: t('contasAPagar.pago') };
      case 'pendente':
        return { color: 'warning', label: t('contasAPagar.pendente') };
      case 'atrasado':
        return { color: 'error', label: t('contasAPagar.atrasado') };
      case 'cancelado':
        return { color: 'default', label: t('contasAPagar.cancelado') };
      default:
        return { color: 'default', label: status };
    }
  };
  
  // Aplicar filtros
  const contasFiltradas = useMemo(() => {
    return contasAPagar.filter(conta => {
      // Filtro de busca por descrição
      if (filtros.descricao && 
         !conta.descricao.toLowerCase().includes(filtros.descricao.toLowerCase())) {
        return false;
      }
      
      // Filtro de status
      const statusConta = verificarStatus(conta);
      if (filtros.status) {
        if (statusConta !== filtros.status) {
          return false;
        }
        
        // Se o status for "pago" ou "cancelado", não aplicar filtros de data
        if (filtros.status === 'pago' || filtros.status === 'cancelado') {
          // Continuar para outros filtros
        } 
        // Para outros status, aplicar filtros de data apenas se estiverem preenchidos
        else {
          // Filtro de data início
          if (filtros.dataInicio && conta.data < filtros.dataInicio) {
            return false;
          }
          
          // Filtro de data fim
          if (filtros.dataFim && conta.data > filtros.dataFim) {
            return false;
          }
        }
      } else {
        // Se não há filtro de status, aplicar filtros de data apenas se estiverem preenchidos
        if (filtros.dataInicio && conta.data < filtros.dataInicio) {
          return false;
        }
        
        if (filtros.dataFim && conta.data > filtros.dataFim) {
          return false;
        }
      }
      
      // Filtro de fornecedor
      if (filtros.fornecedor && 
          (!conta.fornecedor || 
           !conta.fornecedor.toLowerCase().includes(filtros.fornecedor.toLowerCase()))) {
        return false;
      }
      
      return true;
    });
  }, [contasAPagar, filtros]);
  
  // Marcar uma conta como paga
  const marcarComoPaga = (id: string) => {
    const contaParaAtualizar = transacoes.find(t => t.id === id);
    
    if (contaParaAtualizar) {
      // Se não tiver parcelamento, marca diretamente como pago
      if (!contaParaAtualizar.parcelamento) {
        // Copia a transação e adiciona um parcelamento com uma parcela marcada como paga
        const contaAtualizada = {
          ...contaParaAtualizar,
          parcelamento: {
            quantidadeParcelas: 1,
            parcelas: [{
              numero: 1,
              valorParcela: contaParaAtualizar.valor,
              dataPrevista: contaParaAtualizar.data,
              pago: true,
              dataPagamento: new Date().toISOString()
            }]
          }
        };
        editarTransacao(id, contaAtualizada);
      } else {
        // Para contas com parcelamento, atualiza todas as parcelas pendentes como pagas
        const parcelasAtualizadas = contaParaAtualizar.parcelamento.parcelas.map((parcela: ParcelaItem) => {
          if (!parcela.pago) {
            return {
              ...parcela,
              pago: true,
              dataPagamento: new Date().toISOString()
            };
          }
          return parcela;
        });
        
        const contaAtualizada = {
          ...contaParaAtualizar,
          parcelamento: {
            ...contaParaAtualizar.parcelamento,
            parcelas: parcelasAtualizadas
          }
        };
        
        editarTransacao(id, contaAtualizada);
      }
      
      // Fechar o diálogo de confirmação após marcar como pago
      setDialogoConfirmacao({aberto: false, id: null});
    }
  };
  
  // Abrir diálogo de confirmação para marcar como pago
  const confirmarMarcarComoPago = (id: string) => {
    setDialogoConfirmacao({
      aberto: true,
      id
    });
  };
  
  // Fechar diálogo de confirmação
  const fecharDialogoConfirmacao = () => {
    setDialogoConfirmacao({
      aberto: false,
      id: null
    });
  };
  
  // Limpar todos os filtros
  const limparFiltros = () => {
    setFiltros({
      dataInicio: '',
      dataFim: '',
      fornecedor: '',
      status: '',
      descricao: ''
    });
  };
  
  // Cálculos para os cards de indicadores
  const totalContasCadastradas = contasAPagar.length;
  
  const valorTotalPendentes = useMemo(() => {
    return contasAPagar
      .filter(conta => verificarStatus(conta) === 'pendente' || verificarStatus(conta) === 'atrasado')
      .reduce((total, conta) => total + conta.valor, 0);
  }, [contasAPagar]);
  
  const valorProxSeteDias = useMemo(() => {
    const hoje = new Date();
    const emSeteDias = addDays(hoje, 7);
    
    return contasAPagar
      .filter(conta => {
        const dataVencimento = parseISO(conta.dataPrevistaPagamento || conta.data);
        return !isBefore(dataVencimento, hoje) && 
               !isAfter(dataVencimento, emSeteDias) && 
               verificarStatus(conta) !== 'pago' &&
               verificarStatus(conta) !== 'cancelado';
      })
      .reduce((total, conta) => total + conta.valor, 0);
  }, [contasAPagar]);
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          {t('contasAPagar.titulo')}
        </Typography>
        
        <Box>
          <Button 
            variant="contained" 
            color="primary"
            sx={{ ml: 1 }}
          >
            {t('contasAPagar.novaConta')}
          </Button>
          
          <Tooltip title={t('filtros')}>
            <IconButton 
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              sx={{ ml: 1 }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Indicadores financeiros */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <CardResumo 
            titulo={t('contasAPagar.totalContas')} 
            valor={totalContasCadastradas.toString()} 
            icone="saldo"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CardResumo 
            titulo={t('contasAPagar.valorPendentes')} 
            valor={formatarMoeda(valorTotalPendentes)} 
            icone="saida"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <CardResumo 
            titulo={t('contasAPagar.valorProxSeteDias')} 
            valor={formatarMoeda(valorProxSeteDias)} 
            icone="resultado"
          />
        </Grid>
      </Grid>
      
      {/* Filtros */}
      {mostrarFiltros && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2.4}>
              <TextField
                label={t('dataInicio')}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                label={t('dataFim')}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={filtros.dataFim}
                onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                select
                label={t('fornecedor')}
                fullWidth
                value={filtros.fornecedor}
                onChange={(e) => setFiltros({...filtros, fornecedor: e.target.value})}
              >
                <MenuItem value="">{t('todos')}</MenuItem>
                {fornecedoresUnicos.map(fornecedor => (
                  <MenuItem key={fornecedor} value={fornecedor}>
                    {fornecedor}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                select
                label={t('contasAPagar.status')}
                fullWidth
                value={filtros.status}
                onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              >
                <MenuItem value="">{t('todos')}</MenuItem>
                <MenuItem value="pendente">{t('contasAPagar.pendente')}</MenuItem>
                <MenuItem value="pago">{t('contasAPagar.pago')}</MenuItem>
                <MenuItem value="atrasado">{t('contasAPagar.atrasado')}</MenuItem>
                <MenuItem value="cancelado">{t('contasAPagar.cancelado')}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2.4}>
              <TextField
                label={t('contasAPagar.descricao')}
                fullWidth
                value={filtros.descricao}
                onChange={(e) => setFiltros({...filtros, descricao: e.target.value})}
                InputProps={{
                  endAdornment: (
                    <SearchIcon color="action" />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="outlined" 
                startIcon={<ClearIcon />} 
                onClick={limparFiltros}
                size="small"
                sx={{ float: 'right' }}
              >
                {t('limpar')}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}
      
      {/* Tabela de contas a pagar */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('contasAPagar.descricao')}</TableCell>
              <TableCell>{t('contasAPagar.fornecedor')}</TableCell>
              <TableCell>{t('contasAPagar.data')}</TableCell>
              <TableCell>{t('contasAPagar.valor')}</TableCell>
              <TableCell>{t('contasAPagar.status')}</TableCell>
              <TableCell align="right">{t('contasAPagar.acoes')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contasFiltradas.length > 0 ? (
              contasFiltradas.map((conta) => {
                // Verificar status de pagamento
                const statusConta = verificarStatus(conta);
                const statusConfig = getStatusConfig(statusConta);
                
                return (
                  <TableRow key={conta.id}>
                    <TableCell>{conta.descricao}</TableCell>
                    <TableCell>{conta.fornecedor || "-"}</TableCell>
                    <TableCell>
                      {format(parseISO(conta.data), 'dd MMM yyyy', { locale: getDateLocale() })}
                    </TableCell>
                    <TableCell>{formatarMoeda(conta.valor)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={statusConfig.label} 
                        color={statusConfig.color as any} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      {statusConta !== 'pago' && statusConta !== 'cancelado' && (
                        <Tooltip title={t('contasAPagar.marcarComoPago')}>
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => confirmarMarcarComoPago(conta.id)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={t('contasAPagar.editar')}>
                        <IconButton size="small" color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    {t('nenhumaContaAPagar')}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      {/* Diálogo de confirmação para marcar como pago */}
      <Dialog
        open={dialogoConfirmacao.aberto}
        onClose={fecharDialogoConfirmacao}
      >
        <DialogTitle>{t('contasAPagar.confirmarPagamento')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('contasAPagar.confirmarPagamentoTexto')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharDialogoConfirmacao}>
            {t('cancelar')}
          </Button>
          <Button 
            color="success" 
            variant="contained"
            onClick={() => dialogoConfirmacao.id && marcarComoPaga(dialogoConfirmacao.id)}
            autoFocus
          >
            {t('confirmar')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListaContasAPagar; 