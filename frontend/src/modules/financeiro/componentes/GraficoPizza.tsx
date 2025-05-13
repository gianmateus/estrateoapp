import React from 'react';
import { Paper, Typography, Box, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DadoCategoria {
  name: string;
  value: number;
}

interface GraficoPizzaProps {
  titulo: string;
  dados: DadoCategoria[];
  altura?: number;
  cores?: string[];
}

/**
 * Componente de gráfico pizza para visualizar distribuição por categoria
 * 
 * @param props - Propriedades do componente
 * @returns Componente de gráfico pizza
 */
const GraficoPizza: React.FC<GraficoPizzaProps> = ({
  titulo,
  dados,
  altura = 300,
  cores
}) => {
  const theme = useTheme();

  // Cores padrão do gráfico se não forem fornecidas
  const coresPadrao = cores || [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff8042',
    '#0088FE',
    '#00C49F'
  ];

  // Formatar valor para exibir em euros
  const formatarValor = (valor: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor);
  };

  // Renderiza uma célula personalizada para o tooltip
  const renderTooltipContent = (props: any) => {
    const { payload } = props;
    if (payload && payload.length > 0) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ p: 1, borderRadius: 1, boxShadow: 2 }}>
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5 }}>
            {data.name}
          </Typography>
          <Typography variant="body2">
            {formatarValor(data.value)}
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
            <PieChart>
              <Pie
                data={dados}
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="70%"
                paddingAngle={2}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
              >
                {dados.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={coresPadrao[index % coresPadrao.length]} 
                    stroke={theme.palette.background.paper}
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={renderTooltipContent} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
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

export default GraficoPizza; 