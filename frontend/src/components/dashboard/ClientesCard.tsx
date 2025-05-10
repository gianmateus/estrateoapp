import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Chip,
  Grid
} from '@mui/material';
import {
  Business as BusinessIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  HourglassEmpty as HourglassIcon,
  ArchiveOutlined as ArchiveIcon,
  ContactPhone as ContactIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';
import { ClienteStats } from '../../types/clienteTypes';

const ClientesCard: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [statusCount, setStatusCount] = useState<ClienteStats>({
    ativo: 0,
    inativo: 0,
    prospecto: 0,
    arquivado: 0
  });
  const [totalClientes, setTotalClientes] = useState<number>(0);
  const [tipoCount, setTipoCount] = useState<{pessoa_fisica: number, pessoa_juridica: number}>({
    pessoa_fisica: 0,
    pessoa_juridica: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obter contagem por status
        const responseStatus = await api.get('/clientes/clientes-por-status');
        const statusData = responseStatus.data as ClienteStats;
        setStatusCount(statusData);
        
        // Calcular total de clientes
        let total = 0;
        total += statusData.ativo || 0;
        total += statusData.inativo || 0;
        total += statusData.prospecto || 0;
        total += statusData.arquivado || 0;
        setTotalClientes(total);
        
        // Obter contagem por tipo
        const responseTipo = await api.get('/clientes/clientes-por-tipo');
        setTipoCount(responseTipo.data);
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados de clientes:', error);
        // Usar dados mockados em caso de erro
        setStatusCount({
          ativo: 15,
          inativo: 3,
          prospecto: 8,
          arquivado: 2
        });
        setTotalClientes(28);
        setTipoCount({
          pessoa_fisica: 18,
          pessoa_juridica: 10
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ContactIcon sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="h6" component="div">
            {t('dashboard.clientes.titulo')}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {t('dashboard.clientes.descricao')}
        </Typography>
        
        <Box sx={{ mt: 2, mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle1">
                {t('dashboard.clientes.total')}: {totalClientes}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Chip 
                  icon={<PersonIcon />} 
                  label={`${t('cliente.pessoaFisica')}: ${tipoCount.pessoa_fisica}`} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  icon={<BusinessIcon />} 
                  label={`${t('cliente.pessoaJuridica')}: ${tipoCount.pessoa_juridica}`} 
                  size="small" 
                  color="secondary" 
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        <Divider />
        
        <List dense>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText 
              primary={`${t('cliente.status.ativo')}: ${statusCount.ativo}`} 
              secondary={`${Math.round((statusCount.ativo / totalClientes) * 100)}%`} 
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <HourglassIcon color="info" />
            </ListItemIcon>
            <ListItemText 
              primary={`${t('cliente.status.prospecto')}: ${statusCount.prospecto}`} 
              secondary={`${Math.round((statusCount.prospecto / totalClientes) * 100)}%`}
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <CancelIcon color="error" />
            </ListItemIcon>
            <ListItemText 
              primary={`${t('cliente.status.inativo')}: ${statusCount.inativo}`} 
              secondary={`${Math.round((statusCount.inativo / totalClientes) * 100)}%`}
            />
          </ListItem>
          
          <ListItem>
            <ListItemIcon>
              <ArchiveIcon color="warning" />
            </ListItemIcon>
            <ListItemText 
              primary={`${t('cliente.status.arquivado')}: ${statusCount.arquivado}`} 
              secondary={`${Math.round((statusCount.arquivado / totalClientes) * 100)}%`}
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default ClientesCard; 