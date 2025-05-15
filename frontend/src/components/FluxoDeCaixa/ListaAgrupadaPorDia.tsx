import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownwardIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  AccessTime as AccessTimeIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { format, isToday, isYesterday } from 'date-fns';
import { ptBR, enUS, de, it } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';
import { Transacao } from '../../contexts/FinanceiroContext';

// Interfaces
interface ListaAgrupadaPorDiaProps {
  transacoesPorDia: { [key: string]: Transacao[] };
  onEdit?: (transacao: Transacao) => void;
  onDelete?: (transacao: Transacao) => void;
  mostrarAcoes?: boolean;
}

// Função para obter localização de data com base no idioma
const getDateLocale = (lang: string) => {
  switch(lang) {
    case 'it': return it;
    case 'de': return de;
    case 'en': return enUS;
    default: return ptBR;
  }
};

// Função para formatar moeda
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR'
  }).format(valor);
};

const ListaAgrupadaPorDia: React.FC<ListaAgrupadaPorDiaProps> = ({
  transacoesPorDia,
  onEdit,
  onDelete,
  mostrarAcoes = false
}) => {
  const { t, i18n } = useTranslation();
  
  // Se não houver dados, mostrar mensagem
  if (Object.keys(transacoesPorDia).length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          {t('fluxoCaixa.nenhumaMovimentacao')}
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      {Object.entries(transacoesPorDia).map(([data, transacoesDoDia]) => (
        <Paper key={data} sx={{ mb: 3, overflow: 'hidden' }}>
          {/* Cabeçalho do dia */}
          <Box sx={{ 
            p: 2, 
            backgroundColor: 'primary.main', 
            color: 'primary.contrastText',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Typography variant="h6">
              {(() => {
                const dataObj = new Date(data);
                const locale = getDateLocale(i18n.language);
                
                if (isToday(dataObj)) {
                  return t('fluxoCaixa.hoje') || 'Hoje';
                } else if (isYesterday(dataObj)) {
                  return t('fluxoCaixa.ontem') || 'Ontem';
                } else {
                  return format(dataObj, 'EEEE, dd MMMM yyyy', { locale });
                }
              })()}
            </Typography>
            
            <Box>
              {/* Resumo do dia */}
              {(() => {
                const totalDia = transacoesDoDia.reduce((acc, t) => {
                  return t.tipo === 'entrada' 
                    ? acc + t.valor 
                    : acc - t.valor;
                }, 0);
                
                return (
                  <Chip 
                    label={formatarMoeda(totalDia)}
                    color={totalDia >= 0 ? 'success' : 'error'}
                    variant="filled"
                  />
                );
              })()}
            </Box>
          </Box>
          
          {/* Lista de transações do dia */}
          <Box>
            {transacoesDoDia.map((transacao) => (
              <Box 
                key={transacao.id}
                sx={{ 
                  p: 2, 
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  '&:last-child': {
                    borderBottom: 'none'
                  },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Ícone de entrada/saída */}
                  <Box 
                    sx={{ 
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: transacao.tipo === 'entrada' 
                        ? 'success.light' 
                        : 'error.light',
                      color: '#fff',
                      mr: 2
                    }}
                  >
                    {transacao.tipo === 'entrada' 
                      ? <ArrowUpIcon /> 
                      : <ArrowDownwardIcon />}
                  </Box>
                  
                  {/* Descrição e detalhes */}
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {transacao.descricao}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {transacao.tipo === 'entrada' 
                        ? (transacao.cliente || t('fluxoCaixa.cliente') || 'Cliente') 
                        : (transacao.fornecedor || t('fluxoCaixa.fornecedor') || 'Fornecedor')}
                      {transacao.observacao && ` • ${transacao.observacao}`}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {/* Valor e status */}
                  <Box sx={{ textAlign: 'right', mr: mostrarAcoes ? 2 : 0 }}>
                    <Typography 
                      variant="body1" 
                      fontWeight="bold"
                      color={transacao.tipo === 'entrada' ? 'success.main' : 'error.main'}
                    >
                      {transacao.tipo === 'entrada' ? '+' : '-'} {formatarMoeda(transacao.valor)}
                    </Typography>
                    
                    {/* Status com ícones */}
                    {(() => {
                      const isPago = transacao.parcelamento?.parcelas.some(p => p.pago) || false;
                      
                      if (isPago) {
                        return (
                          <Chip
                            size="small"
                            icon={<CheckCircleIcon />}
                            label={t('fluxoCaixa.confirmado') || 'Confirmado'}
                            color="success"
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        );
                      } else {
                        return (
                          <Chip
                            size="small"
                            icon={<AccessTimeIcon />}
                            label={t('fluxoCaixa.pendente') || 'Pendente'}
                            color="warning"
                            variant="outlined"
                            sx={{ mt: 0.5 }}
                          />
                        );
                      }
                    })()}
                  </Box>
                  
                  {/* Botões de ação (se habilitados) */}
                  {mostrarAcoes && (
                    <Box>
                      {onEdit && (
                        <Tooltip title={t('comum.editar') || ''}>
                          <IconButton 
                            size="small" 
                            onClick={() => onEdit(transacao)}
                            aria-label={t('comum.editar') || ''}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      
                      {onDelete && (
                        <Tooltip title={t('comum.excluir') || ''}>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => onDelete(transacao)}
                            aria-label={t('comum.excluir') || ''}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default ListaAgrupadaPorDia; 