/**
 * Relatório de Sugestão de Compra
 * 
 * Este componente exibe um relatório com sugestões de compra baseadas na periodicidade
 * de necessidade definida para cada produto no inventário.
 */
import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import { 
  ShoppingCart as ShoppingCartIcon,
  Print as PrintIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ItemInventario, calcularNecessidadeSemanal, calcularSugestaoCompra } from '../../contexts/InventarioContext';

interface RelatorioSugestaoCompraProps {
  itens: ItemInventario[];
  onPrint?: () => void;
  onExport?: () => void;
}

const RelatorioSugestaoCompra: React.FC<RelatorioSugestaoCompraProps> = ({
  itens,
  onPrint,
  onExport
}) => {
  const { t } = useTranslation();

  // Filtrar apenas itens que necessitam compra
  const itensFiltrados = useMemo(() => {
    return itens.filter(item => {
      if (!item.nivelMinimoEstoque) return false;
      
      const sugestaoCompra = calcularSugestaoCompra(
        item.quantidade,
        item.nivelMinimoEstoque,
        item.periodicidadeNecessidade || 'semanal'
      );
      
      return sugestaoCompra > 0;
    }).sort((a, b) => a.nome.localeCompare(b.nome));
  }, [itens]);

  // Verificar se há itens para exibir
  if (itensFiltrados.length === 0) {
    return (
      <Paper sx={{ p: 3, mb: 2 }}>
        <Alert severity="info">
          {t('Não há produtos que necessitem de reposição no momento.')}
        </Alert>
      </Paper>
    );
  }

  // Calcular o total de itens a serem comprados
  const totalItens = itensFiltrados.length;

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" component="h2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingCartIcon sx={{ mr: 1 }} />
            {t('Relatório de Sugestão de Compra')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('{{total}} produtos necessitam de reposição', { total: totalItens })}
          </Typography>
        </Box>
        <Box>
          {onPrint && (
            <Button 
              variant="outlined" 
              startIcon={<PrintIcon />} 
              onClick={onPrint}
              size="small"
              sx={{ mr: 1 }}
            >
              {t('Imprimir')}
            </Button>
          )}
          {onExport && (
            <Button 
              variant="outlined" 
              startIcon={<DownloadIcon />} 
              onClick={onExport}
              size="small"
            >
              {t('Exportar')}
            </Button>
          )}
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <TableContainer>
        <Table aria-label="tabela de sugestão de compra">
          <TableHead>
            <TableRow>
              <TableCell>{t('Produto')}</TableCell>
              <TableCell align="right">{t('Estoque Atual')}</TableCell>
              <TableCell align="right">{t('Necessidade Semanal')}</TableCell>
              <TableCell align="right">{t('Sugestão de Compra')}</TableCell>
              <TableCell align="center">{t('Periodicidade')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itensFiltrados.map((item) => {
              const necessidadeSemanal = calcularNecessidadeSemanal(
                item.nivelMinimoEstoque || 0,
                item.periodicidadeNecessidade || 'semanal'
              );
              
              const sugestaoCompra = calcularSugestaoCompra(
                item.quantidade,
                item.nivelMinimoEstoque || 0,
                item.periodicidadeNecessidade || 'semanal'
              );
              
              // Formatar a periodicidade para exibição
              const formatPeriodicidade = () => {
                switch (item.periodicidadeNecessidade) {
                  case 'diario':
                    return 'Diário';
                  case 'semanal':
                    return 'Semanal';
                  case 'mensal':
                    return 'Mensal';
                  case 'trimestral':
                    return 'Trimestral';
                  default:
                    return 'Semanal';
                }
              };
              
              return (
                <TableRow key={item.id}>
                  <TableCell component="th" scope="row">
                    <Typography variant="body2" fontWeight="medium">
                      {item.nome}
                    </Typography>
                    {item.categoria && (
                      <Typography variant="caption" color="text.secondary">
                        {item.categoria}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {item.quantidade} {item.unidadeMedida}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2">
                      {necessidadeSemanal.toFixed(1)} {item.unidadeMedida}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({formatPeriodicidade()})
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      color="warning"
                      label={`${sugestaoCompra.toFixed(1)} ${item.unidadeMedida}`}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      size="small" 
                      label={formatPeriodicidade()} 
                      variant="outlined"
                      color="primary"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Typography variant="body2" color="text.secondary">
          {t('Relatório gerado em: {{data}}', { data: new Date().toLocaleString() })}
        </Typography>
      </Box>
    </Paper>
  );
};

export default RelatorioSugestaoCompra; 