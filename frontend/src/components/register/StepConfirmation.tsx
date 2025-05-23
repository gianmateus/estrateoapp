import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Grid, 
  Typography, 
  Paper, 
  Box, 
  Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// Interface para o tipo completo de dados do formulário
interface RegisterFormData {
  // Dados pessoais
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  
  // Dados do negócio
  businessName: string;
  businessId: string;
  businessAddress: string;
  businessType: string;
}

const StepConfirmation: React.FC = () => {
  // Hooks para tradução
  const { t } = useTranslation();
  
  // Form Context do React Hook Form para acessar os dados do formulário
  const { getValues } = useFormContext<RegisterFormData>();
  
  // Obter os valores atuais do formulário
  const formValues = getValues();
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          {t('confirmation')}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {t('reviewInformation')}
        </Typography>
      </Grid>
      
      {/* Dados Pessoais */}
      <Grid item xs={12}>
        <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {t('personalInformation')}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">
                {t('fullName')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body1">
                {formValues.fullName}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">
                {t('email')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body1">
                {formValues.email}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">
                {t('phone')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body1">
                {formValues.phoneNumber}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      {/* Dados do Negócio */}
      <Grid item xs={12}>
        <Paper elevation={0} variant="outlined" sx={{ p: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            {t('businessInformation')}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">
                {t('businessName')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body1">
                {formValues.businessName}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">
                {t('businessId')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body1">
                {formValues.businessId}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">
                {t('businessType')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body1">
                {formValues.businessType}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="textSecondary">
                {t('businessAddress')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body1" style={{ whiteSpace: 'pre-line' }}>
                {formValues.businessAddress}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      
      {/* Nota de privacidade */}
      <Grid item xs={12}>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            {t('termsConditionsAgreement')}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default StepConfirmation; 