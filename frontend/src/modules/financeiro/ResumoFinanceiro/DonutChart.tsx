import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DataItem {
  label: string;
  value: number;
}

interface DonutChartProps {
  title: string;
  data: DataItem[];
  type: 'income' | 'expense';
}

const DonutChart: React.FC<DonutChartProps> = ({ title, data, type }) => {
  const theme = useTheme();
  
  // Paletas de cores - tons harmonizados
  const COLOR_PALETTES = {
    income: ['#2ECC71', '#27AE60', '#58D68D', '#82E0AA', '#ABEBC6', '#D4EFDF'],
    expense: ['#E74C3C', '#C0392B', '#EC7063', '#F1948A', '#F5B7B1', '#FADBD8']
  };

  // Selecionando a paleta apropriada
  const colors = COLOR_PALETTES[type];

  // Calculando o total para percentuais
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Formatador de valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  // Componente customizado para o tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.value / total) * 100).toFixed(1);
      
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            padding: 1.5,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            boxShadow: theme.shadows[3]
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {item.label}
          </Typography>
          <Typography variant="body2" sx={{ color: payload[0].color }}>
            {formatCurrency(item.value)} ({percentage}%)
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Componente customizado para renderizar o label central
  const CenterLabel = () => (
    <g>
      <text
        x="50%"
        y="48%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: '1rem',
          fontWeight: 500,
          fill: theme.palette.text.primary
        }}
      >
        Total
      </text>
      <text
        x="50%"
        y="58%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontSize: '1.2rem',
          fontWeight: 700,
          fill: type === 'income' ? '#2ECC71' : '#E74C3C'
        }}
      >
        {formatCurrency(total)}
      </text>
    </g>
  );

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        padding: 2,
        height: '100%',
        boxShadow: theme.shadows[2],
        '&:hover': {
          boxShadow: theme.shadows[4]
        },
        transition: 'box-shadow 0.3s'
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 1,
          fontWeight: 600,
          textAlign: 'center',
          color: type === 'income' ? '#27AE60' : '#C0392B'
        }}
      >
        {title}
      </Typography>

      <Box sx={{ height: 300, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={2}
              dataKey="value"
              nameKey="label"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <CenterLabel />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      {/* Legenda embutida */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 1,
          mt: 2
        }}
      >
        {data.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: colors[index % colors.length]
              }}
            />
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DonutChart; 