import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Tabs, 
  Tab, 
  CircularProgress,
  Snackbar,
  Alert,
  Divider,
  IconButton,
  useTheme,
  Skeleton,
  Stack,
  Chip,
  TextField,
  MenuItem,
  Tooltip,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  RefreshOutlined as RefreshIcon,
  InfoOutlined as InfoIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as LightbulbIcon,
  CalendarMonth as CalendarIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon,
  Cached as CachedIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import ChatGPTService from '../services/ChatGPTService';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { formatCurrency, formatDate } from '../utils/formatters';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface AlertState {
  open: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'success';
}

interface UsageMetricsState {
  totalRequests: number;
  totalTokensUsed: number;
  lastRequest: Date | null;
  lastModelUsed: string | null;
}

interface ModelOption {
  value: string;
  label: string;
  description: string;
}

const modelOptions: ModelOption[] = [
  { 
    value: 'gpt-3.5-turbo', 
    label: 'GPT-3.5 Turbo', 
    description: 'Rápido e econômico, bom para análises básicas' 
  },
  { 
    value: 'gpt-4', 
    label: 'GPT-4', 
    description: 'Mais preciso, recomendado para análises complexas' 
  }
];

const InteligenciaArtificial = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [previsaoVendas, setPrevisaoVendas] = useState<any[]>([]);
  const [recomendacoes, setRecomendacoes] = useState<any[]>([]);
  const [dadosSazonalidade, setDadosSazonalidade] = useState<any[]>([]);
  const [servidorOnline, setServidorOnline] = useState(true);
  const [servidorInfo, setServidorInfo] = useState<any>(null);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [usageMetrics, setUsageMetrics] = useState<UsageMetricsState>({
    totalRequests: 0,
    totalTokensUsed: 0,
    lastRequest: null,
    lastModelUsed: null
  });
  const [modelSettings, setModelSettings] = useState({
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    useCachedResults: true
  });
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'info'
  });

  useEffect(() => {
    // Verificar se o servidor está disponível ao carregar o componente
    const verificarServidor = async () => {
      try {
        const info = await ChatGPTService.verificarConfiguracao();
        setServidorOnline(true);
        setServidorInfo(info);
      } catch (error) {
        console.error('Erro de conexão com o servidor:', error);
        setServidorOnline(false);
        setAlert({
          open: true,
          message: 'O servidor de IA não está disponível no momento. Tente novamente mais tarde.',
          severity: 'warning'
        });
      }
    };
    
    verificarServidor();
    
    // Carregar métricas de uso
    setUsageMetrics(ChatGPTService.getUsageMetrics());
    
    // Atualizar métricas a cada 30 segundos se a página estiver aberta
    const intervalId = setInterval(() => {
      setUsageMetrics(ChatGPTService.getUsageMetrics());
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };
  
  const handleModelChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setModelSettings({
      ...modelSettings,
      model: event.target.value as string
    });
  };
  
  const handleTemperatureChange = (event: Event, newValue: number | number[]) => {
    setModelSettings({
      ...modelSettings,
      temperature: newValue as number
    });
  };
  
  const handleCacheToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setModelSettings({
      ...modelSettings,
      useCachedResults: event.target.checked
    });
  };
  
  const handleClearCache = () => {
    ChatGPTService.clearCache();
    setAlert({
      open: true,
      message: 'Cache de IA limpo com sucesso',
      severity: 'success'
    });
  };

  const carregarDadosExemplo = async () => {
    if (!servidorOnline) {
      setAlert({
        open: true,
        message: 'Servidor de IA não está disponível. Por favor, tente mais tarde.',
        severity: 'error'
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Usar dados de exemplo para a demonstração
      // Em um ambiente real, usaríamos dados do banco de dados
      const dadosExemplo = {
        vendas_mensais: [
          { mes: 'Janeiro', valor: 42000 },
          { mes: 'Fevereiro', valor: 38500 },
          { mes: 'Março', valor: 47300 },
          { mes: 'Abril', valor: 43200 },
          { mes: 'Maio', valor: 49800 },
          { mes: 'Junho', valor: 52100 },
        ],
        custos: {
          fixos: 15000,
          variaveis: 22000
        },
        produtos_mais_vendidos: [
          { nome: 'Produto A', quantidade: 423, receita: 12690 },
          { nome: 'Produto B', quantidade: 381, receita: 15240 },
          { nome: 'Produto C', quantidade: 297, receita: 8910 }
        ],
        horarios_pico: [
          { dia: 'Sexta', horario: '19:00-22:00' },
          { dia: 'Sábado', horario: '19:00-23:00' },
          { dia: 'Domingo', horario: '12:00-15:00' }
        ]
      };

      // Verificar se há um tipo de negócio definido para o usuário
      const tipoNegocio = user?.tipoNegocio || 'restaurante';

      // Carregar os três tipos de dados em paralelo para melhor performance
      try {
        const startTime = Date.now();
        
        const [dadosPrevisaoVendas, dadosRecomendacoes, dadosSazonalidadeRes] = await Promise.all([
          ChatGPTService.previsoes.obterPrevisaoVendas(tipoNegocio, dadosExemplo),
          ChatGPTService.recomendacoes.obterRecomendacoesNegocio(tipoNegocio, dadosExemplo),
          ChatGPTService.sazonalidade.obterDadosSazonalidade(tipoNegocio, dadosExemplo)
        ]);
        
        const totalTime = Date.now() - startTime;
        
        setPrevisaoVendas(dadosPrevisaoVendas);
        setRecomendacoes(dadosRecomendacoes);
        setDadosSazonalidade(dadosSazonalidadeRes);
        
        // Atualizar métricas após o carregamento
        setUsageMetrics(ChatGPTService.getUsageMetrics());
        
        setAlert({
          open: true,
          message: `Análises geradas com sucesso em ${Math.round(totalTime / 1000)} segundos!`,
          severity: 'success'
        });
        
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        
        setAlert({
          open: true,
          message: error instanceof Error 
            ? error.message 
            : 'Ocorreu um erro ao gerar as análises. Tente novamente mais tarde.',
          severity: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Renderizar indicador de métricas
  const renderUsageMetrics = () => {
    return (
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="caption" color="text.secondary">Total de Consultas</Typography>
            <Typography variant="h6">{usageMetrics.totalRequests}</Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" color="text.secondary">Total de Tokens</Typography>
            <Typography variant="h6">{usageMetrics.totalTokensUsed.toLocaleString()}</Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" color="text.secondary">Último Modelo</Typography>
            <Typography variant="h6">{usageMetrics.lastModelUsed || "-"}</Typography>
          </Box>
          
          <Box>
            <Typography variant="caption" color="text.secondary">Status do Servidor</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                sx={{ 
                  width: 10, 
                  height: 10, 
                  borderRadius: '50%', 
                  bgcolor: servidorOnline ? 'success.main' : 'error.main' 
                }} 
              />
              <Typography variant="h6">{servidorOnline ? 'Online' : 'Offline'}</Typography>
            </Box>
          </Box>
          
          <Tooltip title="Configurações Avançadas">
            <IconButton 
              color="primary" 
              onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            >
              <SettingsIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        
        {showAdvancedSettings && (
          <Box sx={{ mt: 2, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl variant="outlined" size="small" fullWidth>
                  <InputLabel>Modelo de IA</InputLabel>
                  <Select
                    value={modelSettings.model}
                    onChange={(e) => setModelSettings({...modelSettings, model: e.target.value as string})}
                    label="Modelo de IA"
                  >
                    {modelOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box>
                          <Typography variant="body2">{option.label}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Temperatura: {modelSettings.temperature}
                  </Typography>
                  <Tooltip title="Valores mais baixos = mais previsível, valores mais altos = mais criativo">
                    <Slider
                      size="small"
                      value={modelSettings.temperature}
                      min={0}
                      max={1}
                      step={0.1}
                      onChange={handleTemperatureChange}
                      valueLabelDisplay="auto"
                      aria-label="Temperatura"
                    />
                  </Tooltip>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={modelSettings.useCachedResults}
                      onChange={handleCacheToggle}
                      color="primary"
                    />
                  }
                  label="Usar Cache"
                />
              </Grid>
              
              <Grid item xs={12} md={2}>
                <Button
                  startIcon={<CachedIcon />}
                  onClick={handleClearCache}
                  variant="outlined"
                  size="small"
                >
                  Limpar Cache
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        {/* Banner de versão Alpha */}
        <Alert 
          severity="warning" 
          variant="filled"
          sx={{ 
            mb: 3, 
            fontWeight: 'medium',
            borderLeft: '4px solid #ED6C02'
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">Versão Alpha</Typography>
          <Typography variant="body2">
            Este módulo de IA & Análises está em fase inicial de desenvolvimento (alpha). 
            As recomendações e previsões são geradas com dados simulados e algumas funcionalidades
            podem não estar completamente implementadas. Agradecemos sua compreensão e feedback
            durante esta fase de testes.
          </Typography>
        </Alert>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="análises de IA"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              label="Previsão de Vendas" 
              icon={<TrendingUpIcon />} 
              iconPosition="start" 
              {...a11yProps(0)} 
              sx={{ textTransform: 'none', fontWeight: 'medium' }}
            />
            <Tab 
              label="Recomendações" 
              icon={<LightbulbIcon />} 
              iconPosition="start" 
              {...a11yProps(1)} 
              sx={{ textTransform: 'none', fontWeight: 'medium' }}
            />
            <Tab 
              label="Sazonalidade" 
              icon={<CalendarIcon />} 
              iconPosition="start" 
              {...a11yProps(2)} 
              sx={{ textTransform: 'none', fontWeight: 'medium' }}
            />
            <Tab 
              label="Configurações" 
              icon={<SettingsIcon />} 
              iconPosition="start" 
              {...a11yProps(3)} 
              sx={{ textTransform: 'none', fontWeight: 'medium' }}
            />
          </Tabs>
        </Box>

        {!servidorOnline && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            O servidor de IA não está disponível no momento. Algumas funcionalidades podem não funcionar corretamente.
          </Alert>
        )}
        
        <Alert severity="info" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              Tipo de negócio atual: <strong>{user?.tipoNegocio || 'restaurante'}</strong>
            </Typography>
            <Typography variant="caption">
              As recomendações são personalizadas para este tipo de negócio. Pode 
              <Button 
                size="small" 
                sx={{ fontSize: '0.75rem', ml: 1, textTransform: 'none' }}
                component={Link}
                to="/dashboard/perfil"
              >
                alterar no seu perfil
              </Button>
              se necessário.
            </Typography>
          </Box>
        </Alert>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" component="h1" fontWeight="medium">
            Inteligência Artificial & Análises
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
            onClick={carregarDadosExemplo}
            disabled={loading || !servidorOnline}
          >
            {loading ? 'Gerando Análises...' : 'Gerar Análises com IA'}
          </Button>
        </Box>
      </Paper>
      
      {/* Mostrar métricas de uso se o servidor estiver online */}
      {servidorOnline && renderUsageMetrics()}

      <Paper 
        sx={{ 
          p: 2, 
          mb: 3,
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          background: theme.palette.background.paper
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2
          }}
        >
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
              Inteligência Artificial
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Utilize IA para obter insights sobre seu negócio, previsões e recomendações.
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={carregarDadosExemplo}
            disabled={loading || !servidorOnline}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
            sx={{ 
              py: 1.5,
              px: 3,
              borderRadius: 2, 
              textTransform: 'none',
              fontWeight: 'bold',
              boxShadow: theme.shadows[4]
            }}
          >
            {loading ? 'Gerando análises...' : 'Gerar Análises com IA'}
          </Button>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="IA tabs"
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
            sx={{ mb: 1 }}
          >
            <Tab 
              label="Previsões" 
              icon={<TrendingUpIcon />} 
              iconPosition="start" 
              {...a11yProps(0)} 
              sx={{ textTransform: 'none', fontWeight: 'medium' }}
            />
            <Tab 
              label="Recomendações" 
              icon={<LightbulbIcon />} 
              iconPosition="start" 
              {...a11yProps(1)} 
              sx={{ textTransform: 'none', fontWeight: 'medium' }}
            />
            <Tab 
              label="Sazonalidade" 
              icon={<CalendarIcon />} 
              iconPosition="start" 
              {...a11yProps(2)} 
              sx={{ textTransform: 'none', fontWeight: 'medium' }}
            />
            <Tab 
              label="Configurações" 
              icon={<SettingsIcon />} 
              iconPosition="start" 
              {...a11yProps(3)} 
              sx={{ textTransform: 'none', fontWeight: 'medium' }}
            />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Previsão de Vendas (Próximos 7 dias)
            </Typography>
            <IconButton 
              aria-label="informações" 
              size="small" 
              color="primary"
              title="Previsões geradas com base nas tendências dos últimos dias"
            >
              <InfoIcon />
            </IconButton>
          </Box>
          
          {loading ? (
            <Grid container spacing={2}>
              {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {previsaoVendas.map((previsao, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      borderRadius: 2,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[6]
                      }
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight="bold" 
                        color="text.secondary"
                      >
                        {formatDate(new Date(previsao.date))}
                      </Typography>
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          mt: 2,
                          mb: 1,
                          color: theme.palette.primary.main,
                          fontWeight: 'bold' 
                        }}
                      >
                        {formatCurrency(previsao.predicted_sales)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {previsaoVendas.length === 0 && !loading && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
                    <Stack spacing={2} alignItems="center">
                      <TrendingUpIcon color="primary" sx={{ fontSize: 40 }} />
                      <Typography align="center">
                        Clique em "Gerar Análises com IA" para ver previsões baseadas nos seus dados.
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Recomendações para seu Restaurante
            </Typography>
            <IconButton 
              aria-label="informações" 
              size="small" 
              color="primary"
              title="Sugestões baseadas na análise de seus dados de vendas e inventário"
            >
              <InfoIcon />
            </IconButton>
          </Box>
          
          {loading ? (
            <Stack spacing={2}>
              {[1, 2, 3].map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
              ))}
            </Stack>
          ) : (
            <Grid container spacing={2}>
              {recomendacoes.map((recomendacao, index) => (
                <Grid item xs={12} key={index}>
                  <Card 
                    sx={{ 
                      mb: 2, 
                      borderRadius: 2,
                      boxShadow: theme.shadows[2],
                      borderLeft: '4px solid',
                      borderColor: 
                        recomendacao.impact === 'high' ? theme.palette.error.main : 
                        recomendacao.impact === 'medium' ? theme.palette.warning.main : 
                        theme.palette.success.main,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateX(4px)',
                        boxShadow: theme.shadows[4]
                      }
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6" fontWeight="bold">{recomendacao.title}</Typography>
                        <Box sx={{ 
                          bgcolor: 
                            recomendacao.impact === 'high' ? theme.palette.error.main : 
                            recomendacao.impact === 'medium' ? theme.palette.warning.main : 
                            theme.palette.success.main,
                          color: 'white',
                          px: 2,
                          py: 0.5,
                          borderRadius: 4,
                          fontSize: '0.8rem',
                          fontWeight: 'bold'
                        }}>
                          {recomendacao.impact === 'high' ? 'Alto Impacto' : 
                          recomendacao.impact === 'medium' ? 'Médio Impacto' : 
                          'Baixo Impacto'}
                        </Box>
                      </Box>
                      <Typography variant="body1" sx={{ mb: 2 }}>{recomendacao.description}</Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          display: 'inline-block',
                          bgcolor: theme.palette.background.default,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2
                        }}
                      >
                        Categoria: {recomendacao.category}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {recomendacoes.length === 0 && !loading && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
                    <Stack spacing={2} alignItems="center">
                      <LightbulbIcon color="primary" sx={{ fontSize: 40 }} />
                      <Typography align="center">
                        Clique em "Gerar Análises com IA" para receber recomendações personalizadas.
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="medium">
              Análise de Sazonalidade
            </Typography>
            <IconButton 
              aria-label="informações" 
              size="small" 
              color="primary"
              title="Padrões sazonais que afetam seu negócio"
            >
              <InfoIcon />
            </IconButton>
          </Box>
          
          {loading ? (
            <Grid container spacing={2}>
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={2}>
              {dadosSazonalidade.map((dado, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      borderRadius: 2,
                      backgroundColor: index % 2 === 0 ? 
                        theme.palette.mode === 'dark' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(46, 125, 50, 0.05)' : 
                        theme.palette.background.paper,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[6]
                      }
                    }}
                  >
                    <CardContent>
                      <Typography 
                        variant="subtitle1" 
                        fontWeight="bold"
                      >
                        {dado.period}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          my: 1,
                          color: theme.palette.text.primary, 
                          fontWeight: 'medium' 
                        }}
                      >
                        {formatCurrency(dado.value)}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          fontStyle: 'italic',
                          mt: 1
                        }}
                      >
                        {dado.category}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              {dadosSazonalidade.length === 0 && !loading && (
                <Grid item xs={12}>
                  <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'background.default' }}>
                    <Stack spacing={2} alignItems="center">
                      <CalendarIcon color="primary" sx={{ fontSize: 40 }} />
                      <Typography align="center">
                        Clique em "Gerar Análises com IA" para visualizar padrões sazonais.
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          {renderUsageMetrics()}
        </TabPanel>
      </Paper>
      
      <Snackbar 
        open={alert.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity} 
          variant="filled"
          sx={{ width: '100%', boxShadow: theme.shadows[6] }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default InteligenciaArtificial; 