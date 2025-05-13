import React from 'react';
import { Box } from '@mui/material';
import ResumoFinanceiro from '../modules/financeiro/ResumoFinanceiro';

/**
 * Página de Resumo Financeiro
 * Agora mostra uma visão geral das finanças com KPIs e gráficos
 * 
 * @returns Componente de página de Resumo Financeiro
 */
const Financeiro: React.FC = () => {
  return (
    <Box>
      <ResumoFinanceiro />
    </Box>
  );
};

export default Financeiro;