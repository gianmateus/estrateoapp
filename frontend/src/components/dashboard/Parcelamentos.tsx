/**
 * Componente Parcelamentos - Exibe parcelamentos e recebíveis futuros
 * Component Parcelamentos - Displays installments and future receivables
 * 
 * Agrupa "Recebíveis Futuros" e "Parcelamentos Abertos" em uma única seção
 * Groups "Future Receivables" and "Open Installments" in a single section
 */

import React from 'react';
import {
  Box,
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  Stack,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  ArrowDownward as ArrowDownwardIcon,
  ArrowUpward as ArrowUpwardIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface ParcelamentoItem {
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

interface RecebivelItem {
  id: string;
  descricao: string;
  valor: number;
  dataPrevista: string;
  statusRecebimento: string;
  cliente: string;
}

interface ParcelamentosProps {
  parcelamentosAbertos: ParcelamentoItem[];
  recebiveisFuturos: RecebivelItem[];
}

const Parcelamentos: React.FC<ParcelamentosProps> = ({
  parcelamentosAbertos,
  recebiveisFuturos
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  
  // Verifica se o usuário prefere movimento reduzido
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Container para os dois lados
  return (
    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
      {/* Lado 1: Recebíveis Futuros */}
      <Box component={motion.div} 
          whileHover={{ 
            boxShadow: theme.shadows[3], 
            translateY: prefersReducedMotion ? 0 : -2
          }}
          flex={1}
          sx={{ 
            p: 3, 
            borderRadius: 3, 
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[1]
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <ArrowDownwardIcon sx={{ mr: 1, color: theme.palette.success.main }} />
            {t('recebiveis')}
          </Typography>
          
          {recebiveisFuturos && recebiveisFuturos.length > 0 ? (
            <List disablePadding>
              {recebiveisFuturos.slice(0, 3).map((item, index) => (
                <ListItem 
                  key={item.id}
                  disablePadding
                  sx={{
                    borderBottom: index < Math.min(recebiveisFuturos.length - 1, 2) 
                      ? `1px solid ${theme.palette.divider}` 
                      : 'none',
                    py: 1.5
                  }}
                >
                  <ListItemText
                    primary={item.descricao}
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <CalendarIcon sx={{ fontSize: 14, mr: 0.5, color: theme.palette.text.secondary }} />
                        {formatDate(item.dataPrevista)}
                      </Box>
                    }
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <Typography variant="body2" fontWeight="bold" color="success.main">
                    {formatCurrency(item.valor)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              {t('semDadosNoPeriodo')}
            </Typography>
          )}
        </Box>
      
      {/* Lado 2: Parcelamentos Abertos */}
      <Box component={motion.div} 
          whileHover={{ 
            boxShadow: theme.shadows[3], 
            translateY: prefersReducedMotion ? 0 : -2
          }}
          flex={1}
          sx={{ 
            p: 3, 
            borderRadius: 3, 
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[1]
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <ArrowUpwardIcon sx={{ mr: 1, color: theme.palette.error.main }} />
            {t('parcelamentos')}
          </Typography>
          
          {parcelamentosAbertos && parcelamentosAbertos.length > 0 ? (
            <List disablePadding>
              {parcelamentosAbertos.slice(0, 3).map((item, index) => (
                <ListItem 
                  key={item.id}
                  disablePadding
                  sx={{
                    borderBottom: index < Math.min(parcelamentosAbertos.length - 1, 2) 
                      ? `1px solid ${theme.palette.divider}` 
                      : 'none',
                    py: 1.5
                  }}
                >
                  <ListItemText
                    primary={item.descricao}
                    secondary={
                      <Box component="span">
                        {`${item.parcelasPagas}/${item.totalParcelas} ${t('parcelas')} - ${t('prox')}: ${formatDate(item.proximaParcela.data)}`}
                      </Box>
                    }
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <Stack direction="column" alignItems="flex-end" spacing={0.5}>
                    <Typography variant="body2" fontWeight="bold" 
                      color={item.tipo === 'entrada' ? 'success.main' : 'error.main'}>
                      {formatCurrency(item.proximaParcela.valor)}
                    </Typography>
                    <Chip 
                      icon={item.tipo === 'entrada' ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                      label={item.tipo === 'entrada' ? t('entrada') : t('saida')}
                      color={item.tipo === 'entrada' ? 'success' : 'error'}
                      size="small"
                      sx={{ height: 24, '& .MuiChip-icon': { fontSize: 16 } }}
                    />
                  </Stack>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              {t('semDadosNoPeriodo')}
            </Typography>
          )}
        </Box>
    </Box>
  );
};

export default Parcelamentos; 