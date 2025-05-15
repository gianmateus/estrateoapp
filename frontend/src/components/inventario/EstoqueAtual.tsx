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
  TextField,
  Button,
  IconButton,
  Chip,
  Tooltip,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  Save as SaveIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { ItemInventario, calcularNecessidadeSemanal, calcularSugestaoCompra } from '../../contexts/InventarioContext';

interface EstoqueAtualProps {
  itens: ItemInventario[];
  onUpdateQuantidade: (id: string, quantidade: number) => Promise<void>;
  onOpenSugestaoCompra: () => void;
}

const EstoqueAtual: React.FC<EstoqueAtualProps> = ({
  itens,
  onUpdateQuantidade,
  onOpenSugestaoCompra
}) => {
  const { t } = useTranslation();
  const [editingQuantidades, setEditingQuantidades] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calcular itens com necessidade de compra
  const itensCriticos = useMemo(() => {
    return itens.filter(item => {
      if (!item.nivelMinimoEstoque) return false;
      
      const sugestaoCompra = calcularSugestaoCompra(
        item.quantidade,
        item.nivelMinimoEstoque,
        item.periodicidadeNecessidade || 'semanal'
      );
      
      return sugestaoCompra > 0;
    }).length;
  }, [itens]);

  // Iniciar edição de quantidade
  const handleStartEdit = (id: string, quantidadeAtual: number) => {
    setEditingQuantidades(prev => ({
      ...prev,
      [id]: quantidadeAtual
    }));
  };

  // Atualizar valor de edição
  const handleEditChange = (id: string, value: string) => {
    const quantidade = parseFloat(value);
    
    if (isNaN(quantidade) || quantidade < 0) {
      setErrors(prev => ({
        ...prev,
        [id]: t('inventario.quantidadeInvalida')
      }));
    } else {
      // Limpar erro se existir
      if (errors[id]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[id];
          return newErrors;
        });
      }
      
      setEditingQuantidades(prev => ({
        ...prev,
        [id]: quantidade
      }));
    }
  };

  // Salvar quantidade
  const handleSaveQuantidade = async (id: string) => {
    if (errors[id]) return;
    
    const newQuantidade = editingQuantidades[id];
    
    setSaving(prev => ({
      ...prev,
      [id]: true
    }));
    
    try {
      await onUpdateQuantidade(id, newQuantidade);
      
      // Limpar estado após salvar
      setEditingQuantidades(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        [id]: t('comum.erroAoSalvar')
      }));
    } finally {
      setSaving(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
    }
  };

  // Verificar status de um item
  const getItemStatus = (item: ItemInventario) => {
    if (!item.nivelMinimoEstoque) return 'normal';
    
    const sugestaoCompra = calcularSugestaoCompra(
      item.quantidade,
      item.nivelMinimoEstoque,
      item.periodicidadeNecessidade || 'semanal'
    );
    
    if (sugestaoCompra > 0) {
      return sugestaoCompra >= item.nivelMinimoEstoque ? 'critical' : 'warning';
    }
    
    return 'normal';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" component="h2">
          {t('inventario.estoqueAtual')}
        </Typography>
        
        <Box>
          {itensCriticos > 0 && (
            <Button
              variant="outlined"
              color="warning"
              startIcon={<ShoppingCartIcon />}
              onClick={onOpenSugestaoCompra}
              size="small"
              sx={{ ml: 1 }}
            >
              {t('inventario.verSugestaoCompra')} ({itensCriticos})
            </Button>
          )}
        </Box>
      </Box>
      
      {itensCriticos > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t('inventario.itensPrecisandoReposicao', { count: itensCriticos })}
        </Alert>
      )}
      
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('inventario.produto')}</TableCell>
              <TableCell align="right">{t('inventario.quantidadeAtual')}</TableCell>
              <TableCell align="right">{t('inventario.necessidadeSemanal')}</TableCell>
              <TableCell align="right">{t('inventario.diferenca')}</TableCell>
              <TableCell align="center">{t('inventario.status')}</TableCell>
              <TableCell align="center">{t('comum.acoes')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itens.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" sx={{ py: 2 }}>
                    {t('inventario.nenhumItemCadastrado')}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              itens.map(item => {
                const necessidadeSemanal = item.nivelMinimoEstoque 
                  ? calcularNecessidadeSemanal(
                      item.nivelMinimoEstoque,
                      item.periodicidadeNecessidade || 'semanal'
                    )
                  : 0;
                
                const sugestaoCompra = item.nivelMinimoEstoque
                  ? calcularSugestaoCompra(
                      item.quantidade,
                      item.nivelMinimoEstoque,
                      item.periodicidadeNecessidade || 'semanal'
                    )
                  : 0;
                
                const itemStatus = getItemStatus(item);
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
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
                      {editingQuantidades[item.id] !== undefined ? (
                        <TextField
                          size="small"
                          type="number"
                          value={editingQuantidades[item.id]}
                          onChange={(e) => handleEditChange(item.id, e.target.value)}
                          error={!!errors[item.id]}
                          helperText={errors[item.id]}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {item.unidadeMedida}
                              </InputAdornment>
                            )
                          }}
                          sx={{ width: '120px' }}
                        />
                      ) : (
                        <Typography 
                          variant="body2" 
                          onClick={() => handleStartEdit(item.id, item.quantidade)}
                          sx={{ cursor: 'pointer' }}
                        >
                          {item.quantidade} {item.unidadeMedida}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {necessidadeSemanal > 0 ? (
                        <Typography variant="body2">
                          {necessidadeSemanal.toFixed(1)} {item.unidadeMedida}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {sugestaoCompra > 0 ? (
                        <Chip
                          size="small"
                          color="warning"
                          label={`${sugestaoCompra.toFixed(1)} ${item.unidadeMedida}`}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          -
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        size="small"
                        color={
                          itemStatus === 'critical' ? 'error' :
                          itemStatus === 'warning' ? 'warning' : 'success'
                        }
                        label={
                          itemStatus === 'critical' ? t('inventario.statusCritico') :
                          itemStatus === 'warning' ? t('inventario.statusBaixo') : t('inventario.statusNormal')
                        }
                      />
                    </TableCell>
                    <TableCell align="center">
                      {editingQuantidades[item.id] !== undefined ? (
                        <IconButton 
                          size="small" 
                          onClick={() => handleSaveQuantidade(item.id)}
                          disabled={saving[item.id] || !!errors[item.id]}
                          color="primary"
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        sugestaoCompra > 0 && (
                          <Tooltip title={t('inventario.adicionarSugestaoCompra')}>
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={onOpenSugestaoCompra}
                            >
                              <ShoppingCartIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default EstoqueAtual; 