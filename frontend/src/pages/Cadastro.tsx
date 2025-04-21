import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { 
  Container, 
  Paper, 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Check as CheckIcon 
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

// Importando os componentes de cada etapa
import StepPersonalInfo from '../components/register/StepPersonalInfo';
import StepBusinessInfo from '../components/register/StepBusinessInfo';
import StepConfirmation from '../components/register/StepConfirmation';

// Interface para os dados do formulário
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

// Define as etapas do cadastro
const steps = [
  'personalInformation',
  'businessInformation',
  'confirmation'
];

const Cadastro: React.FC = () => {
  // Hooks
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Estado para controlar a etapa atual
  const [activeStep, setActiveStep] = useState(0);
  
  // Estado para mensagens de erro
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Estado para loading durante submissão
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Métodos do React Hook Form
  const methods = useForm<RegisterFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      businessName: '',
      businessId: '',
      businessAddress: '',
      businessType: ''
    },
    mode: 'onChange'
  });
  
  // Navegar para a próxima etapa
  const handleNext = async () => {
    // Validar etapa atual
    let isValid = false;
    
    if (activeStep === 0) {
      // Validar dados pessoais
      isValid = await methods.trigger([
        'fullName', 
        'email', 
        'password', 
        'confirmPassword', 
        'phoneNumber'
      ]);
    } else if (activeStep === 1) {
      // Validar dados do negócio
      isValid = await methods.trigger([
        'businessName', 
        'businessId', 
        'businessAddress', 
        'businessType'
      ]);
    } else {
      isValid = true;
    }
    
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  // Voltar para a etapa anterior
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  // Reiniciar o processo
  const handleReset = () => {
    setActiveStep(0);
    methods.reset();
  };
  
  // Submeter o formulário
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      
      // Preparar dados para envio
      const userData = {
        name: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phoneNumber,
        businessName: data.businessName,
        businessId: data.businessId,
        businessAddress: data.businessAddress,
        businessType: data.businessType
      };
      
      // Enviar para API
      const response = await axios.post('/api/auth/register', userData);
      
      if (response.status === 201) {
        // Sucesso no cadastro
        setActiveStep(steps.length); // Ir para conclusão
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      
      // Tratamento de erro
      if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(error.response.data.message || t('registerError'));
      } else {
        setErrorMessage(t('registerError'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Renderizar a etapa atual
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <StepPersonalInfo />;
      case 1:
        return <StepBusinessInfo />;
      case 2:
        return <StepConfirmation />;
      default:
        return t('unknownStep');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mt: 5, 
          mb: 5,
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('createNewAccount')}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {t('fillInformation')}
          </Typography>
        </Box>
        
        {/* Stepper */}
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel={!isMobile}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{ mb: 4 }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{t(label)}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {activeStep === steps.length ? (
          // Conclusão do cadastro
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {t('accountCreatedSuccess')}
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              {t('loginToStart')}
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                component={Link} 
                to="/login"
                size="large"
              >
                {t('goToLogin')}
              </Button>
            </Box>
          </Box>
        ) : (
          // Formulário
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              {/* Conteúdo da etapa atual */}
              {getStepContent(activeStep)}
              
              {/* Mensagem de erro */}
              {errorMessage && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography color="error" variant="body2">
                    {errorMessage}
                  </Typography>
                </Box>
              )}
              
              {/* Botões de navegação */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={activeStep === 0 ? () => navigate('/login') : handleBack}
                  startIcon={<ArrowBackIcon />}
                  disabled={isSubmitting}
                >
                  {activeStep === 0 ? t('backToLogin') : t('back')}
                </Button>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={activeStep === steps.length - 1 ? methods.handleSubmit(onSubmit) : handleNext}
                  endIcon={activeStep === steps.length - 1 ? <CheckIcon /> : <ArrowForwardIcon />}
                  disabled={isSubmitting}
                >
                  {activeStep === steps.length - 1 ? t('createAccount') : t('next')}
                </Button>
              </Box>
            </form>
          </FormProvider>
        )}
      </Paper>
      
      {/* Link para login se já tiver conta */}
      {activeStep !== steps.length && (
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="body2" color="textSecondary">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
              {t('loginHere')}
            </Link>
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Cadastro; 