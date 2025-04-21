import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Grid, 
  TextField, 
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// Interface para os dados do formulário
interface BusinessInfoFormData {
  businessName: string;
  businessId: string;
  businessAddress: string;
  businessType: string;
}

const StepBusinessInfo: React.FC = () => {
  // Hooks para tradução
  const { t } = useTranslation();
  
  // Form Context do React Hook Form
  const { register, formState: { errors } } = useFormContext<BusinessInfoFormData>();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          {t('Business Information')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {t('Please provide your business information')}
        </Typography>
      </Grid>
      
      {/* Nome do Negócio */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t('Business Name')}
          variant="outlined"
          {...register('businessName', { 
            required: t('Business name is required') as string
          })}
          error={!!errors.businessName}
          helperText={errors.businessName?.message}
        />
      </Grid>
      
      {/* ID do Negócio (como Tax ID ou similar) */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t('Business ID')}
          variant="outlined"
          placeholder="e.g. VAT number, Tax ID"
          {...register('businessId', { 
            required: t('Business ID is required') as string
          })}
          error={!!errors.businessId}
          helperText={errors.businessId?.message}
        />
      </Grid>
      
      {/* Endereço do Negócio */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t('Business Address')}
          variant="outlined"
          multiline
          rows={3}
          {...register('businessAddress', { 
            required: t('Business address is required') as string
          })}
          error={!!errors.businessAddress}
          helperText={errors.businessAddress?.message}
        />
      </Grid>
      
      {/* Tipo de Negócio - Agora como TextField */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t('Business Type')}
          variant="outlined"
          {...register('businessType', { 
            required: t('Business type is required') as string
          })}
          error={!!errors.businessType}
          helperText={errors.businessType?.message}
        />
      </Grid>
    </Grid>
  );
};

export default StepBusinessInfo; 