import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FuncionariosCard from '../../components/dashboard/FuncionariosCard';
import ClientesCard from '../../components/dashboard/ClientesCard';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        {t('visaoGeralEmpresa')}
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Cards de Funcionários e Clientes */}
        <Grid item xs={12} md={6}>
          <FuncionariosCard />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <ClientesCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage; 