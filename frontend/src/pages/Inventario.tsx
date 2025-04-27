import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Autocomplete,
  Grid,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { 
  Add as AddIcon,
  Remove as RemoveIcon,
  PictureAsPdf as PdfIcon,
  InfoOutlined as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Interface para os itens do inventário
interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

// Interface para os itens do relatório de compras
interface PurchaseItem {
  name: string;
  currentStock: number;
  weeklyNeed: number;
  toBuy: number;
  unit: string;
}

// Unidades disponíveis
const unitOptions = [
  { value: 'kg', label: 'quilograma' },
  { value: 'g', label: 'gramas' },
  { value: 'caixa', label: 'caixa' },
  { value: 'unidade', label: 'unidade' },
  { value: 'saco', label: 'saco' },
];

const Inventario = () => {
  const { t, i18n } = useTranslation();
  
  // Estados para os itens do inventário
  const [currentStockItems, setCurrentStockItems] = useState<InventoryItem[]>([]);
  const [weeklyNeedItems, setWeeklyNeedItems] = useState<InventoryItem[]>([]);
  
  // Estado para o alerta
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'info' as 'info' | 'success' | 'warning' | 'error'
  });
  
  // Estados para controlar os modais
  const [openCurrentStockModal, setOpenCurrentStockModal] = useState(false);
  const [openWeeklyNeedModal, setOpenWeeklyNeedModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  
  // Estados para edição e exclusão
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<{id: string, name: string, type: 'stock' | 'need'} | null>(null);
  
  // Estados para os formulários
  const [currentStockForm, setCurrentStockForm] = useState({
    name: '',
    quantity: 0,
    unit: 'kg',
    notes: '',
  });
  
  const [weeklyNeedForm, setWeeklyNeedForm] = useState({
    name: '',
    quantity: 0,
    unit: 'kg',
    notes: '',
  });

  // Estados para submissão dos formulários
  const [isSubmittingStock, setIsSubmittingStock] = useState(false);
  const [isSubmittingNeed, setIsSubmittingNeed] = useState(false);

  // Validação de formulários
  const [currentStockErrors, setCurrentStockErrors] = useState({
    name: '',
    quantity: '',
    unit: '',
  });

  const [weeklyNeedErrors, setWeeklyNeedErrors] = useState({
    name: '',
    quantity: '',
    unit: '',
  });
  
  // Efeito para carregar dados mockados para testes
  useEffect(() => {
    // Dados mockados para demonstração
    const mockCurrentStock = [
      { id: '1', name: 'Batata', quantity: 10, unit: 'kg', notes: 'Em estoque' },
      { id: '2', name: 'Arroz', quantity: 5, unit: 'kg', notes: 'Pacotes de 1kg' },
      { id: '3', name: 'Óleo', quantity: 8, unit: 'unidade', notes: 'Garrafas de 900ml' },
    ];
    
    const mockWeeklyNeed = [
      { id: '1', name: 'Batata', quantity: 15, unit: 'kg', notes: 'Para semana' },
      { id: '2', name: 'Arroz', quantity: 12, unit: 'kg', notes: 'Pacotes de 1kg' },
      { id: '4', name: 'Cebola', quantity: 5, unit: 'kg', notes: 'Para molhos' },
    ];
    
    setCurrentStockItems(mockCurrentStock);
    setWeeklyNeedItems(mockWeeklyNeed);
  }, []);

  // Abrir modal de Current Stock para edição
  const handleEditCurrentStock = (item: InventoryItem) => {
    setIsEditMode(true);
    setEditItemId(item.id);
    setCurrentStockForm({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      notes: item.notes || '',
    });
    setCurrentStockErrors({
      name: '',
      quantity: '',
      unit: '',
    });
    setOpenCurrentStockModal(true);
  };

  // Abrir modal de Weekly Need para edição
  const handleEditWeeklyNeed = (item: InventoryItem) => {
    setIsEditMode(true);
    setEditItemId(item.id);
    setWeeklyNeedForm({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      notes: item.notes || '',
    });
    setWeeklyNeedErrors({
      name: '',
      quantity: '',
      unit: '',
    });
    setOpenWeeklyNeedModal(true);
  };

  // Abrir modal de Current Stock para adicionar novo item
  const handleOpenCurrentStockModal = () => {
    setIsEditMode(false);
    setEditItemId(null);
    setOpenCurrentStockModal(true);
    setCurrentStockForm({
      name: '',
      quantity: 0,
      unit: 'kg',
      notes: '',
    });
    setCurrentStockErrors({
      name: '',
      quantity: '',
      unit: '',
    });
  };

  // Abrir modal de Weekly Need para adicionar novo item
  const handleOpenWeeklyNeedModal = () => {
    setIsEditMode(false);
    setEditItemId(null);
    setOpenWeeklyNeedModal(true);
    setWeeklyNeedForm({
      name: '',
      quantity: 0,
      unit: 'kg',
      notes: '',
    });
    setWeeklyNeedErrors({
      name: '',
      quantity: '',
      unit: '',
    });
  };

  // Fechar modal de Current Stock
  const handleCloseCurrentStockModal = () => {
    setOpenCurrentStockModal(false);
  };

  // Fechar modal de Weekly Need
  const handleCloseWeeklyNeedModal = () => {
    setOpenWeeklyNeedModal(false);
  };
  
  // Fechar alerta
  const handleCloseAlert = () => {
    setAlert({...alert, open: false});
  };

  // Validar formulário de Current Stock
  const validateCurrentStockForm = () => {
    const errors = {
      name: '',
      quantity: '',
      unit: '',
    };
    
    let isValid = true;
    
    if (!currentStockForm.name.trim()) {
      errors.name = t('campoObrigatorio');
      isValid = false;
    }
    
    if (currentStockForm.quantity <= 0) {
      errors.quantity = t('valorDeveSerPositivo');
      isValid = false;
    }
    
    if (!currentStockForm.unit) {
      errors.unit = t('campoObrigatorio');
      isValid = false;
    }
    
    setCurrentStockErrors(errors);
    return isValid;
  };

  // Validar formulário de Weekly Need
  const validateWeeklyNeedForm = () => {
    const errors = {
      name: '',
      quantity: '',
      unit: '',
    };
    
    let isValid = true;
    
    if (!weeklyNeedForm.name.trim()) {
      errors.name = t('campoObrigatorio');
      isValid = false;
    }
    
    if (weeklyNeedForm.quantity <= 0) {
      errors.quantity = t('valorDeveSerPositivo');
      isValid = false;
    }
    
    if (!weeklyNeedForm.unit) {
      errors.unit = t('campoObrigatorio');
      isValid = false;
    }
    
    setWeeklyNeedErrors(errors);
    return isValid;
  };

  // Salvar Current Stock (tanto para adição quanto edição)
  const handleSaveCurrentStock = async () => {
    if (!validateCurrentStockForm()) return;
    
    setIsSubmittingStock(true);
    
    try {
      let newItems = [...currentStockItems];
      
      if (isEditMode && editItemId) {
        // Editar item existente
        const itemIndex = newItems.findIndex(item => item.id === editItemId);
        if (itemIndex >= 0) {
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            quantity: currentStockForm.quantity,
            unit: currentStockForm.unit,
            notes: currentStockForm.notes
          };
        }
      } else {
        // Verificar se já existe um item com este nome
        const normalizedName = currentStockForm.name.trim().toLowerCase();
        const existingItemIndex = currentStockItems.findIndex(
          item => item.name.toLowerCase() === normalizedName
        );
        
        if (existingItemIndex >= 0) {
          // Atualizar item existente
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: currentStockForm.quantity,
            unit: currentStockForm.unit,
            notes: currentStockForm.notes
          };
        } else {
          // Adicionar novo item
          newItems.push({
            id: Date.now().toString(),
            name: currentStockForm.name.trim(),
            quantity: currentStockForm.quantity,
            unit: currentStockForm.unit,
            notes: currentStockForm.notes
          });
        }
      }
      
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentStockItems(newItems);
      
      setAlert({
        open: true,
        message: isEditMode 
          ? t('itemAtualizadoComSucesso') 
          : t('itemAdicionadoComSucesso'),
        severity: 'success'
      });
      
      handleCloseCurrentStockModal();
    } catch (error) {
      console.error("Erro ao salvar estoque atual:", error);
      setAlert({
        open: true,
        message: t('erroAoSalvarItem'),
        severity: 'error'
      });
    } finally {
      setIsSubmittingStock(false);
    }
  };

  // Salvar Weekly Need (tanto para adição quanto edição)
  const handleSaveWeeklyNeed = async () => {
    if (!validateWeeklyNeedForm()) return;
    
    setIsSubmittingNeed(true);
    
    try {
      let newItems = [...weeklyNeedItems];
      
      if (isEditMode && editItemId) {
        // Editar item existente
        const itemIndex = newItems.findIndex(item => item.id === editItemId);
        if (itemIndex >= 0) {
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            quantity: weeklyNeedForm.quantity,
            unit: weeklyNeedForm.unit,
            notes: weeklyNeedForm.notes
          };
        }
      } else {
        // Verificar se já existe um item com este nome
        const normalizedName = weeklyNeedForm.name.trim().toLowerCase();
        const existingItemIndex = weeklyNeedItems.findIndex(
          item => item.name.toLowerCase() === normalizedName
        );
        
        if (existingItemIndex >= 0) {
          // Atualizar item existente
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: weeklyNeedForm.quantity,
            unit: weeklyNeedForm.unit,
            notes: weeklyNeedForm.notes
          };
        } else {
          // Adicionar novo item
          newItems.push({
            id: Date.now().toString(),
            name: weeklyNeedForm.name.trim(),
            quantity: weeklyNeedForm.quantity,
            unit: weeklyNeedForm.unit,
            notes: weeklyNeedForm.notes
          });
        }
      }
      
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setWeeklyNeedItems(newItems);
      
      setAlert({
        open: true,
        message: isEditMode 
          ? t('itemAtualizadoComSucesso') 
          : t('itemAdicionadoComSucesso'),
        severity: 'success'
      });
      
      handleCloseWeeklyNeedModal();
    } catch (error) {
      console.error("Erro ao salvar necessidade semanal:", error);
      setAlert({
        open: true,
        message: t('erroAoSalvarItem'),
        severity: 'error'
      });
    } finally {
      setIsSubmittingNeed(false);
    }
  };
  
  // Calcular o relatório de compras
  const calculatePurchaseReport = (): PurchaseItem[] => {
    const purchaseItems: PurchaseItem[] = [];
    
    // Para cada item na lista de necessidade semanal
    weeklyNeedItems.forEach(weeklyItem => {
      // Encontrar o item correspondente no estoque atual (case insensitive)
      const currentItem = currentStockItems.find(
        item => item.name.toLowerCase() === weeklyItem.name.toLowerCase()
      );
      
      // Se encontrou ou se a quantidade necessária for maior que a em estoque
      if (currentItem) {
        const toBuy = Math.max(0, weeklyItem.quantity - currentItem.quantity);
        
        // Somente adicionar se precisar comprar
        if (toBuy > 0) {
          purchaseItems.push({
            name: weeklyItem.name,
            currentStock: currentItem.quantity,
            weeklyNeed: weeklyItem.quantity,
            toBuy,
            unit: weeklyItem.unit
          });
        }
      } else {
        // Se o item não existe no estoque atual, toda a quantidade é necessária
        purchaseItems.push({
          name: weeklyItem.name,
          currentStock: 0,
          weeklyNeed: weeklyItem.quantity,
          toBuy: weeklyItem.quantity,
          unit: weeklyItem.unit
        });
      }
    });
    
    return purchaseItems;
  };
  
  // Gerar relatório de compras
  const handleGeneratePurchaseReport = () => {
    const purchaseItems = calculatePurchaseReport();
    
    if (purchaseItems.length === 0) {
      setAlert({
        open: true,
        message: t('nenhumItemParaComprar'),
        severity: 'info'
      });
      return;
    }
    
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(18);
      doc.text(String(t('inventario_buyReport')), 105, 15, { align: 'center' });
      
      // Data
      doc.setFontSize(12);
      const dateFormatted = new Intl.DateTimeFormat(i18n.language, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }).format(new Date());
      doc.text(`${t('data')}: ${dateFormatted}`, 105, 25, { align: 'center' });
      
      // Cabeçalho da tabela e dados para jspdf-autotable
      const headers = [
        [
          t('nome'), 
          t('inventario_currentStock'), 
          t('inventario_weeklyNeed'), 
          t('inventario_toBuy'), 
          t('inventario_unit')
        ]
      ];
      
      const data = purchaseItems.map(item => [
        item.name,
        item.currentStock.toString(),
        item.weeklyNeed.toString(),
        item.toBuy.toString(),
        item.unit
      ]);
      
      // @ts-ignore - Adicionando autotable (extensão de jsPDF)
      doc.autoTable({
        head: headers,
        body: data,
        startY: 35,
        margin: { top: 30 },
        styles: { overflow: 'linebreak' },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      });
      
      // Salvar o PDF
      doc.save('relatorio-compras.pdf');
      
      setAlert({
        open: true,
        message: t('relatorioGeradoComSucesso'),
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setAlert({
        open: true,
        message: t('erroAoGerarRelatorio'),
        severity: 'error'
      });
    }
  };

  // Abrir modal de confirmação de exclusão
  const handleOpenDeleteModal = (item: InventoryItem, type: 'stock' | 'need') => {
    setDeleteItem({
      id: item.id,
      name: item.name,
      type: type
    });
    setOpenDeleteModal(true);
  };

  // Fechar modal de confirmação de exclusão
  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
    setDeleteItem(null);
  };

  // Excluir um item
  const handleDeleteItem = async () => {
    if (!deleteItem) return;

    try {
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));

      if (deleteItem.type === 'stock') {
        setCurrentStockItems(prev => prev.filter(item => item.id !== deleteItem.id));
      } else {
        setWeeklyNeedItems(prev => prev.filter(item => item.id !== deleteItem.id));
      }

      setAlert({
        open: true,
        message: t('itemExcluidoComSucesso'),
        severity: 'success'
      });

      handleCloseDeleteModal();
    } catch (error) {
      console.error("Erro ao excluir item:", error);
      setAlert({
        open: true,
        message: t('erroAoExcluirItem'),
        severity: 'error'
      });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">{t('inventario')}</Typography>
        
        <Button
          variant="contained"
          color="success"
          startIcon={<PdfIcon />}
          onClick={handleGeneratePurchaseReport}
          sx={{ mr: 1 }}
        >
          {t('inventario_buyReport')}
        </Button>
      </Box>
      
      {/* Botões Principais no estilo da página Financeiro */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Button
            component={Paper}
            onClick={handleOpenCurrentStockModal}
            fullWidth
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'success.dark',
              color: 'white',
              '&:hover': {
                backgroundColor: 'success.main',
              }
            }}
          >
            <AddIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">+ {t('inventario_currentStock')}</Typography>
          </Button>
        </Grid>

        <Grid item xs={12} md={6}>
          <Button
            component={Paper}
            onClick={handleOpenWeeklyNeedModal}
            fullWidth
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: 'warning.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'warning.dark',
              }
            }}
          >
            <AddIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6">+ {t('inventario_weeklyNeed')}</Typography>
          </Button>
        </Grid>
      </Grid>
      
      {/* Tabelas lado a lado */}
      <Grid container spacing={3}>
        {/* Current Stock */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>{t('inventario_currentStock')}</Typography>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('nome')}</TableCell>
                    <TableCell align="right">{t('quantidade')}</TableCell>
                    <TableCell align="right">{t('observacao')}</TableCell>
                    <TableCell align="right">{t('acoes')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentStockItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        {t('nenhumItemCadastrado')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentStockItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell align="right">
                          {item.notes ? (
                            <Tooltip title={item.notes}>
                              <IconButton size="small">
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : null}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Tooltip title={t('editar')}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditCurrentStock(item)}
                                color="primary"
                                sx={{ mr: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('excluir')}>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDeleteModal(item, 'stock')}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Weekly Need */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>{t('inventario_weeklyNeed')}</Typography>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('nome')}</TableCell>
                    <TableCell align="right">{t('quantidade')}</TableCell>
                    <TableCell align="right">{t('observacao')}</TableCell>
                    <TableCell align="right">{t('acoes')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weeklyNeedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        {t('nenhumItemCadastrado')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    weeklyNeedItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell align="right">
                          {item.quantity} {item.unit}
                        </TableCell>
                        <TableCell align="right">
                          {item.notes ? (
                            <Tooltip title={item.notes}>
                              <IconButton size="small">
                                <InfoIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : null}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Tooltip title={t('editar')}>
                              <IconButton
                                size="small"
                                onClick={() => handleEditWeeklyNeed(item)}
                                color="primary"
                                sx={{ mr: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('excluir')}>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenDeleteModal(item, 'need')}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Modal para Current Stock */}
      <Dialog 
        open={openCurrentStockModal} 
        onClose={handleCloseCurrentStockModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditMode 
            ? t('inventory.modals.editStockTitle') 
            : t('inventory.modals.stockTitle')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {isEditMode ? (
              <TextField
                label={t('nome')}
                fullWidth
                margin="normal"
                value={currentStockForm.name}
                disabled={true}
              />
            ) : (
              <Autocomplete
                freeSolo
                options={weeklyNeedItems.map((option) => option.name)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t('nome')}
                    fullWidth
                    margin="normal"
                    error={!!currentStockErrors.name}
                    helperText={currentStockErrors.name}
                    required
                  />
                )}
                value={currentStockForm.name}
                onChange={(_, newValue) => {
                  const selectedItem = weeklyNeedItems.find(item => item.name === newValue);
                  setCurrentStockForm({
                    ...currentStockForm,
                    name: newValue || '',
                    unit: selectedItem?.unit || currentStockForm.unit,
                    quantity: selectedItem?.quantity || currentStockForm.quantity,
                    notes: selectedItem?.notes || currentStockForm.notes,
                  });
                }}
                onInputChange={(_, newInputValue) => {
                  setCurrentStockForm({
                    ...currentStockForm,
                    name: newInputValue,
                  });
                }}
              />
            )}
            
            <TextField
              label={t('quantidade')}
              type="number"
              fullWidth
              margin="normal"
              value={currentStockForm.quantity}
              onChange={(e) => setCurrentStockForm({
                ...currentStockForm,
                quantity: Number(e.target.value),
              })}
              error={!!currentStockErrors.quantity}
              helperText={currentStockErrors.quantity}
              inputProps={{ min: 0, step: "0.01" }}
              required
            />
            
            <TextField
              select
              label={t('inventario_unit')}
              fullWidth
              margin="normal"
              value={currentStockForm.unit}
              onChange={(e) => setCurrentStockForm({
                ...currentStockForm,
                unit: e.target.value,
              })}
              error={!!currentStockErrors.unit}
              helperText={currentStockErrors.unit}
              required
            >
              {unitOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              label={t('observacao')}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={currentStockForm.notes}
              onChange={(e) => setCurrentStockForm({
                ...currentStockForm,
                notes: e.target.value,
              })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseCurrentStockModal} disabled={isSubmittingStock}>
            {t('cancelar')}
          </Button>
          <Button 
            onClick={handleSaveCurrentStock} 
            variant="contained"
            color="primary"
            disabled={isSubmittingStock}
          >
            {isSubmittingStock ? <CircularProgress size={24} /> : (
              isEditMode ? t('inventory.modals.saveChanges') : t('salvar')
            )}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal para Weekly Need */}
      <Dialog 
        open={openWeeklyNeedModal} 
        onClose={handleCloseWeeklyNeedModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {isEditMode 
            ? t('inventory.modals.editNeededTitle') 
            : t('inventory.modals.neededTitle')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {isEditMode ? (
              <TextField
                label={t('nome')}
                fullWidth
                margin="normal"
                value={weeklyNeedForm.name}
                disabled={true}
              />
            ) : (
              <TextField
                label={t('nome')}
                fullWidth
                margin="normal"
                value={weeklyNeedForm.name}
                onChange={(e) => setWeeklyNeedForm({
                  ...weeklyNeedForm,
                  name: e.target.value,
                })}
                error={!!weeklyNeedErrors.name}
                helperText={weeklyNeedErrors.name}
                required
              />
            )}
            
            <TextField
              label={t('quantidade')}
              type="number"
              fullWidth
              margin="normal"
              value={weeklyNeedForm.quantity}
              onChange={(e) => setWeeklyNeedForm({
                ...weeklyNeedForm,
                quantity: Number(e.target.value),
              })}
              error={!!weeklyNeedErrors.quantity}
              helperText={weeklyNeedErrors.quantity}
              inputProps={{ min: 0, step: "0.01" }}
              required
            />
            
            <TextField
              select
              label={t('inventario_unit')}
              fullWidth
              margin="normal"
              value={weeklyNeedForm.unit}
              onChange={(e) => setWeeklyNeedForm({
                ...weeklyNeedForm,
                unit: e.target.value,
              })}
              error={!!weeklyNeedErrors.unit}
              helperText={weeklyNeedErrors.unit}
              required
            >
              {unitOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              label={t('observacao')}
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={weeklyNeedForm.notes}
              onChange={(e) => setWeeklyNeedForm({
                ...weeklyNeedForm,
                notes: e.target.value,
              })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseWeeklyNeedModal} disabled={isSubmittingNeed}>
            {t('cancelar')}
          </Button>
          <Button 
            onClick={handleSaveWeeklyNeed} 
            variant="contained"
            color="primary"
            disabled={isSubmittingNeed}
          >
            {isSubmittingNeed ? <CircularProgress size={24} /> : (
              isEditMode ? t('inventory.modals.saveChanges') : t('salvar')
            )}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal de Confirmação de Exclusão */}
      <Dialog
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t('confirmarExclusao')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('confirmarExclusaoItem')}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 'bold' }}>
            {deleteItem?.name}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDeleteModal}
            color="primary"
          >
            {t('cancelar')}
          </Button>
          <Button
            onClick={handleDeleteItem}
            variant="contained"
            color="error"
          >
            {t('excluir')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Alerta/Toast */}
      <Snackbar
        open={alert.open}
        autoHideDuration={5000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Inventario;