import React, { useState, useMemo } from 'react';
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
  Tooltip
} from '@mui/material';
import { 
  Search as SearchIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { ptBR, enUS, de } from 'date-fns/locale';
import { useFinanceiro } from '../../../contexts/FinanceiroContext';

const ListaContasAPagar = () => {
  const { t, i18n } = useTranslation();
  const { transacoes, editarTransacao } = useFinanceiro();
  
  // Filtros
  const [filtros, setFiltros] = useState({
    dataInicio: '',
    dataFim: '',
    fornecedor: '',
    status: ''
  });
  
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  
  // Obter o locale correto para formatação de datas
  const getDateLocale = () => {
    switch (i18n.language) {
      case 'pt':
        return ptBR;
      case 'de':
        return de;
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
  
  // Aplicar filtros
  const contasFiltradas = useMemo(() => {
    return contasAPagar.filter(conta => {
      // Filtro de data início
      if (filtros.dataInicio && conta.data < filtros.dataInicio) {
        return false;
      }
      
      // Filtro de data fim
      if (filtros.dataFim && conta.data > filtros.dataFim) {
        return false;
      }
      
      // Filtro de fornecedor
      if (filtros.fornecedor && 
          (!conta.fornecedor || 
           !conta.fornecedor.toLowerCase().includes(filtros.fornecedor.toLowerCase()))) {
        return false;
      }
      
      // Filtro de status (pago/pendente)
      if (filtros.status) {
        if (filtros.status === 'pago') {
          // Se todas as parcelas estão pagas
          if (!conta.parcelamento || 
              (conta.parcelamento && !conta.parcelamento.parcelas.some(p => !p.pago))) {
            return true;
          }
          return false;
        } else if (filtros.status === 'pendente') {
          // Se existe alguma parcela não paga
          if (!conta.parcelamento || 
              (conta.parcelamento && conta.parcelamento.parcelas.some(p => !p.pago))) {
            return true;
          }
          return false;
        }
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
        const parcelasAtualizadas = contaParaAtualizar.parcelamento.parcelas.map(parcela => {
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
    }
  };
  
  // Limpar todos os filtros
  const limparFiltros = () => {
    setFiltros({
      dataInicio: '',
      dataFim: '',
      fornecedor: '',
      status: ''
    });
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          {t('contasAPagar')}
        </Typography>
        
        <Box>
          <Tooltip title={t('filtros')}>
            <IconButton onClick={() => setMostrarFiltros(!mostrarFiltros)}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Filtros */}
      {mostrarFiltros && (
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                label={t('dataInicio')}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={filtros.dataInicio}
                onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                label={t('dataFim')}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={filtros.dataFim}
                onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                label={t('fornecedor')}
                fullWidth
                value={filtros.fornecedor}
                onChange={(e) => setFiltros({...filtros, fornecedor: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.5}>
              <TextField
                select
                label={t('status')}
                fullWidth
                value={filtros.status}
                onChange={(e) => setFiltros({...filtros, status: e.target.value})}
              >
                <MenuItem value="">{t('todos')}</MenuItem>
                <MenuItem value="pendente">{t('pendente')}</MenuItem>
                <MenuItem value="pago">{t('pago')}</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button 
                variant="outlined" 
                startIcon={<ClearIcon />} 
                onClick={limparFiltros}
                fullWidth
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
              <TableCell>{t('descricao')}</TableCell>
              <TableCell>{t('fornecedor')}</TableCell>
              <TableCell>{t('data')}</TableCell>
              <TableCell>{t('valor')}</TableCell>
              <TableCell>{t('status')}</TableCell>
              <TableCell align="right">{t('acoes')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contasFiltradas.length > 0 ? (
              contasFiltradas.map((conta) => {
                // Verificar status de pagamento
                const todasParcPagas = conta.parcelamento ? 
                  !conta.parcelamento.parcelas.some(p => !p.pago) : 
                  false;
                
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
                        label={todasParcPagas ? t('pago') : t('pendente')} 
                        color={todasParcPagas ? "success" : "warning"} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell align="right">
                      {!todasParcPagas && (
                        <Tooltip title={t('marcarComoPago')}>
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => marcarComoPaga(conta.id)}
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title={t('editar')}>
                        <IconButton size="small">
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
    </Box>
  );
};

export default ListaContasAPagar; 