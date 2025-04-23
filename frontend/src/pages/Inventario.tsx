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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

// Interface para os itens do inventário
interface InventoryItem {
  id: string;
  name: string;
  unit: string;
  notes?: string;
}

// Unidades disponíveis
const unitOptions = [
  { value: 'kg', label: 'Quilograma (kg)' },
  { value: 'caixa', label: 'Caixa' },
  { value: 'unidade', label: 'Unidade' },
];

const Inventario = () => {
  const { t } = useTranslation();
  
  // Estado para os itens do inventário
  const [weeklyNeedItems, setWeeklyNeedItems] = useState<InventoryItem[]>([]);
  
  // Estados para controlar os modais
  const [openCurrentStockModal, setOpenCurrentStockModal] = useState(false);
  const [openWeeklyNeedModal, setOpenWeeklyNeedModal] = useState(false);
  
  // Estados para os formulários
  const [currentStockForm, setCurrentStockForm] = useState({
    name: '',
    unit: 'kg',
    notes: '',
  });
  
  const [weeklyNeedForm, setWeeklyNeedForm] = useState({
    name: '',
    unit: 'kg',
    notes: '',
  });

  // Validação de formulários
  const [currentStockErrors, setCurrentStockErrors] = useState({
    name: '',
    unit: '',
  });

  const [weeklyNeedErrors, setWeeklyNeedErrors] = useState({
    name: '',
    unit: '',
  });

  // Abrir modal de Current Stock
  const handleOpenCurrentStockModal = () => {
    setOpenCurrentStockModal(true);
    setCurrentStockForm({
      name: '',
      unit: 'kg',
      notes: '',
    });
    setCurrentStockErrors({
      name: '',
      unit: '',
    });
  };

  // Abrir modal de Weekly Need
  const handleOpenWeeklyNeedModal = () => {
    setOpenWeeklyNeedModal(true);
    setWeeklyNeedForm({
      name: '',
      unit: 'kg',
      notes: '',
    });
    setWeeklyNeedErrors({
      name: '',
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

  // Validar formulário de Current Stock
  const validateCurrentStockForm = () => {
    const errors = {
      name: '',
      unit: '',
    };
    
    let isValid = true;
    
    if (!currentStockForm.name.trim()) {
      errors.name = 'Nome é obrigatório';
      isValid = false;
    }
    
    if (!currentStockForm.unit) {
      errors.unit = 'Unidade é obrigatória';
      isValid = false;
    }
    
    setCurrentStockErrors(errors);
    return isValid;
  };

  // Validar formulário de Weekly Need
  const validateWeeklyNeedForm = () => {
    const errors = {
      name: '',
      unit: '',
    };
    
    let isValid = true;
    
    if (!weeklyNeedForm.name.trim()) {
      errors.name = 'Nome é obrigatório';
      isValid = false;
    }
    
    if (!weeklyNeedForm.unit) {
      errors.unit = 'Unidade é obrigatória';
      isValid = false;
    }
    
    setWeeklyNeedErrors(errors);
    return isValid;
  };

  // Salvar Current Stock
  const handleSaveCurrentStock = () => {
    if (!validateCurrentStockForm()) return;
    
    // Aqui poderia ter a lógica para salvar no servidor
    console.log('Salvando Current Stock:', currentStockForm);
    
    handleCloseCurrentStockModal();
  };

  // Salvar Weekly Need
  const handleSaveWeeklyNeed = () => {
    if (!validateWeeklyNeedForm()) return;
    
    // Gerar um ID único para o novo item
    const newItem: InventoryItem = {
      id: Date.now().toString(),
      name: weeklyNeedForm.name,
      unit: weeklyNeedForm.unit,
      notes: weeklyNeedForm.notes,
    };
    
    // Adicionar o novo item à lista
    setWeeklyNeedItems([...weeklyNeedItems, newItem]);
    
    // Aqui poderia ter a lógica para salvar no servidor
    console.log('Salvando Weekly Need:', weeklyNeedForm);
    
    handleCloseWeeklyNeedModal();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{t('inventario')}</Typography>
      
      {/* Botões Principais */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 4, 
          my: 4,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleOpenCurrentStockModal}
          sx={{ 
            width: 220, 
            height: 56,
            borderRadius: 2,
            fontSize: '1rem',
          }}
        >
          + Current Stock
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          onClick={handleOpenWeeklyNeedModal}
          sx={{ 
            width: 220, 
            height: 56,
            borderRadius: 2,
            fontSize: '1rem',
          }}
        >
          + Weekly Need
        </Button>
      </Box>
      
      {/* Modal para Current Stock */}
      <Dialog 
        open={openCurrentStockModal} 
        onClose={handleCloseCurrentStockModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Adicionar Current Stock</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Autocomplete
              freeSolo
              options={weeklyNeedItems.map((option) => option.name)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nome do produto"
                  fullWidth
                  margin="normal"
                  error={!!currentStockErrors.name}
                  helperText={currentStockErrors.name}
                  required
                />
              )}
              value={currentStockForm.name}
              onChange={(_, newValue) => {
                setCurrentStockForm({
                  ...currentStockForm,
                  name: newValue || '',
                  unit: weeklyNeedItems.find(item => item.name === newValue)?.unit || currentStockForm.unit,
                  notes: weeklyNeedItems.find(item => item.name === newValue)?.notes || currentStockForm.notes,
                });
              }}
              onInputChange={(_, newInputValue) => {
                setCurrentStockForm({
                  ...currentStockForm,
                  name: newInputValue,
                });
              }}
            />
            
            <TextField
              select
              label="Unidade"
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
              label="Observações"
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
          <Button onClick={handleCloseCurrentStockModal}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveCurrentStock} 
            variant="contained"
            color="primary"
          >
            Salvar
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
        <DialogTitle>Adicionar Weekly Need</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Nome do produto"
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
            
            <TextField
              select
              label="Unidade"
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
              label="Observações"
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
          <Button onClick={handleCloseWeeklyNeedModal}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveWeeklyNeed} 
            variant="contained"
            color="primary"
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventario;