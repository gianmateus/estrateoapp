import React from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface DadoSaldo {
  data: string;
  saldo: number;
}

interface GraficoLinhaSaldoProps {
  titulo: string;
  dados: DadoSaldo[];
  altura?: number;
}

/**
 * Componente de gráfico de linha para exibir a variação diária de saldo
 * 
 * @param props - Propriedades do componente
 * @returns Componente de gráfico de linha
 */
const GraficoLinhaSaldo: React.FC<GraficoLinhaSaldoProps> = ({
  titulo,
  dados,
  altura = 300
}) => {
  const theme = useTheme();

  // Formatar valor para exibir em euros
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor);
  };

  // Encontra o valor mínimo e máximo para ajustar a escala do gráfico
  const minValue = Math.min(...dados.map(item => item.saldo));
  const maxValue = Math.max(...dados.map(item => item.saldo));
  const range = maxValue - minValue;
  
  // Ajusta para garantir espaço no topo e na base do gráfico
  const domainMin = Math.floor(minValue - range * 0.1);
  const domainMax = Math.ceil(maxValue + range * 0.1);

  // Renderiza uma célula personalizada para o tooltip
  const renderTooltipContent = (props: any) => {
    const { payload } = props;
    if (payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ p: 1, borderRadius: 1, boxShadow: 2 }}>
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
            {data.data}
          </Typography>
          <Typography variant="body2">
            Saldo: {formatarValor(data.saldo)}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" color="textSecondary" sx={{ mb: 2 }}>
        {titulo}
      </Typography>
      
      {dados.length > 0 ? (
        <Box sx={{ height: altura, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={dados}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
              <XAxis 
                dataKey="data" 
                stroke={theme.palette.text.secondary}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[domainMin, domainMax]}
                stroke={theme.palette.text.secondary}
                tick={{ fontSize: 12 }}
                tickFormatter={formatarValor} 
              />
              <Tooltip content={renderTooltipContent} />
              <ReferenceLine y={0} stroke={theme.palette.divider} />
              <Line
                type="monotone"
                dataKey="saldo"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
                dot={{ stroke: theme.palette.primary.main, strokeWidth: 2, r: 4 }}
                activeDot={{ stroke: theme.palette.primary.main, strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box sx={{ height: altura, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Sem dados disponíveis
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default GraficoLinhaSaldo; 