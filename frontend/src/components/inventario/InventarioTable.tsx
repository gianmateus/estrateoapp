import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  TablePagination,
  TableSortLabel,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { ItemInventario, calcularNecessidadeSemanal, calcularSugestaoCompra } from '../../contexts/InventarioContext';
import { useTranslation } from 'react-i18next';

interface InventarioTableProps {
  items: ItemInventario[];
  onEdit: (item: ItemInventario) => void;
  onDelete: (item: ItemInventario) => void;
  page: number;
  rowsPerPage: number;
  totalItems: number;
  handlePageChange: (event: unknown, newPage: number) => void;
  handleRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  orderBy: keyof ItemInventario;
  order: 'asc' | 'desc';
  handleRequestSort: (property: keyof ItemInventario) => void;
}

const InventarioTable: React.FC<InventarioTableProps> = ({
  items,
  onEdit,
  onDelete,
  page,
  rowsPerPage,
  totalItems,
  handlePageChange,
  handleRowsPerPageChange,
  orderBy,
  order,
  handleRequestSort
}) => {
  const { t } = useTranslation();

  // Formatar valores monetários como Euro
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Transformar periodicidade para texto legível
  const formatPeriodicidade = (periodicidade?: string) => {
    switch (periodicidade) {
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

  // Verificar se um item está próximo da data de validade (30 dias)
  const isNearExpiration = (date: Date | string | undefined): boolean => {
    if (!date) return false;
    
    const expirationDate = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return expirationDate <= thirtyDaysFromNow && expirationDate > today;
  };
  
  // Verificar se um item está vencido
  const isExpired = (date: Date | string | undefined): boolean => {
    if (!date) return false;
    
    const expirationDate = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    
    return expirationDate < today;
  };
  
  // Verificar se um item está abaixo do nível mínimo
  const isBelowMinimumLevel = (item: ItemInventario): boolean => {
    return !!item.nivelMinimoEstoque && item.quantidade < item.nivelMinimoEstoque;
  };

  // Obter a cor do status
  const getStatusColor = (item: ItemInventario) => {
    if (isExpired(item.dataValidade)) return 'error';
    if (isNearExpiration(item.dataValidade)) return 'warning';
    if (isBelowMinimumLevel(item)) return 'error';
    return 'success';
  };

  // Obter o texto do status
  const getStatusText = (item: ItemInventario): string => {
    if (isExpired(item.dataValidade)) return t('Vencido');
    if (isNearExpiration(item.dataValidade)) return t('Vence em breve');
    if (isBelowMinimumLevel(item)) return t('Estoque baixo');
    return t('Normal');
  };

  // Calcular a sugestão de compra baseada na necessidade e periodicidade
  const getSugestaoCompra = (item: ItemInventario): number => {
    if (!item.nivelMinimoEstoque) return 0;
    
    return calcularSugestaoCompra(
      item.quantidade,
      item.nivelMinimoEstoque,
      item.periodicidadeNecessidade || 'semanal'
    );
  };

  // Mostrar a necessidade ajustada para uma base semanal
  const getNecessidadeSemanal = (item: ItemInventario): number => {
    if (!item.nivelMinimoEstoque) return 0;
    
    return calcularNecessidadeSemanal(
      item.nivelMinimoEstoque,
      item.periodicidadeNecessidade || 'semanal'
    );
  };

  // Criar handler de ordenação para uma coluna
  const createSortHandler = (property: keyof ItemInventario) => () => {
    handleRequestSort(property);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table stickyHeader aria-label="tabela de inventário">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'nome'}
                    direction={orderBy === 'nome' ? order : 'asc'}
                    onClick={createSortHandler('nome')}
                  >
                    {t('Nome')}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'quantidade'}
                    direction={orderBy === 'quantidade' ? order : 'asc'}
                    onClick={createSortHandler('quantidade')}
                  >
                    {t('Quantidade')}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">{t('Unidade')}</TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'preco'}
                    direction={orderBy === 'preco' ? order : 'asc'}
                    onClick={createSortHandler('preco')}
                  >
                    {t('Preço Venda')}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">{t('Preço Compra')}</TableCell>
                <TableCell align="right">{t('Periodicidade')}</TableCell>
                <TableCell align="right">{t('Necessidade')}</TableCell>
                <TableCell align="right">{t('Sugestão')}</TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'dataValidade'}
                    direction={orderBy === 'dataValidade' ? order : 'asc'}
                    onClick={createSortHandler('dataValidade')}
                  >
                    {t('Validade')}
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">{t('Status')}</TableCell>
                <TableCell align="right">{t('Ações')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={12} align="center">
                    <Typography variant="body2" sx={{ py: 2 }}>
                      {t('Nenhum item encontrado')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => {
                  const statusColor = getStatusColor(item);
                  const statusText = getStatusText(item);
                  const sugestaoCompra = getSugestaoCompra(item);
                  const necessidadeSemanal = getNecessidadeSemanal(item);
                  
                  return (
                    <TableRow
                      key={item.id}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        backgroundColor: isExpired(item.dataValidade) 
                          ? 'rgba(244, 67, 54, 0.08)' 
                          : 'inherit'
                      }}
                    >
                      <TableCell padding="checkbox">
                        {item.foto ? (
                          <Avatar
                            alt={item.nome}
                            src={item.foto}
                            sx={{ width: 40, height: 40 }}
                          />
                        ) : (
                          <Avatar
                            sx={{ 
                              width: 40, 
                              height: 40, 
                              bgcolor: item.categoria 
                                ? `${item.categoria.toLowerCase().charCodeAt(0) % 5 === 0 ? 'primary' : 
                                    item.categoria.toLowerCase().charCodeAt(0) % 5 === 1 ? 'secondary' : 
                                    item.categoria.toLowerCase().charCodeAt(0) % 5 === 2 ? 'success' : 
                                    item.categoria.toLowerCase().charCodeAt(0) % 5 === 3 ? 'warning' : 'error'}.main` 
                                : 'primary.main' 
                            }}
                          >
                            {item.nome.charAt(0).toUpperCase()}
                          </Avatar>
                        )}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Tooltip title={item.descricao || ''}>
                          <Typography variant="body2" fontWeight="medium">
                            {item.nome}
                            {item.categoria && (
                              <Typography component="span" variant="caption" sx={{ ml: 1, opacity: 0.6 }}>
                                ({item.categoria})
                              </Typography>
                            )}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight={isBelowMinimumLevel(item) ? 'bold' : 'regular'} color={isBelowMinimumLevel(item) ? 'error' : 'inherit'}>
                          {item.quantidade}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{item.unidadeMedida}</TableCell>
                      <TableCell align="right">{formatCurrency(item.preco)}</TableCell>
                      <TableCell align="right">{item.precoCompra ? formatCurrency(item.precoCompra) : '-'}</TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          label={formatPeriodicidade(item.periodicidadeNecessidade)}
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {item.nivelMinimoEstoque ? (
                          <Typography variant="body2">
                            {necessidadeSemanal.toFixed(1)} {item.unidadeMedida}
                          </Typography>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {sugestaoCompra > 0 ? (
                          <Tooltip title={`Comprar ${sugestaoCompra.toFixed(1)} ${item.unidadeMedida}`}>
                            <Chip
                              icon={<ShoppingCartIcon />}
                              size="small"
                              label={`${sugestaoCompra.toFixed(1)} ${item.unidadeMedida}`}
                              color="warning"
                              variant="outlined"
                            />
                          </Tooltip>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {item.dataValidade ? (
                          <Typography 
                            variant="body2" 
                            color={
                              isExpired(item.dataValidade) 
                                ? 'error' 
                                : isNearExpiration(item.dataValidade) 
                                  ? 'warning.main' 
                                  : 'inherit'
                            }
                          >
                            {typeof item.dataValidade === 'string' 
                              ? new Date(item.dataValidade).toLocaleDateString() 
                              : item.dataValidade.toLocaleDateString()}
                          </Typography>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={statusText} 
                          color={statusColor as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small"
                          onClick={() => onEdit(item)}
                          aria-label={String(t('Editar'))}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={() => onDelete(item)}
                          aria-label={String(t('Excluir'))}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalItems}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          labelRowsPerPage={t('Itens por página')}
          labelDisplayedRows={({ from, to, count }) => 
            `${from}-${to} ${t('de')} ${count !== -1 ? count : `${t('mais de')} ${to}`}`
          }
        />
      </Paper>
    </Box>
  );
};

export default InventarioTable; 