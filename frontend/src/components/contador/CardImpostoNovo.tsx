/**
 * CardImpostoNovo - Componente avançado para exibição de valores de impostos
 * 
 * Exibe um card com informações de impostos, incluindo valor, status e data de vencimento
 * Adiciona interatividade e feedback visual de acordo com o status
 */
import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  IconButton, 
  Divider,
  CardActionArea
} from '@mui/material';
import { TaxStatus } from '../../types/tax';
import TaxStatusBadge from './TaxStatusBadge';
import { format, isValid } from 'date-fns';
import { pt } from 'date-fns/locale';
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material';

// Propriedades do componente
interface CardImpostoNovoProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'neutral';
  status: TaxStatus;
  dueDate: Date | string;
  description?: string;
  onClick?: () => void;
}

/**
 * Componente de card para impostos com status e interação
 */
const CardImpostoNovo: React.FC<CardImpostoNovoProps> = ({
  title,
  value,
  icon,
  color,
  status,
  dueDate,
  description,
  onClick
}) => {
  // Formatar valor monetário
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  // Formatar data de vencimento
  const formatDueDate = (date: Date | string) => {
    if (!date) return '';
    
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (!isValid(dateObj)) return '';
    
    return format(dateObj, 'dd/MM/yyyy', { locale: pt });
  };
  
  // Definir cores de acordo com o tipo do imposto
  const getMainColor = () => {
    switch (color) {
      case 'primary':
        return 'primary.main';
      case 'secondary':
        return 'secondary.main';
      case 'success':
        return 'success.main';
      case 'error':
        return 'error.main';
      case 'info':
        return 'info.main';
      case 'warning':
        return 'warning.main';
      case 'neutral':
        return 'grey.700';
      default:
        return 'primary.main';
    }
  };
  
  // Determinar cores de fundo sutis com base na cor principal
  const getLightColor = () => {
    switch (color) {
      case 'primary':
        return 'primary.lighter';
      case 'secondary':
        return 'secondary.lighter';
      case 'success':
        return 'success.lighter';
      case 'error':
        return 'error.lighter';
      case 'info':
        return 'info.lighter';
      case 'warning':
        return 'warning.lighter';
      case 'neutral':
        return 'grey.100';
      default:
        return 'primary.lighter';
    }
  };
  
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: onClick ? 'translateY(-4px)' : 'none',
          boxShadow: onClick ? 4 : 1
        }
      }}
    >
      {/* Área clicável quando onClick é fornecido */}
      <CardActionArea 
        disabled={!onClick} 
        onClick={onClick}
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          '.MuiCardActionArea-focusHighlight': {
            opacity: 0.05
          }
        }}
      >
        <CardContent sx={{ p: 2, flexGrow: 1 }}>
          {/* Cabeçalho com título e ícone */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2 
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center' 
            }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  bgcolor: getLightColor(),
                  color: getMainColor(),
                  mr: 1.5
                }}
              >
                {icon}
              </Box>
              <Typography variant="h6" fontWeight="medium" noWrap>
                {title}
              </Typography>
            </Box>
            
            {/* Badge de status */}
            <TaxStatusBadge status={status} />
          </Box>
          
          {/* Valor principal */}
          <Typography 
            variant="h4" 
            color="text.primary" 
            sx={{ 
              fontWeight: 'bold',
              mb: 1
            }}
          >
            {formatCurrency(value)}
          </Typography>
          
          {/* Descrição (opcional) */}
          {description && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {description}
            </Typography>
          )}
          
          <Divider sx={{ mt: 'auto', mb: 1 }} />
          
          {/* Data de vencimento */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between'
          }}>
            <Typography 
              variant="body2" 
              color="text.secondary"
            >
              Vencimento: {formatDueDate(dueDate)}
            </Typography>
            
            {onClick && (
              <IconButton 
                size="small"
                color={color === 'neutral' ? 'default' : color}
                edge="end"
                aria-label="detalhar"
              >
                <NavigateNextIcon />
              </IconButton>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CardImpostoNovo; 