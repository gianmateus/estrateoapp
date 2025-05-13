import React, { useState } from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import FuncionariosCard from '../../components/dashboard/FuncionariosCard';
import ClientesCard from '../../components/dashboard/ClientesCard';
import { RelatorioModalDashboard } from '../../components/Relatorios/RelatorioModalDashboard';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          {t('visaoGeralEmpresa')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          Gerar Relatório
        </Button>
      </Box>
      <RelatorioModalDashboard open={openModal} onClose={() => setOpenModal(false)} />
      <Grid container spacing={3}>
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