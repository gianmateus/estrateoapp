import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardHeader,
  CardActions,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme as useMuiTheme,
  LinearProgress,
} from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';

/**
 * Componente que demonstra os cards refinados do sistema
 */
const CardDemo = () => {
  const { mode, toggleTheme } = useTheme();
  const theme = useMuiTheme();
  const [open, setOpen] = React.useState(false);

  // Componente simples de gráfico para substituir o Chart.js
  const SimpleChart = () => (
    <Box sx={{ width: '100%', height: '250px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', height: '200px', width: '100%', mb: 2 }}>
        {[65, 40, 85, 60, 75, 90].map((value, index) => (
          <Box
            key={index}
            sx={{
              height: `${value}%`,
              width: `calc(100% / 6 - 8px)`,
              mx: 0.5,
              bgcolor: theme.palette.primary.main,
              borderRadius: '4px 4px 0 0',
              position: 'relative',
              '&:hover': {
                bgcolor: theme.palette.primary.dark,
                '&::after': {
                  content: `"${value}%"`,
                  position: 'absolute',
                  top: '-25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bgcolor: theme.palette.primary.dark,
                  color: 'white',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '12px',
                },
              },
            }}
          />
        ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', px: 0.5 }}>
        {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'].map((month, index) => (
          <Typography key={index} variant="caption" sx={{ width: `calc(100% / 6)`, textAlign: 'center' }}>
            {month}
          </Typography>
        ))}
      </Box>
    </Box>
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h1" gutterBottom>
        Demonstração de Cards Refinados
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body1">
          Modo atual: <strong>{mode === 'light' ? 'Claro' : 'Escuro'}</strong>
        </Typography>
        <Button 
          variant="outlined" 
          onClick={toggleTheme}
          size="small"
        >
          Alternar Tema
        </Button>
        <Button 
          variant="contained" 
          onClick={handleClickOpen}
          size="small"
        >
          Abrir Modal
        </Button>
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h2" gutterBottom>
        1. Cards em Diferentes Contextos
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Card de Métricas */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Métricas Principais
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Faturamento Mensal
                  </Typography>
                  <Typography variant="h4">
                    R$ 125.430
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" align="right" display="block">
                    Crescimento
                  </Typography>
                  <Typography variant="h4" color="success.main" align="right">
                    +12,5%
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Novos Clientes
                  </Typography>
                  <Typography variant="h6">
                    37
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" align="right" display="block">
                    Meta
                  </Typography>
                  <Typography variant="h6" align="right">
                    50
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Card de Gráfico */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title="Evolução de Vendas"
              subheader="Últimos 6 meses"
              action={
                <IconButton aria-label="settings">
                  <MoreVertIcon />
                </IconButton>
              }
            />
            <CardContent>
              <SimpleChart />
            </CardContent>
            <CardActions>
              <Button size="small">Exportar</Button>
              <Button size="small">Ver Detalhes</Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Card de Tabela */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Últimas Transações"
              subheader="Atualizado há 5 minutos"
            />
            <CardContent sx={{ pb: 0 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Cliente</TableCell>
                      <TableCell>Produto</TableCell>
                      <TableCell align="right">Valor</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Empresa A</TableCell>
                      <TableCell>Serviço Premium</TableCell>
                      <TableCell align="right">R$ 3.500</TableCell>
                      <TableCell align="right">
                        <Chip
                          label="Pago"
                          size="small"
                          color="success"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Empresa B</TableCell>
                      <TableCell>Consultoria</TableCell>
                      <TableCell align="right">R$ 8.200</TableCell>
                      <TableCell align="right">
                        <Chip
                          label="Pendente"
                          size="small"
                          color="warning"
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Empresa C</TableCell>
                      <TableCell>Licença Anual</TableCell>
                      <TableCell align="right">R$ 12.000</TableCell>
                      <TableCell align="right">
                        <Chip
                          label="Processando"
                          size="small"
                          color="info"
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <CardActions>
              <Button size="small">Ver Todos</Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Card de Perfil */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>JD</Avatar>
              }
              title="João da Silva"
              subheader="Gerente Financeiro"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                Responsável pela área financeira há 3 anos, com foco em planejamento e execução orçamentária.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label="Finanças" size="small" />
                <Chip label="Estratégia" size="small" />
                <Chip label="Dashboard" size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">
                  <strong>Última atividade:</strong> 14 minutos atrás
                </Typography>
                <Chip 
                  label="Online" 
                  size="small"
                  color="success"
                />
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small">Ver Perfil Completo</Button>
              <Button size="small">Enviar Mensagem</Button>
            </CardActions>
          </Card>
        </Grid>
        
        {/* Card de Progresso */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Progresso de Projetos"
              subheader="Últimas atualizações"
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" gutterBottom>Redesign do Portal</Typography>
                  <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Início: 10/03</Typography>
                    <Typography variant="caption" color="text.secondary">Prazo: 30/06</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" gutterBottom>Implementação ERP</Typography>
                  <LinearProgress variant="determinate" value={45} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Início: 05/04</Typography>
                    <Typography variant="caption" color="text.secondary">Prazo: 15/08</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="body2" gutterBottom>App Mobile</Typography>
                  <LinearProgress variant="determinate" value={90} sx={{ height: 8, borderRadius: 4, mb: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">Início: 02/02</Typography>
                    <Typography variant="caption" color="text.secondary">Prazo: 01/06</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h2" gutterBottom>
        2. Especificações Aplicadas
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Detalhes de Estilo
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Bordas:</strong> radius de 16px (1rem) em todos os cards
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Sombra:</strong> box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) no modo claro
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Sombra (modo escuro):</strong> box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2)
              </Typography>
              <Typography variant="body1">
                <strong>Efeito hover:</strong> Sombra levemente ampliada para feedback visual
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Implementação Técnica
              </Typography>
              <Typography variant="body1" paragraph>
                A customização foi implementada globalmente através do Material-UI Theme Provider no contexto do tema:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ 
                p: 2, 
                bgcolor: mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
                borderRadius: 1,
                overflow: 'auto'
              }}>
{`MuiCard: {
  styleOverrides: {
    root: {
      backgroundColor: mode === 'light' ? COLORS.WHITE : COLORS.GRAY_DARKEST,
      borderRadius: '16px',
      boxShadow: mode === 'light' 
        ? '0 4px 20px rgba(0, 0, 0, 0.1)'
        : '0 4px 20px rgba(0, 0, 0, 0.2)',
      transition: 'box-shadow 0.3s ease, transform 0.2s ease',
      '&:hover': {
        boxShadow: mode === 'light'
          ? '0 6px 24px rgba(0, 0, 0, 0.12)'
          : '0 6px 24px rgba(0, 0, 0, 0.25)',
      },
      overflow: 'hidden',
    }
  }
}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Dialog/Modal com visual de card */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
          }
        }}
      >
        <DialogTitle id="modal-title" sx={{ pr: 8 }}>
          Modal com Estilo de Card
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Typography paragraph>
            Este modal também aplica o estilo de card refinado, com as mesmas bordas arredondadas e sombras sutis.
          </Typography>
          <Typography paragraph>
            A implementação garante consistência visual em toda a aplicação, inclusive em componentes como modais e popups que seguem a mesma identidade visual.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleClose} variant="contained">Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CardDemo; 