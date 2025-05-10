import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Alert,
  IconButton,
  InputAdornment,
  Snackbar,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { 
  WhatsApp as WhatsAppIcon, 
  Send as SendIcon, 
  AttachMoney as MoneyIcon,
  Add as AddIcon,
  Info as InfoIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import WhatsAppService from '../services/WhatsAppService';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency, formatDate } from '../utils/formatters';

interface MensagemState {
  id: string;
  telefone: string;
  texto: string;
  timestamp: Date;
  enviada: boolean;
  erro?: string;
}

interface RegistroDiarioState {
  data: string;
  faturamento: number;
  descricao: string;
  observacoes: string;
}

const formatarData = (data: Date): string => {
  return formatDate(data);
};

const formatarValor = (valor: number): string => {
  return formatCurrency(valor);
};

const Whatsapp = () => {
  const { user } = useAuth();
  const [mensagens, setMensagens] = useState<MensagemState[]>([]);
  const [registros, setRegistros] = useState<RegistroDiarioState[]>([]);
  const [novoTexto, setNovoTexto] = useState('');
  const [statusEnvio, setStatusEnvio] = useState({ show: false, success: true, message: '' });
  const [envioAutomatico, setEnvioAutomatico] = useState(true);
  const [dialogAberto, setDialogAberto] = useState(false);
  const [novoRegistro, setNovoRegistro] = useState<RegistroDiarioState>({
    data: new Date().toISOString().split('T')[0],
    faturamento: 0,
    descricao: '',
    observacoes: ''
  });
  const [modoEdicao, setModoEdicao] = useState(false);

  // Carrega dados iniciais
  useEffect(() => {
    carregarDados();
    
    // Configura verificação periódica para envio automático
    if (envioAutomatico && user?.whatsapp && user.horarioFuncionamento) {
      const intervalo = setInterval(() => {
        verificarEEnviarAutomatico();
      }, 60000); // Verifica a cada minuto
      
      return () => clearInterval(intervalo);
    }
  }, [user, envioAutomatico]);

  const carregarDados = () => {
    try {
      const mensagensCarregadas = WhatsAppService.getMensagens();
      const registrosCarregados = WhatsAppService.getRegistrosDiarios();
      
      setMensagens(mensagensCarregadas);
      setRegistros(registrosCarregados);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setStatusEnvio({
        show: true,
        success: false,
        message: 'Erro ao carregar dados. Tente novamente.'
      });
    }
  };

  const verificarEEnviarAutomatico = async () => {
    if (!user?.whatsapp || !user.horarioFuncionamento) return;
    
    try {
      const resultado = await WhatsAppService.verificarEEnviarMensagemFechamento(
        user.whatsapp, 
        user.horarioFuncionamento.horarioFechamento, 
        user.horarioFuncionamento.diasFuncionamento
      );
      
      if (resultado) {
        carregarDados();
      }
    } catch (error) {
      console.error('Erro ao verificar envio automático:', error);
    }
  };

  const enviarMensagem = async () => {
    if (!user?.whatsapp || !novoTexto.trim()) {
      setStatusEnvio({
        show: true,
        success: false,
        message: !user?.whatsapp 
          ? 'Configure seu número de WhatsApp no perfil primeiro.' 
          : 'Digite uma mensagem para enviar.'
      });
      return;
    }
    
    try {
      await WhatsAppService.enviarMensagem(user.whatsapp, novoTexto);
      setNovoTexto('');
      carregarDados();
      setStatusEnvio({
        show: true,
        success: true,
        message: 'Mensagem enviada com sucesso!'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setStatusEnvio({
        show: true,
        success: false,
        message: `Erro ao enviar mensagem: ${errorMessage}`
      });
    }
  };

  const enviarPerguntaFaturamento = async () => {
    if (!user?.whatsapp) {
      setStatusEnvio({
        show: true,
        success: false,
        message: 'Configure seu número de WhatsApp no perfil primeiro.'
      });
      return;
    }
    
    try {
      await WhatsAppService.enviarPerguntaFaturamento(user.whatsapp);
      carregarDados();
      setStatusEnvio({
        show: true,
        success: true,
        message: 'Pergunta sobre faturamento enviada com sucesso!'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setStatusEnvio({
        show: true,
        success: false,
        message: `Erro ao enviar mensagem: ${errorMessage}`
      });
    }
  };

  const handleFecharSnackbar = () => {
    setStatusEnvio({ ...statusEnvio, show: false });
  };

  const handleAbrirDialogRegistro = (editar = false, registro?: RegistroDiarioState) => {
    if (editar && registro) {
      setNovoRegistro({ ...registro });
      setModoEdicao(true);
    } else {
      setNovoRegistro({
        data: new Date().toISOString().split('T')[0],
        faturamento: 0,
        descricao: '',
        observacoes: ''
      });
      setModoEdicao(false);
    }
    setDialogAberto(true);
  };

  const handleFecharDialogRegistro = () => {
    setDialogAberto(false);
  };

  const handleInputRegistroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'faturamento') {
      // Converte para número e remove formatação
      const numeroLimpo = value.replace(/\D/g, '');
      const numero = numeroLimpo ? parseInt(numeroLimpo, 10) / 100 : 0;
      
      setNovoRegistro({
        ...novoRegistro,
        [name]: numero
      });
    } else {
      setNovoRegistro({
        ...novoRegistro,
        [name]: value
      });
    }
  };

  const handleSalvarRegistro = async () => {
    try {
      await WhatsAppService.registrarFaturamentoDiario(
        novoRegistro.data,
        novoRegistro.faturamento,
        novoRegistro.descricao,
        novoRegistro.observacoes
      );
      
      carregarDados();
      handleFecharDialogRegistro();
      
      setStatusEnvio({
        show: true,
        success: true,
        message: modoEdicao 
          ? 'Registro de faturamento atualizado com sucesso!' 
          : 'Registro de faturamento adicionado com sucesso!'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setStatusEnvio({
        show: true,
        success: false,
        message: `Erro ao salvar registro: ${errorMessage}`
      });
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Usuário não autenticado</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
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
          A integração com WhatsApp está em fase inicial de desenvolvimento (alpha). 
          Atualmente este módulo simula o envio de mensagens, mas ainda não se conecta 
          a uma API real de WhatsApp. Essa funcionalidade será implementada nas próximas versões.
        </Typography>
      </Alert>

      <Typography variant="h4" component="h1" gutterBottom display="flex" alignItems="center">
        <WhatsAppIcon sx={{ mr: 1, color: '#25D366' }} />
        Integração com WhatsApp
      </Typography>
      
      {!user.whatsapp && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Você ainda não configurou seu número de WhatsApp. 
          <Button 
            color="inherit" 
            size="small" 
            onClick={() => window.location.href = '/perfil'}
            sx={{ ml: 1 }}
          >
            Configurar agora
          </Button>
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Mensagens</Typography>
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={envioAutomatico}
                      onChange={(e) => setEnvioAutomatico(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Envio automático"
                />
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<MoneyIcon />}
                  onClick={enviarPerguntaFaturamento}
                  disabled={!user.whatsapp}
                  sx={{ ml: 1 }}
                >
                  Perguntar Faturamento
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ mb: 2, border: '1px solid #e0e0e0', borderRadius: 1, p: 2, bgcolor: '#f5f5f5', maxHeight: '300px', overflowY: 'auto' }}>
              {mensagens.length === 0 ? (
                <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary', py: 3 }}>
                  Nenhuma mensagem enviada ainda.
                </Typography>
              ) : (
                <List sx={{ width: '100%' }}>
                  {mensagens
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((msg) => (
                      <ListItem
                        key={msg.id}
                        alignItems="flex-start"
                        sx={{ 
                          mb: 1, 
                          bgcolor: msg.enviada ? '#dcf8c6' : '#fff', 
                          borderRadius: 1,
                          border: msg.enviada ? '1px solid #c5e1a5' : '1px solid #e0e0e0'
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="subtitle2">
                                {msg.enviada ? 'Enviado ✓' : 'Falha no envio ✗'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatarData(new Date(msg.timestamp))}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography component="span" variant="body2">
                                {msg.texto}
                              </Typography>
                              {msg.erro && (
                                <Typography component="div" variant="caption" color="error" sx={{ mt: 1 }}>
                                  Erro: {msg.erro}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                    ))}
                </List>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                label="Nova mensagem"
                variant="outlined"
                value={novoTexto}
                onChange={(e) => setNovoTexto(e.target.value)}
                multiline
                rows={2}
                placeholder="Digite uma mensagem para enviar via WhatsApp"
                disabled={!user.whatsapp}
              />
              <Button
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={enviarMensagem}
                disabled={!user.whatsapp || !novoTexto.trim()}
                sx={{ ml: 1, height: '56px' }}
              >
                Enviar
              </Button>
            </Box>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Registros de Faturamento</Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleAbrirDialogRegistro()}
              >
                Novo Registro
              </Button>
            </Box>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Faturamento</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Observações</TableCell>
                    <TableCell align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registros.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Nenhum registro de faturamento encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    registros
                      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                      .map((registro) => (
                        <TableRow key={registro.data}>
                          <TableCell>{formatarData(new Date(registro.data))}</TableCell>
                          <TableCell>{formatarValor(registro.faturamento)}</TableCell>
                          <TableCell>{registro.descricao}</TableCell>
                          <TableCell>{registro.observacoes}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleAbrirDialogRegistro(true, registro)}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardHeader 
              title="Informações de Configuração" 
              avatar={<InfoIcon color="primary" />}
            />
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                WhatsApp Configurado
              </Typography>
              <Typography variant="body2" paragraph color={user.whatsapp ? 'textPrimary' : 'error'}>
                {user.whatsapp 
                  ? `+${user.whatsapp}` 
                  : 'Não configurado. Configure no seu perfil.'}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Horário de Funcionamento
              </Typography>
              {user.horarioFuncionamento ? (
                <>
                  <Typography variant="body2" paragraph>
                    <strong>Abertura:</strong> {user.horarioFuncionamento.horarioAbertura}
                    <br />
                    <strong>Fechamento:</strong> {user.horarioFuncionamento.horarioFechamento}
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Dias de Funcionamento:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {user.horarioFuncionamento.diasFuncionamento.map((dia) => (
                      <Chip 
                        key={dia} 
                        label={dia} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    ))}
                  </Box>
                </>
              ) : (
                <Typography variant="body2" color="error">
                  Horários não configurados. Configure no seu perfil.
                </Typography>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Envio Automático
              </Typography>
              <Typography variant="body2" paragraph>
                {envioAutomatico ? (
                  <Chip 
                    icon={<CheckIcon />} 
                    label="Ativado" 
                    color="success" 
                    size="small" 
                  />
                ) : (
                  <Chip 
                    icon={<CloseIcon />} 
                    label="Desativado" 
                    color="error" 
                    size="small" 
                  />
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Quando ativado, o sistema enviará automaticamente uma mensagem no horário de fechamento, perguntando sobre o faturamento do dia.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Dialog para adicionar/editar registro */}
      <Dialog open={dialogAberto} onClose={handleFecharDialogRegistro} fullWidth maxWidth="sm">
        <DialogTitle>
          {modoEdicao ? 'Editar Registro de Faturamento' : 'Novo Registro de Faturamento'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data"
                name="data"
                type="date"
                value={novoRegistro.data}
                onChange={handleInputRegistroChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Faturamento"
                name="faturamento"
                value={novoRegistro.faturamento}
                onChange={handleInputRegistroChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">€</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                name="descricao"
                value={novoRegistro.descricao}
                onChange={handleInputRegistroChange}
                placeholder="Descreva como foi o movimento do dia"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Observações"
                name="observacoes"
                value={novoRegistro.observacoes}
                onChange={handleInputRegistroChange}
                multiline
                rows={2}
                placeholder="Adicione observações importantes sobre o dia"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFecharDialogRegistro} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSalvarRegistro} color="primary" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para notificações */}
      <Snackbar
        open={statusEnvio.show}
        autoHideDuration={6000}
        onClose={handleFecharSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleFecharSnackbar} 
          severity={statusEnvio.success ? 'success' : 'error'} 
          variant="filled"
        >
          {statusEnvio.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Whatsapp; 