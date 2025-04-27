import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Divider, 
  Skeleton,
  CardHeader,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip
} from '@mui/material';
import { 
  Event as EventIcon,
  Info as InfoIcon,
  Payment as PaymentIcon,
  MoneyOff as ExpenseIcon,
  AttachMoney as IncomeIcon,
  BeachAccess as VacationIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';

interface Evento {
  id: string;
  titulo: string;
  data: string;
  tipo: 'pagamento' | 'entrada' | 'ferias' | 'evento';
}

interface CalendarEventsSummaryProps {
  isLoading: boolean;
  eventos: Evento[];
}

const CalendarEventsSummary: React.FC<CalendarEventsSummaryProps> = ({
  isLoading,
  eventos
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const handleNavigateToCalendar = () => {
    navigate('/dashboard/calendario');
  };
  
  // Função para retornar o ícone apropriado de acordo com o tipo
  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case 'pagamento':
        return <ExpenseIcon color="error" fontSize="small" />;
      case 'entrada':
        return <IncomeIcon color="success" fontSize="small" />;
      case 'ferias':
        return <VacationIcon color="info" fontSize="small" />;
      default:
        return <EventIcon color="primary" fontSize="small" />;
    }
  };
  
  // Função para retornar a cor do chip de acordo com o tipo
  const getEventColor = (tipo: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (tipo) {
      case 'pagamento':
        return 'error';
      case 'entrada':
        return 'success';
      case 'ferias':
        return 'info';
      default:
        return 'primary';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderTop: '4px solid',
        borderColor: 'warning.main' 
      }}
      elevation={2}
    >
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EventIcon sx={{ mr: 1, color: 'warning.main' }} />
            <Typography variant="h6" component="div">
              {t('eventosCalendario')}
            </Typography>
          </Box>
        }
        action={
          <Tooltip title={t('calendarioInfo')}>
            <IconButton size="small">
              <InfoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        }
      />
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {t('proximosEventos')}
        </Typography>
        
        {isLoading ? (
          <Box sx={{ mt: 2 }}>
            <Skeleton variant="rectangular" height={50} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={50} sx={{ mb: 1 }} />
            <Skeleton variant="rectangular" height={50} />
          </Box>
        ) : (
          <List disablePadding>
            {eventos.length === 0 ? (
              <Box sx={{ py: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('nenhumEventoProximo')}
                </Typography>
              </Box>
            ) : (
              eventos.map((evento) => (
                <React.Fragment key={evento.id}>
                  <ListItem 
                    disablePadding 
                    sx={{ 
                      py: 1.5,
                      px: 1,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      },
                      cursor: 'pointer'
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {getEventIcon(evento.tipo)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" noWrap>
                          {evento.titulo}
                        </Typography>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Typography 
                            variant="caption" 
                            color="text.secondary"
                            component="span"
                            sx={{ mr: 1 }}
                          >
                            {formatDate(new Date(evento.data))}
                          </Typography>
                          <Chip 
                            label={t(evento.tipo)} 
                            size="small" 
                            color={getEventColor(evento.tipo)}
                            sx={{ 
                              height: 20, 
                              fontSize: '0.6rem', 
                              '& .MuiChip-label': { 
                                px: 0.8 
                              } 
                            }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  <Divider variant="fullWidth" component="li" />
                </React.Fragment>
              ))
            )}
          </List>
        )}
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0, mt: 'auto' }}>
        <Button 
          variant="text" 
          color="warning" 
          fullWidth 
          onClick={handleNavigateToCalendar}
          endIcon={<ArrowIcon />}
          size="small"
        >
          {t('verCalendarioCompleto')}
        </Button>
      </Box>
    </Card>
  );
};

export default CalendarEventsSummary; 