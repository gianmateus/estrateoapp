import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Tabs,
  Tab,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  MoreHoriz as MoreHorizIcon,
  History as HistoryIcon,
  DateRange as DateRangeIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { pt, enGB, de, it } from 'date-fns/locale';

// Interface para mensagens da IA
interface IAMensagem {
  id: string;
  userId: string;
  mensagem: string;
  data: string;
  lida: boolean;
  acao?: string;
}

// Definição da interface de props
interface RecomendacoesProps {
  userId: string;
}

/**
 * Componente que exibe as recomendações personalizadas geradas pela IA
 */
const Recomendacoes: React.FC<RecomendacoesProps> = ({ userId }) => {
  const { t, i18n } = useTranslation();
  const [recomendacoes, setRecomendacoes] = useState<IAMensagem[]>([]);
  const [historico, setHistorico] = useState<IAMensagem[]>([]);
  const [carregando, setCarregando] = useState<boolean>(false);
  const [abaAtual, setAbaAtual] = useState<number>(0);
  const [erro, setErro] = useState<string | null>(null);

  // Mapear locales do date-fns conforme o idioma atual
  const getLocale = () => {
    switch (i18n.language) {
      case 'pt':
        return pt;
      case 'de':
        return de;
      case 'it':
        return it;
      default:
        return enGB;
    }
  };

  // Formatar data conforme o locale
  const formatarData = (data: string) => {
    return format(new Date(data), 'PPP', { locale: getLocale() });
  };

  // Carregar recomendações do dia atual
  const carregarRecomendacoesDoDia = async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      // Em um ambiente real, isso seria uma chamada à API
      // Simulando resposta da API para fins de desenvolvimento
      setTimeout(() => {
        const dataAgora = new Date().toISOString();
        const recomendacoesSimuladas: IAMensagem[] = [
          {
            id: '1',
            userId,
            mensagem: '📉 ' + t('ia.recomendacoes.exemplo1'),
            data: dataAgora,
            lida: false
          },
          {
            id: '2',
            userId,
            mensagem: '⚠️ ' + t('ia.recomendacoes.exemplo2'),
            data: dataAgora,
            lida: false
          },
          {
            id: '3',
            userId,
            mensagem: '📊 ' + t('ia.recomendacoes.exemplo3'),
            data: dataAgora,
            lida: false,
            acao: '/relatorios/mensal'
          }
        ];
        
        setRecomendacoes(recomendacoesSimuladas);
        setCarregando(false);
      }, 1000);
      
    } catch (error) {
      setErro(t('ia.recomendacoes.erroCarregar'));
      setCarregando(false);
      console.error('Erro ao carregar recomendações:', error);
    }
  };

  // Carregar histórico de recomendações
  const carregarHistorico = async () => {
    try {
      setCarregando(true);
      setErro(null);
      
      // Em um ambiente real, isso seria uma chamada à API
      // Simulando resposta da API para fins de desenvolvimento
      setTimeout(() => {
        const diasAnteriores = [];
        const hoje = new Date();
        
        // Gerar recomendações para os últimos 5 dias
        for (let i = 1; i <= 5; i++) {
          const data = new Date(hoje);
          data.setDate(hoje.getDate() - i);
          
          diasAnteriores.push({
            id: `hist-${i}-1`,
            userId,
            mensagem: '💰 ' + t('ia.recomendacoes.historico1'),
            data: data.toISOString(),
            lida: true
          });
          
          if (i % 2 === 0) {
            diasAnteriores.push({
              id: `hist-${i}-2`,
              userId,
              mensagem: '🏪 ' + t('ia.recomendacoes.historico2'),
              data: data.toISOString(),
              lida: true
            });
          }
        }
        
        setHistorico(diasAnteriores);
        setCarregando(false);
      }, 1000);
      
    } catch (error) {
      setErro(t('ia.recomendacoes.erroCarregarHistorico'));
      setCarregando(false);
      console.error('Erro ao carregar histórico:', error);
    }
  };

  // Marcar recomendação como lida
  const marcarComoLida = async (id: string) => {
    try {
      // Em um ambiente real, isso seria uma chamada à API
      // Simulando resposta da API para fins de desenvolvimento
      setRecomendacoes(recomendacoes.map(rec => 
        rec.id === id ? { ...rec, lida: true } : rec
      ));
    } catch (error) {
      console.error('Erro ao marcar recomendação como lida:', error);
    }
  };

  // Mudar de aba
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setAbaAtual(newValue);
    if (newValue === 1 && historico.length === 0) {
      carregarHistorico();
    }
  };

  // Carregar recomendações quando o componente montar
  useEffect(() => {
    carregarRecomendacoesDoDia();
  }, []);

  // Atualizar quando o idioma mudar
  useEffect(() => {
    carregarRecomendacoesDoDia();
  }, [i18n.language]);

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" component="h2">
          {t('ia.recomendacoes.titulo')}
        </Typography>
        <Tooltip title={t('ia.recomendacoes.atualizar')}>
          <IconButton onClick={() => abaAtual === 0 ? carregarRecomendacoesDoDia() : carregarHistorico()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={abaAtual} onChange={handleTabChange} aria-label="Abas de recomendações">
            <Tab 
              icon={<DateRangeIcon />} 
              iconPosition="start" 
              label={t('ia.recomendacoes.hoje')} 
            />
            <Tab 
              icon={<HistoryIcon />} 
              iconPosition="start" 
              label={t('ia.recomendacoes.historico')} 
            />
          </Tabs>
        </Box>
        
        <CardContent>
          {carregando ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : erro ? (
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography color="error">{erro}</Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }} 
                onClick={() => abaAtual === 0 ? carregarRecomendacoesDoDia() : carregarHistorico()}
              >
                {t('ia.recomendacoes.tentar')}
              </Button>
            </Box>
          ) : (
            <>
              {abaAtual === 0 && (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    {t('ia.recomendacoes.mensagemHoje')}
                  </Typography>
                  
                  {recomendacoes.length === 0 ? (
                    <Typography sx={{ textAlign: 'center', p: 2 }}>
                      {t('ia.recomendacoes.semRecomendacoes')}
                    </Typography>
                  ) : (
                    <List>
                      {recomendacoes.map((rec) => (
                        <React.Fragment key={rec.id}>
                          <ListItem
                            alignItems="flex-start"
                            secondaryAction={
                              !rec.lida && (
                                <Tooltip title={t('ia.recomendacoes.marcarLida')}>
                                  <IconButton 
                                    edge="end" 
                                    onClick={() => marcarComoLida(rec.id)}
                                  >
                                    <CheckCircleIcon />
                                  </IconButton>
                                </Tooltip>
                              )
                            }
                          >
                            <ListItemText
                              primary={rec.mensagem}
                              secondary={formatarData(rec.data)}
                              sx={{
                                opacity: rec.lida ? 0.6 : 1,
                                '& .MuiListItemText-primary': {
                                  fontSize: '1rem',
                                }
                              }}
                            />
                          </ListItem>
                          <Divider component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </>
              )}
              
              {abaAtual === 1 && (
                <>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    {t('ia.recomendacoes.mensagemHistorico')}
                  </Typography>
                  
                  {historico.length === 0 ? (
                    <Typography sx={{ textAlign: 'center', p: 2 }}>
                      {t('ia.recomendacoes.semHistorico')}
                    </Typography>
                  ) : (
                    <List>
                      {historico.map((rec) => (
                        <React.Fragment key={rec.id}>
                          <ListItem alignItems="flex-start">
                            <ListItemText
                              primary={rec.mensagem}
                              secondary={formatarData(rec.data)}
                              sx={{
                                opacity: 0.8,
                                '& .MuiListItemText-primary': {
                                  fontSize: '0.95rem',
                                }
                              }}
                            />
                          </ListItem>
                          <Divider component="li" />
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Recomendacoes; 