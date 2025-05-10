/**
 * TaxDatePicker - Seletor de período fiscal
 * 
 * Permite navegar e selecionar períodos fiscais (mês/ano)
 * Fornece controles de navegação e visualização do período atual
 */
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Tooltip, 
  CircularProgress, 
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  KeyboardArrowLeft as PrevIcon,
  KeyboardArrowRight as NextIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { 
  format, 
  parse, 
  subMonths, 
  addMonths, 
  isValid 
} from 'date-fns';
import { pt } from 'date-fns/locale';

// Interface para as propriedades do componente
interface TaxDatePickerProps {
  value: string;               // Valor atual no formato 'YYYY-MM'
  onChange: (date: string) => void;  // Função chamada ao alterar o período
  onRefresh?: () => void;      // Função para atualizar dados (opcional)
  isLoading?: boolean;         // Indicador de carregamento
  minDate?: string;            // Data mínima permitida (YYYY-MM)
  maxDate?: string;            // Data máxima permitida (YYYY-MM)
}

/**
 * Componente para seleção de período fiscal
 * Exibe mês/ano atual e permite navegação entre períodos
 */
const TaxDatePicker: React.FC<TaxDatePickerProps> = ({
  value,
  onChange,
  onRefresh,
  isLoading = false,
  minDate,
  maxDate
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Estado para o menu de seleção de ano
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  
  // Converter valor para Date
  const valueAsDate = parse(value, 'yyyy-MM', new Date());
  
  // Construir lista de anos
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => currentYear - 2 + i);
    setAvailableYears(years);
  }, []);
  
  // Verificar se a navegação está desabilitada
  const isDisabledPrev = () => {
    if (!minDate) return false;
    
    try {
      const minAsDate = parse(minDate, 'yyyy-MM', new Date());
      return valueAsDate <= minAsDate;
    } catch (e) {
      return false;
    }
  };
  
  const isDisabledNext = () => {
    if (!maxDate) return false;
    
    try {
      const maxAsDate = parse(maxDate, 'yyyy-MM', new Date());
      return valueAsDate >= maxAsDate;
    } catch (e) {
      return false;
    }
  };
  
  // Navegação para mês anterior
  const handlePrevMonth = () => {
    if (isDisabledPrev()) return;
    
    const newDate = subMonths(valueAsDate, 1);
    onChange(format(newDate, 'yyyy-MM'));
  };
  
  // Navegação para próximo mês
  const handleNextMonth = () => {
    if (isDisabledNext()) return;
    
    const newDate = addMonths(valueAsDate, 1);
    onChange(format(newDate, 'yyyy-MM'));
  };
  
  // Abrir menu de seleção de ano
  const handleOpenYearMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Fechar menu de seleção de ano
  const handleCloseYearMenu = () => {
    setAnchorEl(null);
  };
  
  // Selecionar ano
  const handleSelectYear = (year: number) => {
    const newDate = new Date(valueAsDate);
    newDate.setFullYear(year);
    
    if (isValid(newDate)) {
      onChange(format(newDate, 'yyyy-MM'));
    }
    
    handleCloseYearMenu();
  };
  
  // Formatar para exibição
  const formattedDate = format(valueAsDate, 'MMMM yyyy', { locale: pt });
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        p: 0.5,
        bgcolor: 'background.paper',
        boxShadow: 1
      }}
    >
      {/* Botão Mês Anterior */}
      <Tooltip title="Mês anterior">
        <IconButton
          size="small"
          onClick={handlePrevMonth}
          disabled={isLoading || isDisabledPrev()}
        >
          <PrevIcon />
        </IconButton>
      </Tooltip>
      
      {/* Exibição do Período */}
      <Button
        onClick={handleOpenYearMenu}
        size="small"
        endIcon={<ExpandMoreIcon />}
        sx={{ 
          mx: 1,
          textTransform: 'capitalize',
          minWidth: isMobile ? 120 : 150,
          justifyContent: 'space-between'
        }}
      >
        <Typography 
          variant="subtitle2" 
          component="span" 
          sx={{ 
            fontWeight: 'medium',
            textTransform: 'capitalize'
          }}
        >
          {formattedDate}
        </Typography>
      </Button>
      
      {/* Menu de seleção de ano */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseYearMenu}
      >
        {availableYears.map(year => (
          <MenuItem 
            key={year} 
            onClick={() => handleSelectYear(year)}
            selected={valueAsDate.getFullYear() === year}
          >
            {year}
          </MenuItem>
        ))}
      </Menu>
      
      {/* Botão Próximo Mês */}
      <Tooltip title="Próximo mês">
        <IconButton
          size="small"
          onClick={handleNextMonth}
          disabled={isLoading || isDisabledNext()}
        >
          <NextIcon />
        </IconButton>
      </Tooltip>
      
      {/* Botão Atualizar (opcional) */}
      {onRefresh && (
        <Tooltip title="Atualizar dados">
          <IconButton
            size="small"
            onClick={onRefresh}
            disabled={isLoading}
            sx={{ ml: 0.5 }}
          >
            {isLoading ? (
              <CircularProgress size={18} thickness={5} />
            ) : (
              <RefreshIcon />
            )}
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default TaxDatePicker; 