import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Grid, 
  TextField, 
  Typography, 
  MenuItem, 
  Select,
  FormControl,
  InputLabel,
  FormHelperText
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// Interface para os dados do formulário
interface BusinessInfoFormData {
  businessName: string;
  businessId: string;
  businessAddress: string;
  businessType: string;
}

// Lista de tipos de negócios comuns na Alemanha
const businessTypes = [
  'Restaurant', // Restaurante
  'Café',
  'Barbershop', // Barbearia
  'Clothing Store', // Loja de Roupas
  'Bakery', // Padaria
  'Grocery Store', // Mercearia
  'Pharmacy', // Farmácia
  'Hotel',
  'Fitness Studio', // Academia
  'Other' // Outro
];

const StepBusinessInfo: React.FC = () => {
  // Hooks para tradução
  const { t } = useTranslation();
  
  // Form Context do React Hook Form
  const { register, formState: { errors }, control } = useFormContext<BusinessInfoFormData>();

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          {t('Dados do Negócio')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {t('Preencha as informações sobre o seu negócio')}
        </Typography>
      </Grid>
      
      {/* Nome do Negócio */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t('Nome do Negócio')}
          variant="outlined"
          {...register('businessName', { 
            required: t('Nome do negócio é obrigatório') as string
          })}
          error={!!errors.businessName}
          helperText={errors.businessName?.message}
        />
      </Grid>
      
      {/* ID do Negócio (como Tax ID ou similar) */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t('ID do Negócio')}
          variant="outlined"
          placeholder="e.g. VAT number, Tax ID"
          {...register('businessId', { 
            required: t('ID do negócio é obrigatório') as string
          })}
          error={!!errors.businessId}
          helperText={errors.businessId?.message}
        />
      </Grid>
      
      {/* Endereço do Negócio */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t('Endereço do Negócio')}
          variant="outlined"
          multiline
          rows={3}
          {...register('businessAddress', { 
            required: t('Endereço do negócio é obrigatório') as string
          })}
          error={!!errors.businessAddress}
          helperText={errors.businessAddress?.message}
        />
      </Grid>
      
      {/* Tipo de Negócio */}
      <Grid item xs={12}>
        <FormControl fullWidth error={!!errors.businessType}>
          <InputLabel id="business-type-label">{t('Tipo de Negócio')}</InputLabel>
          <Select
            labelId="business-type-label"
            id="business-type"
            label={t('Tipo de Negócio')}
            defaultValue=""
            {...register('businessType', { 
              required: t('Tipo de negócio é obrigatório') as string
            })}
          >
            {businessTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
          {errors.businessType && (
            <FormHelperText>{errors.businessType.message}</FormHelperText>
          )}
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default StepBusinessInfo; 