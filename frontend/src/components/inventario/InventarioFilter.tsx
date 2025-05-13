import React, { useState, useEffect, ReactNode } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Divider,
  InputAdornment,
  Switch,
  FormControlLabel,
  IconButton,
  Collapse,
  Chip,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface FilterValues {
  nome?: string;
  codigoEAN?: string;
  fornecedor?: string;
  categoria?: string;
  estoqueMinimo?: boolean;
  validade?: string; // 7, 15, 30, 60, 90 dias
  precoMin?: number;
  precoMax?: number;
}

interface InventarioFilterProps {
  onFilter: (filters: FilterValues) => void;
  categorias: string[];
  activeFilters: FilterValues;
  totalItems: number;
}

const InventarioFilter: React.FC<InventarioFilterProps> = ({
  onFilter,
  categorias,
  activeFilters,
  totalItems
}) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<FilterValues>(activeFilters || {});
  const [expanded, setExpanded] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Opções de validade
  const validadeOptions = [
    { value: '7', label: t('7 dias') },
    { value: '15', label: t('15 dias') },
    { value: '30', label: t('30 dias') },
    { value: '60', label: t('60 dias') },
    { value: '90', label: t('90 dias') }
  ];

  // Contar filtros ativos
  useEffect(() => {
    const count = Object.entries(filters).reduce((acc, [key, value]) => {
      if (key === 'estoqueMinimo' && value) return acc + 1;
      if (value !== undefined && value !== '' && value !== null) return acc + 1;
      return acc;
    }, 0);
    setActiveFilterCount(count);
  }, [filters]);

  // Manipulador para alteração de filtros
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFilters({
        ...filters,
        [name]: value
      });
    }
  };

  // Manipulador específico para selects
  const handleSelectChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
    const { name, value } = event.target;
    if (name) {
      setFilters({
        ...filters,
        [name]: value
      });
    }
  };

  // Manipulador para alteração do switch de estoque mínimo
  const handleEstoqueMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      estoqueMinimo: e.target.checked
    });
  };

  // Manipulador para aplicar filtros
  const handleApplyFilters = () => {
    onFilter(filters);
  };

  // Manipulador para limpar filtros
  const handleClearFilters = () => {
    const emptyFilters: FilterValues = {};
    setFilters(emptyFilters);
    onFilter(emptyFilters);
  };

  // Expansão do painel de filtros
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper
      elevation={1}
      sx={{ 
        p: 2, 
        mb: 3,
        borderRadius: 2
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            {t('Filtros')}
            {activeFilterCount > 0 && (
              <Chip
                label={activeFilterCount}
                color="primary"
                size="small"
                sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
              />
            )}
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="body2" color="text.secondary">
            {t('Total de itens')}: {totalItems}
          </Typography>
          <IconButton 
            size="small" 
            onClick={toggleExpanded}
            aria-expanded={expanded}
            aria-label="toggle filters"
          >
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Barra de pesquisa sempre visível */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            name="nome"
            label={t('Pesquisar por nome')}
            variant="outlined"
            size="small"
            value={filters.nome || ''}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: filters.nome ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="clear search"
                    onClick={() => 
                      setFilters({ ...filters, nome: '' })
                    }
                    edge="end"
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel>{t('Categoria')}</InputLabel>
            <Select
              name="categoria"
              value={filters.categoria || ''}
              onChange={handleSelectChange}
              label={t('Categoria')}
            >
              <MenuItem value="">{t('Todas')}</MenuItem>
              {categorias.map((categoria) => (
                <MenuItem key={categoria} value={categoria}>
                  {categoria}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <FormControlLabel
            control={
              <Switch
                checked={!!filters.estoqueMinimo}
                onChange={handleEstoqueMinChange}
                color="primary"
              />
            }
            label={t('Apenas itens abaixo do estoque mínimo')}
            sx={{ 
              '& .MuiFormControlLabel-label': { 
                fontSize: '0.875rem' 
              } 
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={2}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearFilters}
              size="small"
              sx={{ mr: 1 }}
              disabled={activeFilterCount === 0}
            >
              {t('Limpar')}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleApplyFilters}
              size="small"
            >
              {t('Filtrar')}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Filtros avançados expansíveis */}
      <Collapse in={expanded}>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
          {t('Filtros avançados')}
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="codigoEAN"
              label={t('Código EAN')}
              variant="outlined"
              size="small"
              value={filters.codigoEAN || ''}
              onChange={handleFilterChange}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              name="fornecedor"
              label={t('Fornecedor')}
              variant="outlined"
              size="small"
              value={filters.fornecedor || ''}
              onChange={handleFilterChange}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>{t('Validade próxima')}</InputLabel>
              <Select
                name="validade"
                value={filters.validade || ''}
                onChange={handleSelectChange}
                label={t('Validade próxima')}
              >
                <MenuItem value="">{t('Qualquer')}</MenuItem>
                {validadeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="precoMin"
                  label={t('Preço mínimo')}
                  variant="outlined"
                  size="small"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    )
                  }}
                  value={filters.precoMin || ''}
                  onChange={handleFilterChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  name="precoMax"
                  label={t('Preço máximo')}
                  variant="outlined"
                  size="small"
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">€</InputAdornment>
                    )
                  }}
                  value={filters.precoMax || ''}
                  onChange={handleFilterChange}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default InventarioFilter; 