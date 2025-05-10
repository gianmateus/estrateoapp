import React from 'react';
import { 
  Typography, 
  Box, 
  Paper, 
  Grid,
  TextField,
  MenuItem,
  Button,
  Divider,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTranslation } from 'react-i18next';
import { useTaxProfile } from '../../contexts/TaxProfileContext';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

// Lista de formas jurídicas
const legalForms = [
  { value: 'GmbH', label: 'GmbH - Sociedade Limitada' },
  { value: 'UG', label: 'UG - Sociedade Limitada Empresarial' },
  { value: 'AG', label: 'AG - Sociedade Anônima' },
  { value: 'Einzelunternehmen', label: 'Einzelunternehmen - Empresário Individual' },
  { value: 'GbR', label: 'GbR - Sociedade Civil' },
  { value: 'KG', label: 'KG - Sociedade em Comandita' },
  { value: 'OHG', label: 'OHG - Sociedade em Nome Coletivo' }
];

// Lista de regimes de IVA
const vatSchemes = [
  { value: 'regular', label: 'Regular - 19%' },
  { value: 'reduced', label: 'Reduzido - 7%' },
  { value: 'exempt', label: 'Isento' },
  { value: 'mixed', label: 'Misto' }
];

// Interface para dados do formulário
interface TaxProfileFormData {
  legalForm: string;
  municipality: string;
  hebesatz: string;
  vatScheme: string;
  employeesCount: string;
  taxNumber: string;
  vatId: string;
}

// Schema de validação com Yup
const schema = yup.object({
  legalForm: yup.string().required('Forma jurídica é obrigatória'),
  municipality: yup.string().required('Município é obrigatório'),
  hebesatz: yup
    .string()
    .required('Hebesatz é obrigatório')
    .test('is-number', 'Deve ser um número válido', value => !isNaN(Number(value))),
  vatScheme: yup.string().required('Regime de IVA é obrigatório'),
  employeesCount: yup
    .string()
    .required('Número de funcionários é obrigatório')
    .test('is-integer', 'Deve ser um número inteiro', 
      value => !isNaN(Number(value)) && Number.isInteger(Number(value))),
  taxNumber: yup.string(),
  vatId: yup.string()
});

// Componente para rótulo com tooltip
const LabelWithTooltip: React.FC<{label: string, tooltip: string}> = ({label, tooltip}) => (
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    {label}
    <Tooltip title={tooltip} arrow placement="top">
      <IconButton size="small" sx={{ ml: 0.5, p: 0 }}>
        <HelpOutlineIcon fontSize="small" color="action" />
      </IconButton>
    </Tooltip>
  </Box>
);

const TaxProfileSection: React.FC = () => {
  const { t } = useTranslation();
  const { taxProfile, isLoading, updateTaxProfile } = useTaxProfile();
  
  // Configuração do react-hook-form com validação Yup
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      legalForm: taxProfile?.legalForm || '',
      municipality: taxProfile?.municipality || '',
      hebesatz: taxProfile?.hebesatz?.toString() || '',
      vatScheme: taxProfile?.vatScheme || '',
      employeesCount: taxProfile?.employeesCount?.toString() || '',
      taxNumber: taxProfile?.taxNumber || '',
      vatId: taxProfile?.vatId || '',
    },
    resolver: yupResolver(schema) as any
  });
  
  // Função para submeter o formulário
  const onSubmit = async (data: any) => {
    try {
      await updateTaxProfile({
        legalForm: data.legalForm,
        municipality: data.municipality,
        hebesatz: parseFloat(data.hebesatz),
        vatScheme: data.vatScheme,
        employeesCount: parseInt(data.employeesCount),
        taxNumber: data.taxNumber || undefined,
        vatId: data.vatId || undefined
      });
      toast.success('Perfil fiscal atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar perfil fiscal');
      console.error(error);
    }
  };
  
  return (
    <Paper elevation={2} sx={{ p: 0, borderRadius: 2, mt: 3 }}>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="tax-profile-content"
          id="tax-profile-header"
          sx={{ 
            px: 3, 
            py: 2,
            '&.Mui-expanded': {
              borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AccountBalanceIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h6">Perfil Fiscal</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ p: 3 }}>
          {isLoading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" paragraph>
                O perfil fiscal é necessário para o cálculo correto de impostos. Preencha todos os campos obrigatórios para habilitar os cálculos automáticos.
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="legalForm"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          select
                          label={<LabelWithTooltip 
                            label={t('taxes.legalForm') || 'Forma Jurídica'} 
                            tooltip="Define o tipo de empresa (GmbH, UG, etc.) e influencia nos cálculos fiscais."
                          />}
                          fullWidth
                          {...field}
                          error={!!errors.legalForm}
                          helperText={errors.legalForm?.message}
                        >
                          {legalForms.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="vatScheme"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          select
                          label={<LabelWithTooltip 
                            label={t('taxes.vatScheme') || 'Regime de IVA'} 
                            tooltip="Determina a forma como o IVA (imposto sobre valor agregado) é calculado, podendo ser regular (19%), reduzido (7%), isento ou misto."
                          />}
                          fullWidth
                          {...field}
                          error={!!errors.vatScheme}
                          helperText={errors.vatScheme?.message}
                        >
                          {vatSchemes.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="municipality"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label={<LabelWithTooltip 
                            label={t('taxes.municipality') || 'Município'} 
                            tooltip="Cidade onde a empresa está registrada. Influencia taxas locais como o Hebesatz."
                          />}
                          fullWidth
                          {...field}
                          error={!!errors.municipality}
                          helperText={errors.municipality?.message}
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="hebesatz"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label={<LabelWithTooltip 
                            label={t('taxes.hebesatz') || 'Taxa de Comércio (Hebesatz)'} 
                            tooltip="Multiplicador municipal do imposto de comércio (Gewerbesteuer). Varia entre 200% e 900% dependendo do município."
                          />}
                          fullWidth
                          type="number"
                          {...field}
                          error={!!errors.hebesatz}
                          helperText={
                            errors.hebesatz?.message || 
                            t('taxes.hebesatzHelp') || 'Taxa de multiplicação do imposto comercial (varia por município)'
                          }
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="employeesCount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label={<LabelWithTooltip 
                            label={t('taxes.employeesCount') || 'Número de Funcionários'} 
                            tooltip="Quantidade de funcionários da empresa. Afeta o cálculo de impostos sobre folha de pagamento."
                          />}
                          fullWidth
                          type="number"
                          {...field}
                          error={!!errors.employeesCount}
                          helperText={errors.employeesCount?.message}
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      {t('taxes.optionalInformation') || 'Informações Opcionais'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="taxNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label={<LabelWithTooltip 
                            label={t('taxes.taxNumber') || 'Número Fiscal'} 
                            tooltip="Número de identificação fiscal da empresa (Ex: Steuernummer)."
                          />}
                          fullWidth
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="vatId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          label={<LabelWithTooltip 
                            label={t('taxes.vatId') || 'Número de IVA/VAT'} 
                            tooltip="Número de identificação para o imposto sobre valor agregado (Ex: USt-IdNr. / VAT ID)."
                          />}
                          fullWidth
                          {...field}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
                
                <Box mt={4} display="flex" justifyContent="flex-end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    {t('common.save') || 'Salvar'}
                  </Button>
                </Box>
              </form>
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default TaxProfileSection; 