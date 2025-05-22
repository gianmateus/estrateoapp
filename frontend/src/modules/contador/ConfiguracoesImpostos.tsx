/**
 * Componente de configurações de impostos alemães e europeus
 * 
 * Permite configurar:
 * - Alíquotas de Mehrwertsteuer (VAT) - normal (19%) e reduzida (7%)
 * - Configurações de Gewerbesteuer (impostos comerciais)
 * - Parâmetros específicos para a UE
 * - Configurações de exportação de relatórios
 */
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  Slider,
  Stack,
  Tooltip,
  IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Save,
  RestartAlt,
  Info,
  Help
} from '@mui/icons-material';

// Interface de props
interface ConfiguracoesImpostosProps {
  mes: string;
  taxRate: string;
  onTaxRateChange: (event: SelectChangeEvent) => void;
}

// Taxas padrão na Alemanha
const DEFAULT_VAT_RATES = {
  normal: 19,
  reduced: 7,
  zero: 0
};

// Componente de configurações
const ConfiguracoesImpostos: React.FC<ConfiguracoesImpostosProps> = ({
  mes,
  taxRate,
  onTaxRateChange
}) => {
  const { t } = useTranslation();
  const [success, setSuccess] = useState<string | null>(null);
  const [businessTaxRate, setBusinessTaxRate] = useState<number>(15); // Gewerbesteuer (%)
  const [enableECommerce, setEnableECommerce] = useState<boolean>(false);
  const [enableOneStopShop, setEnableOneStopShop] = useState<boolean>(false);
  const [enableExports, setEnableExports] = useState<boolean>(true);
  const [euMember, setEuMember] = useState<boolean>(true);

  // Função para garantir que o texto da tradução não seja null
  const getText = (key: string, fallback: string): string => {
    const translated = t(key);
    return translated !== key ? translated : fallback;
  };

  // Manipulador para alteração de taxa comercial
  const handleBusinessTaxChange = (event: Event, newValue: number | number[]) => {
    setBusinessTaxRate(newValue as number);
  };

  // Salvar configurações
  const handleSaveConfig = () => {
    console.log('Salvando configurações fiscais', {
      taxRate,
      businessTaxRate,
      enableECommerce,
      enableOneStopShop,
      enableExports,
      euMember
    });
    setSuccess(getText('contador.configuracoes.salvoComSucesso', 'Configurações salvas com sucesso'));
    setTimeout(() => setSuccess(null), 3000);
  };

  // Restaurar configurações padrão
  const handleResetConfig = () => {
    setBusinessTaxRate(15);
    setEnableECommerce(false);
    setEnableOneStopShop(false);
    setEnableExports(true);
    setEuMember(true);
  };

  return (
    <Box>
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Typography variant="h6" gutterBottom>
        {getText('contador.configuracoes.titulo', 'Configurações Fiscais')}
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        {getText('contador.configuracoes.subtitulo', 'Configure alíquotas de impostos e opções de faturamento')}
      </Typography>

      <Grid container spacing={3}>
        {/* Configurações de Mehrwertsteuer (VAT) */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {getText('contador.configuracoes.vatSettings', 'Configurações de Mehrwertsteuer (IVA)')}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {getText('contador.configuracoes.vatSettingsDesc', 'Configure as alíquotas e aplicabilidade do IVA')}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="tax-rate-select-label">
                  {getText('contador.configuracoes.taxRate', 'Alíquota')}
                </InputLabel>
                <Select
                  labelId="tax-rate-select-label"
                  id="tax-rate-select"
                  value={taxRate}
                  label={getText('contador.configuracoes.taxRate', 'Alíquota')}
                  onChange={onTaxRateChange}
                >
                  <MenuItem value="normal">
                    {getText('contador.configuracoes.taxRateNormal', 'Normal')} ({DEFAULT_VAT_RATES.normal}%)
                  </MenuItem>
                  <MenuItem value="reduzido">
                    {getText('contador.configuracoes.taxRateReduced', 'Reduzida')} ({DEFAULT_VAT_RATES.reduced}%)
                  </MenuItem>
                  <MenuItem value="zero">
                    {getText('contador.configuracoes.taxRateZero', 'Zero')} ({DEFAULT_VAT_RATES.zero}%)
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch 
                    checked={enableECommerce}
                    onChange={(e) => setEnableECommerce(e.target.checked)}
                  />
                }
                label={getText('contador.configuracoes.ecommerce', 'Ativar vendas e-commerce')}
              />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={enableOneStopShop}
                    onChange={(e) => setEnableOneStopShop(e.target.checked)}
                    disabled={!enableECommerce}
                  />
                }
                label={
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="body2">
                      {getText('contador.configuracoes.oneStopShop', 'One-Stop-Shop para vendas UE')}
                    </Typography>
                    <Tooltip title={getText('contador.configuracoes.oneStopShopTooltip', 'Processamento simplificado de IVA para vendas a clientes da UE')}>
                      <IconButton size="small">
                        <Help fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                }
              />
            </Box>
          </Paper>
        </Grid>

        {/* Configurações de Gewerbesteuer */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {getText('contador.configuracoes.businessTaxSettings', 'Configurações de Imposto Comercial')}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {getText('contador.configuracoes.businessTaxSettingsDesc', 'Configure os parâmetros de cálculo do imposto comercial')}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" gutterBottom>
                {getText('contador.configuracoes.businessTaxRate', 'Alíquota de imposto comercial')}: {businessTaxRate}%
              </Typography>
              <Slider
                value={businessTaxRate}
                onChange={handleBusinessTaxChange}
                min={0}
                max={35}
                step={0.5}
                valueLabelDisplay="auto"
                sx={{ mb: 3 }}
              />

              <FormControlLabel
                control={
                  <Switch 
                    checked={euMember}
                    onChange={(e) => setEuMember(e.target.checked)}
                  />
                }
                label={getText('contador.configuracoes.euMember', 'Estado-membro da UE')}
              />
              
              <FormControlLabel
                control={
                  <Switch 
                    checked={enableExports}
                    onChange={(e) => setEnableExports(e.target.checked)}
                  />
                }
                label={getText('contador.configuracoes.enableExports', 'Habilitar exportações')}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Aviso GDPR */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Info color="primary" fontSize="small" />
          <Typography variant="body2" fontWeight="medium">
            {getText('contador.configuracoes.gdprInfo', 'Aviso de Privacidade')}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {getText('contador.configuracoes.gdprDesc', 'Todos os dados fiscais são processados e armazenados de acordo com os requisitos do GDPR e regulamentações fiscais alemãs.')}
        </Typography>
      </Paper>

      {/* Botões de ação */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          startIcon={<RestartAlt />}
          onClick={handleResetConfig}
        >
          {getText('contador.configuracoes.restaurarPadrao', 'Restaurar padrões')}
        </Button>
        <Button 
          variant="contained" 
          startIcon={<Save />}
          onClick={handleSaveConfig}
        >
          {getText('contador.configuracoes.salvarConfiguracoes', 'Salvar configurações')}
        </Button>
      </Box>
    </Box>
  );
};

export default ConfiguracoesImpostos; 