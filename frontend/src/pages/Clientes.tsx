import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Chip,
  Skeleton,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  Person as PersonIcon,
  Business as BusinessIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useClientes } from '../contexts/ClientesProvider';

/**
 * Página de listagem de Clientes
 */
const Clientes: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { clientes, isLoading, error, fetchClientes } = useClientes();
  
  // Carregar clientes ao montar o componente
  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);
  
  // Navegação para página de detalhes
  const handleClienteClick = (id: string) => {
    navigate(`/clientes/${id}`);
  };
  
  // Navegação para página de novo cliente
  const handleAddCliente = () => {
    navigate('/clientes/novo');
  };
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('clientes.titulo', 'Clientes')}
        </Typography>
        <Paper sx={{ p: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography>{t('clientes.erro', 'Erro ao carregar dados de clientes')}</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => fetchClientes()}
            sx={{ mt: 2 }}
          >
            {t('tentar_novamente', 'Tentar novamente')}
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          {t('clientes.titulo', 'Clientes')}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />} 
          onClick={handleAddCliente}
        >
          {t('clientes.adicionar', 'Adicionar Cliente')}
        </Button>
      </Box>
      
      {isLoading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card elevation={2}>
                <CardContent>
                  <Skeleton variant="text" height={30} width="60%" />
                  <Skeleton variant="text" height={20} width="40%" />
                  <Skeleton variant="text" height={20} width="80%" />
                  <Skeleton variant="text" height={20} width="70%" />
                </CardContent>
                <CardActions>
                  <Skeleton variant="rectangular" height={40} width={100} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <Grid item xs={12} sm={6} md={4} key={cliente.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                  onClick={() => handleClienteClick(cliente.id)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      {cliente.tipo === 'pessoa_juridica' ? (
                        <BusinessIcon color="primary" sx={{ mr: 1 }} />
                      ) : (
                        <PersonIcon color="primary" sx={{ mr: 1 }} />
                      )}
                      <Typography variant="h6" component="div" noWrap>
                        {cliente.nome}
                      </Typography>
                    </Box>
                    
                    {cliente.empresa && (
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                        {cliente.empresa}
                      </Typography>
                    )}
                    
                    {cliente.email && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {cliente.email}
                      </Typography>
                    )}
                    
                    {cliente.telefone && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {cliente.telefone}
                      </Typography>
                    )}
                    
                    <Divider sx={{ my: 1 }} />
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Chip 
                        label={cliente.status} 
                        size="small"
                        color={
                          cliente.status === 'ativo' ? 'success' :
                          cliente.status === 'prospecto' ? 'info' :
                          cliente.status === 'inativo' ? 'default' : 
                          'error'
                        }
                      />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(cliente.dataCadastro).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Box 
              width="100%" 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              py={6}
            >
              <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" align="center">
                {t('clientes.sem_registros', 'Nenhum cliente encontrado')}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                {t('clientes.adicione_primeiro', 'Adicione seu primeiro cliente para começar')}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleAddCliente}
              >
                {t('clientes.adicionar', 'Adicionar Cliente')}
              </Button>
            </Box>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default Clientes; 