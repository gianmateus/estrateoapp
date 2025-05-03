/**
 * Componente para exibir informações de parcelamentos no dashboard
 * Component to display installment information on the dashboard
 * 
 * Mostra recebíveis futuros, parcelamentos abertos e totais por categoria
 * Shows future receivables, open installments and totals by category
 */
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Grid, 
  Card, 
  CardHeader, 
  CardContent 
} from '@mui/material';
import { 
  ReceiptLong as ReceiptIcon, 
  CalendarToday as CalendarIcon, 
  Category as CategoryIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface RecebivelFuturo {
  id: string;
  descricao: string;
  valor: number;
  dataPrevista: string;
  statusRecebimento: string;
  cliente: string;
}

interface ParcelamentoAberto {
  id: string;
  descricao: string;
  valor: number;
  parcelasPagas: number;
  totalParcelas: number;
  proximaParcela: {
    valor: number;
    data: string;
  };
  tipo: 'entrada' | 'saida';
}

interface TotalCategoria {
  categoria: string;
  valorEntradas: number;
  valorSaidas: number;
  saldo: number;
}

interface ParcelamentosCardProps {
  recebiveisFuturos: RecebivelFuturo[];
  parcelamentosAbertos: ParcelamentoAberto[];
  totaisPorCategoria: TotalCategoria[];
}

const ParcelamentosCard: React.FC<ParcelamentosCardProps> = ({
  recebiveisFuturos,
  parcelamentosAbertos,
  totaisPorCategoria
}) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3}>
      {/* Recebíveis Futuros */}
      <Grid item xs={12} md={6} lg={4}>
        <Card elevation={2}>
          <CardHeader 
            title={t('recebiveisFuturos')} 
            avatar={<CalendarIcon color="primary" />} 
            titleTypographyProps={{ variant: 'h6' }}
          />
          <Divider />
          <CardContent>
            {recebiveisFuturos.length === 0 ? (
              <Typography color="textSecondary" align="center">{t('semRecebiveisFuturos')}</Typography>
            ) : (
              <List dense>
                {recebiveisFuturos.map((recebivel) => (
                  <ListItem key={recebivel.id} divider>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" noWrap style={{ maxWidth: '70%' }}>
                            {recebivel.descricao}
                          </Typography>
                          <Typography variant="body2" color="primary" fontWeight="bold">
                            {formatCurrency(recebivel.valor)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption">
                            {formatDate(recebivel.dataPrevista)} • {recebivel.cliente}
                          </Typography>
                          <Chip 
                            label={t(recebivel.statusRecebimento)} 
                            size="small" 
                            color={recebivel.statusRecebimento === 'recebido' ? 'success' : 
                                  recebivel.statusRecebimento === 'parcialmente_recebido' ? 'warning' : 'default'} 
                            variant="outlined"
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Parcelamentos Abertos */}
      <Grid item xs={12} md={6} lg={4}>
        <Card elevation={2}>
          <CardHeader 
            title={t('parcelamentosAbertos')} 
            avatar={<ReceiptIcon color="primary" />} 
            titleTypographyProps={{ variant: 'h6' }}
          />
          <Divider />
          <CardContent>
            {parcelamentosAbertos.length === 0 ? (
              <Typography color="textSecondary" align="center">{t('semParcelamentosAbertos')}</Typography>
            ) : (
              <List dense>
                {parcelamentosAbertos.map((parcelamento) => (
                  <ListItem key={parcelamento.id} divider>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" noWrap style={{ maxWidth: '70%' }}>
                            {parcelamento.descricao}
                          </Typography>
                          <Box display="flex" alignItems="center">
                            {parcelamento.tipo === 'entrada' ? 
                              <TrendingUpIcon fontSize="small" color="success" sx={{ mr: 0.5 }} /> : 
                              <TrendingDownIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
                            }
                            <Typography variant="body2" fontWeight="bold">
                              {formatCurrency(parcelamento.valor)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="caption">
                            {t('parcelas')}: {parcelamento.parcelasPagas}/{parcelamento.totalParcelas}
                          </Typography>
                          <Typography variant="caption">
                            {t('proximaParcela')}: {formatCurrency(parcelamento.proximaParcela.valor)} • {formatDate(parcelamento.proximaParcela.data)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Totais por Categoria */}
      <Grid item xs={12} md={6} lg={4}>
        <Card elevation={2}>
          <CardHeader 
            title={t('totaisPorCategoria')} 
            avatar={<CategoryIcon color="primary" />} 
            titleTypographyProps={{ variant: 'h6' }}
          />
          <Divider />
          <CardContent>
            {totaisPorCategoria.length === 0 ? (
              <Typography color="textSecondary" align="center">{t('semDadosCategoria')}</Typography>
            ) : (
              <List dense>
                {totaisPorCategoria.map((categoria, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontWeight="medium">
                            {categoria.categoria}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            fontWeight="bold"
                            color={categoria.saldo >= 0 ? 'success.main' : 'error.main'}
                          >
                            {formatCurrency(categoria.saldo)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="caption" color="success.main" component="span">
                              + {formatCurrency(categoria.valorEntradas)}
                            </Typography>
                          </Box>
                          <Box>
                            <Typography variant="caption" color="error.main" component="span">
                              - {formatCurrency(categoria.valorSaidas)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ParcelamentosCard; 