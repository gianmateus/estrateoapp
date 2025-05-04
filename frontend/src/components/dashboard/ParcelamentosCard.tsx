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
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Card, 
  CardHeader, 
  CardContent,
  useTheme 
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
import { motion } from 'framer-motion';
import ResponsiveGrid from '../common/ResponsiveGrid';

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
  const theme = useTheme();

  // Variantes para animações
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5
      }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };

  return (
    <Box>
      <Typography variant="h2" gutterBottom>
        {t('parcelamentos') || "Parcelamentos e Recebíveis"}
      </Typography>
      
      <ResponsiveGrid spacing={4}>
        {/* Recebíveis Futuros */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card>
            <CardHeader 
              title={t('recebiveisFuturos') || "Recebíveis Futuros"} 
              avatar={<CalendarIcon sx={{ color: theme.palette.primary.main }} />} 
              titleTypographyProps={{ variant: 'h3' }}
            />
            <Divider />
            <CardContent>
              {recebiveisFuturos.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <Typography color="text.secondary" align="center">
                    {t('semRecebiveisFuturos') || "Sem recebíveis futuros"}
                  </Typography>
                </Box>
              ) : (
                <List>
                  {recebiveisFuturos.map((recebivel, index) => (
                    <motion.div
                      key={recebivel.id}
                      custom={index}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <ListItem 
                        divider={index < recebiveisFuturos.length - 1}
                        sx={{
                          py: 2,
                          '&:hover': {
                            bgcolor: theme.palette.grey[50]
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="body1" fontWeight="medium" noWrap sx={{ maxWidth: '70%' }}>
                                {recebivel.descricao}
                              </Typography>
                              <Typography variant="body1" color="primary" fontWeight="bold">
                                {formatCurrency(recebivel.valor)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                              <Typography variant="caption">
                                {formatDate(recebivel.dataPrevista)} • {recebivel.cliente}
                              </Typography>
                              <Chip 
                                label={t(recebivel.statusRecebimento) || recebivel.statusRecebimento} 
                                size="small" 
                                color={recebivel.statusRecebimento === 'recebido' ? 'success' : 
                                      recebivel.statusRecebimento === 'parcialmente_recebido' ? 'warning' : 'default'} 
                                variant="outlined"
                              />
                            </Box>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Parcelamentos Abertos */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader 
              title={t('parcelamentosAbertos') || "Parcelamentos Abertos"} 
              avatar={<ReceiptIcon sx={{ color: theme.palette.primary.main }} />} 
              titleTypographyProps={{ variant: 'h3' }}
            />
            <Divider />
            <CardContent>
              {parcelamentosAbertos.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <Typography color="text.secondary" align="center">
                    {t('semParcelamentosAbertos') || "Sem parcelamentos abertos"}
                  </Typography>
                </Box>
              ) : (
                <List>
                  {parcelamentosAbertos.map((parcelamento, index) => (
                    <motion.div
                      key={parcelamento.id}
                      custom={index}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <ListItem 
                        divider={index < parcelamentosAbertos.length - 1}
                        sx={{
                          py: 2,
                          '&:hover': {
                            bgcolor: theme.palette.grey[50]
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="body1" fontWeight="medium" noWrap sx={{ maxWidth: '70%' }}>
                                {parcelamento.descricao}
                              </Typography>
                              <Box display="flex" alignItems="center">
                                {parcelamento.tipo === 'entrada' ? 
                                  <TrendingUpIcon fontSize="small" color="success" sx={{ mr: 0.5 }} /> : 
                                  <TrendingDownIcon fontSize="small" color="error" sx={{ mr: 0.5 }} />
                                }
                                <Typography variant="body1" fontWeight="bold">
                                  {formatCurrency(parcelamento.valor)}
                                </Typography>
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                              <Typography variant="caption">
                                {t('parcelas') || "Parcelas"}: {parcelamento.parcelasPagas}/{parcelamento.totalParcelas}
                              </Typography>
                              <Typography variant="caption">
                                {t('proximaParcela') || "Próxima parcela"}: {formatCurrency(parcelamento.proximaParcela.valor)} • {formatDate(parcelamento.proximaParcela.data)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    </motion.div>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Totais por Categoria */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader 
              title={t('totaisPorCategoria') || "Totais por Categoria"} 
              avatar={<CategoryIcon sx={{ color: theme.palette.primary.main }} />} 
              titleTypographyProps={{ variant: 'h3' }}
            />
            <Divider />
            <CardContent>
              {totaisPorCategoria.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                  <Typography color="text.secondary" align="center">
                    {t('semDadosCategoria') || "Sem dados por categoria"}
                  </Typography>
                </Box>
              ) : (
                <List>
                  {totaisPorCategoria.map((categoria, index) => (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <ListItem 
                        divider={index < totaisPorCategoria.length - 1}
                        sx={{
                          py: 2,
                          bgcolor: index % 2 === 1 ? theme.palette.grey[100] : 'transparent',
                          '&:hover': {
                            bgcolor: theme.palette.grey[50]
                          }
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="body1" fontWeight="medium">
                                {categoria.categoria}
                              </Typography>
                              <Typography 
                                variant="body1" 
                                fontWeight="bold"
                                color={categoria.saldo >= 0 ? 'success.main' : 'error.main'}
                              >
                                {formatCurrency(categoria.saldo)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
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
                    </motion.div>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </ResponsiveGrid>
    </Box>
  );
};

export default ParcelamentosCard; 