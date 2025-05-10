import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Tooltip, 
  Skeleton,
  Collapse,
  IconButton,
  Divider,
  Paper,
  useTheme
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { useTranslation } from 'react-i18next';

interface TaxCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  tooltip?: string;
  loading?: boolean;
  description?: string;
  details?: string[];
  baseValue?: number;
  taxRate?: number;
}

const TaxCard: React.FC<TaxCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  tooltip = '', 
  loading = false,
  description = '',
  details = [],
  baseValue,
  taxRate
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <Card 
        sx={{ 
          height: '100%',
          boxShadow: 3,
          borderTop: `4px solid ${theme.palette[color].main}`,
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 6
          }
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" mb={1}>
            <Box 
              sx={{ 
                mr: 1, 
                color: theme.palette[color].main,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {icon}
            </Box>
            <Tooltip title={tooltip} arrow placement="top">
              <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
                {title}
                {tooltip && (
                  <InfoIcon fontSize="small" sx={{ ml: 0.5, opacity: 0.6, width: 16, height: 16 }} />
                )}
              </Typography>
            </Tooltip>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton 
              size="small" 
              onClick={toggleExpand}
              sx={{ 
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s'
              }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
          
          {loading ? (
            <Skeleton variant="text" width="80%" height={40} animation="wave" />
          ) : (
            <Typography 
              variant="h4" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: value < 0 ? theme.palette.error.main : 'inherit'
              }}
            >
              {formatCurrency(value)}
            </Typography>
          )}

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box mt={2}>
              <Divider sx={{ mb: 2 }} />
              
              {description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  {description}
                </Typography>
              )}
              
              {taxRate && baseValue && (
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 1.5, 
                    mb: 1.5, 
                    bgcolor: theme.palette.background.default
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>{t('taxes.calculation', 'Cálculo')}:</strong>
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{t('taxes.taxableBase', 'Base de cálculo')}:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(baseValue)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">{t('taxes.taxRate', 'Taxa aplicada')}:</Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatPercent(taxRate)}
                    </Typography>
                  </Box>
                </Paper>
              )}
              
              {details.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  {details.map((detail, index) => (
                    <Typography 
                      key={index} 
                      variant="body2" 
                      sx={{ 
                        mb: 0.5, 
                        display: 'flex', 
                        alignItems: 'center'
                      }}
                    >
                      <Box 
                        component="span" 
                        sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: theme.palette[color].main,
                          display: 'inline-block',
                          mr: 1
                        }} 
                      />
                      {detail}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaxCard; 