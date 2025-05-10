import React, { useState } from 'react';
import { 
  Drawer, 
  Typography, 
  Box, 
  Divider, 
  IconButton, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  Paper,
  Button,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  Receipt as ReceiptIcon,
  Info as InfoIcon,
  AttachMoney as MoneyIcon,
  DateRange as DateIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';
import { formatCurrency } from '../../../utils/formatters';

// Interface para a previsão de impostos
export interface TaxForecast {
  vatDue: number;
  tradeTaxDue: number;
  corpTaxDue: number;
  soliDue: number;
  payrollTaxDue: number;
}

interface TaxDetailsDrawerProps {
  forecast: TaxForecast | null;
  open: boolean;
  onClose: () => void;
  month?: string;
}

const TaxDetailsDrawer: React.FC<TaxDetailsDrawerProps> = ({ 
  forecast, 
  open, 
  onClose,
  month
}) => {
  const theme = useTheme();

  if (!forecast) {
    return null;
  }

  // Calcular o total dos impostos
  const totalTax = forecast.vatDue + 
                  forecast.tradeTaxDue + 
                  forecast.corpTaxDue + 
                  forecast.soliDue + 
                  forecast.payrollTaxDue;

  // Data de vencimentos simulados
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 15); // 15 dias a partir de hoje

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 }, p: 3 }
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight="bold">
          Detalhes dos Impostos
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {month && (
        <Box mb={3} display="flex" alignItems="center">
          <DateIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography>
            Período: <strong>{month}</strong>
          </Typography>
        </Box>
      )}

      <Paper elevation={2} sx={{ p: 2, mb: 3, bgcolor: theme.palette.background.default }}>
        <Typography variant="h6" gutterBottom>
          Total a pagar
        </Typography>
        <Typography variant="h4" fontWeight="bold" color="primary">
          {formatCurrency(totalTax)}
        </Typography>
      </Paper>

      <List>
        <ListItem sx={{ py: 1.5 }}>
          <ListItemIcon>
            <ReceiptIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="IVA (USt)" 
            secondary="Imposto sobre Valor Agregado" 
          />
          <Typography variant="body1" fontWeight="medium">
            {formatCurrency(forecast.vatDue)}
          </Typography>
        </ListItem>

        <ListItem sx={{ py: 1.5 }}>
          <ListItemIcon>
            <InfoIcon color="secondary" />
          </ListItemIcon>
          <ListItemText 
            primary="Gewerbesteuer" 
            secondary="Imposto Comercial" 
          />
          <Typography variant="body1" fontWeight="medium">
            {formatCurrency(forecast.tradeTaxDue)}
          </Typography>
        </ListItem>

        <ListItem sx={{ py: 1.5 }}>
          <ListItemIcon>
            <CalculateIcon color="success" />
          </ListItemIcon>
          <ListItemText 
            primary="Körperschaftsteuer" 
            secondary="Imposto Corporativo" 
          />
          <Typography variant="body1" fontWeight="medium">
            {formatCurrency(forecast.corpTaxDue)}
          </Typography>
        </ListItem>

        <ListItem sx={{ py: 1.5 }}>
          <ListItemIcon>
            <MoneyIcon color="info" />
          </ListItemIcon>
          <ListItemText 
            primary="Solidaritätszuschlag" 
            secondary="Taxa de Solidariedade" 
          />
          <Typography variant="body1" fontWeight="medium">
            {formatCurrency(forecast.soliDue)}
          </Typography>
        </ListItem>

        <ListItem sx={{ py: 1.5 }}>
          <ListItemIcon>
            <MoneyIcon color="warning" />
          </ListItemIcon>
          <ListItemText 
            primary="Lohnsteuer & Sozialabgaben" 
            secondary="Imposto de Renda e Contribuições Sociais" 
          />
          <Typography variant="body1" fontWeight="medium">
            {formatCurrency(forecast.payrollTaxDue)}
          </Typography>
        </ListItem>
      </List>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Próximo vencimento: {dueDate.toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Os valores apresentados são uma previsão baseada nos dados financeiros atuais.
          Consulte seu contador para valores definitivos.
        </Typography>
      </Box>

      <Box mt={3}>
        <Button 
          variant="outlined" 
          fullWidth 
          onClick={onClose}
        >
          Fechar
        </Button>
      </Box>
    </Drawer>
  );
};

export default TaxDetailsDrawer; 