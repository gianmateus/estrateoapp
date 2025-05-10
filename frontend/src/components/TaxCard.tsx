import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useTheme,
  Skeleton,
} from '@mui/material';
import { 
  Euro as EuroIcon,
  AccountBalance as AccountBalanceIcon,
  Business as BusinessIcon,
  PeopleAlt as PeopleAltIcon
} from '@mui/icons-material';

interface TaxCardProps {
  title: string;
  value: number | undefined;
  icon: 'vat' | 'trade' | 'corp' | 'payroll';
  isLoading?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

const TaxCard: React.FC<TaxCardProps> = ({ 
  title, 
  value, 
  icon, 
  isLoading = false,
  color
}) => {
  const theme = useTheme();
  
  // Função para formatar valor monetário
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(value);
  };
  
  // Determinar ícone com base no tipo de imposto
  const getIcon = () => {
    switch (icon) {
      case 'vat':
        return <EuroIcon sx={{ fontSize: 42, opacity: 0.8, color: theme.palette.primary.main }} />;
      case 'trade':
        return <BusinessIcon sx={{ fontSize: 42, opacity: 0.8, color: theme.palette.grey[700] }} />;
      case 'corp':
        return <AccountBalanceIcon sx={{ fontSize: 42, opacity: 0.8, color: theme.palette.success.main }} />;
      case 'payroll':
        return <PeopleAltIcon sx={{ fontSize: 42, opacity: 0.8, color: theme.palette.warning.main }} />;
      default:
        return <EuroIcon sx={{ fontSize: 42, opacity: 0.8, color: theme.palette.primary.main }} />;
    }
  };
  
  // Determinar cor com base no tipo de imposto ou na prop fornecida
  const getColor = () => {
    if (color) {
      return theme.palette[color].main;
    }
    
    switch (icon) {
      case 'vat':
        return theme.palette.primary.main;
      case 'trade':
        return theme.palette.grey[700];
      case 'corp':
        return theme.palette.success.main;
      case 'payroll':
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        minHeight: '140px',
        boxShadow: 3,
        borderRadius: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6
        },
        borderTop: `4px solid ${getColor()}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 0,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ mr: 2 }}>
            {getIcon()}
          </Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
        </Box>
        
        {isLoading ? (
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height={40} 
            animation="wave" 
            data-testid="skeleton"
          />
        ) : (
          <Typography 
            variant="h4" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              color: getColor(),
              textAlign: 'right',
              mt: 2
            }}
          >
            {value !== undefined && value > 0 ? formatCurrency(value) : '—'}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default TaxCard; 