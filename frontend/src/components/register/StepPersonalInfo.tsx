import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Grid, 
  TextField, 
  Typography, 
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { useTranslation } from 'react-i18next';

// Interface para os dados do formulário
interface PersonalInfoFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
}

const StepPersonalInfo: React.FC = () => {
  // Hooks para tradução
  const { t } = useTranslation();
  
  // Estado para mostrar/esconder senha
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  // Form Context do React Hook Form
  const { register, formState: { errors }, watch, setValue, getValues } = useFormContext<PersonalInfoFormData>();
  
  // Para validar confirmação de senha
  const password = watch('password', '');
  
  // Toggle para mostrar/esconder senha
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          {t('Informações Pessoais')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {t('Preencha seus dados pessoais para criar uma conta')}
        </Typography>
      </Grid>
      
      {/* Nome Completo */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t('Nome Completo')}
          variant="outlined"
          {...register('fullName', { 
            required: t('Nome completo é obrigatório') as string
          })}
          error={!!errors.fullName}
          helperText={errors.fullName?.message}
        />
      </Grid>
      
      {/* Email */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t('Email')}
          variant="outlined"
          type="email"
          {...register('email', { 
            required: t('Email é obrigatório') as string,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: t('Formato de email inválido') as string
            }
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </Grid>
      
      {/* Senha */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t('Senha')}
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          {...register('password', { 
            required: t('Senha é obrigatória') as string,
            minLength: {
              value: 6,
              message: t('A senha deve ter pelo menos 6 caracteres') as string
            }
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      
      {/* Confirmar Senha */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          label={t('Confirmar Senha')}
          variant="outlined"
          type={showConfirmPassword ? 'text' : 'password'}
          {...register('confirmPassword', { 
            required: t('Confirmação de senha é obrigatória') as string,
            validate: value => 
              value === password || (t('As senhas não conferem') as string)
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={handleClickShowConfirmPassword}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Grid>
      
      {/* Telefone com react-phone-input-2 */}
      <Grid item xs={12}>
        <Typography variant="body2" gutterBottom>
          {t('Telefone')}
        </Typography>
        <PhoneInput
          country={'de'} // Alemanha como padrão
          value={getValues('phoneNumber')}
          onChange={(phone) => setValue('phoneNumber', phone, { shouldValidate: true })}
          containerStyle={{ width: '100%' }}
          inputStyle={{ width: '100%', height: '56px' }}
          specialLabel=""
          // Register não funciona diretamente com PhoneInput, por isso usamos setValue/getValues
        />
        {errors.phoneNumber && (
          <Typography variant="caption" color="error">
            {errors.phoneNumber.message}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default StepPersonalInfo; 