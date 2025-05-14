import React from 'react';
import { Box } from '@mui/material';
import ResumoFinanceiro from '../modules/financeiro/ResumoFinanceiro';
import ContasAPagar from '../modules/financeiro/ContasAPagar';
import ContasAReceber from '../modules/financeiro/ContasAReceber';

interface FinanceiroProps {
  route?: 'resumo' | 'contas-a-pagar' | 'contas-a-receber';
}

/**
 * Página do módulo Financeiro
 * Suporta diferentes visualizações: Resumo Financeiro, Contas a Pagar e Contas a Receber
 * 
 * @param {FinanceiroProps} props - Propriedades do componente
 * @returns Componente da página Financeiro
 */
const Financeiro: React.FC<FinanceiroProps> = ({ route = 'resumo' }) => {
  // Renderizar o componente adequado com base na rota
  const renderContent = () => {
    switch (route) {
      case 'contas-a-pagar':
        return <ContasAPagar />;
      case 'contas-a-receber':
        return <ContasAReceber />;
      default:
        return <ResumoFinanceiro />;
    }
  };

  return (
    <Box>
      {renderContent()}
    </Box>
  );
};

export default Financeiro;