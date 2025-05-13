import React from 'react';
import { Paper, Box, Typography, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface CardResumoProps {
  titulo: string;
  valor: string;
  icone?: 'saldo' | 'entrada' | 'saida' | 'resultado';
  corDestaque?: string;
  percentual?: number;
  textoVariacao?: string;
}

/**
 * Componente de cartão de resumo para exibir KPIs financeiros
 * 
 * @param props - Propriedades do componente
 * @returns Componente de cartão de resumo
 */
const CardResumo: React.FC<CardResumoProps> = ({
  titulo,
  valor,
  icone = 'saldo',
  corDestaque,
  percentual,
  textoVariacao,
}) => {
  const theme = useTheme();
  
  // Configurar ícones e cores baseados no tipo do cartão
  const icones = {
    saldo: <AccountBalanceWalletIcon fontSize="large" />,
    entrada: <TrendingUpIcon fontSize="large" />,
    saida: <TrendingDownIcon fontSize="large" />,
    resultado: percentual && percentual >= 0 ? <TrendingUpIcon fontSize="large" /> : <TrendingDownIcon fontSize="large" />
  };

  const cor = corDestaque || (icone === 'entrada' || (icone === 'resultado' && percentual && percentual >= 0) 
    ? theme.palette.success.main 
    : icone === 'saida' || (icone === 'resultado' && percentual && percentual < 0) 
      ? theme.palette.error.main 
      : theme.palette.primary.main);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        borderLeft: `4px solid ${cor}`,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h6" color="textSecondary">
          {titulo}
        </Typography>
        <Box sx={{ 
          color: cor,
          p: 1,
          borderRadius: '50%',
          bgcolor: `${cor}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icones[icone]}
        </Box>
      </Box>
      <Typography variant="h4" component="div" fontWeight="bold" sx={{ my: 1 }}>
        {valor}
      </Typography>
      
      {percentual !== undefined && textoVariacao && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: percentual >= 0 ? theme.palette.success.main : theme.palette.error.main 
        }}>
          {percentual >= 0 
            ? <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} /> 
            : <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />}
          <Typography variant="body2" component="span">
            {Math.abs(percentual).toFixed(1)}% {textoVariacao}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default CardResumo; 