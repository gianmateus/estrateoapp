/**
 * Componente KPICards - Cards com indicadores principais do dashboard
 * Component KPICards - Main dashboard indicator cards
 * 
 * Exibe os indicadores-chave de desempenho em cards organizados
 * Displays key performance indicators in organized cards
 */

import React from 'react';
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Inventory as InventoryIcon,
  Person as PersonIcon,
  BeachAccess as BeachAccessIcon,
} from '@mui/icons-material';
import MetricCard from '../ui/MetricCard';
import { formatCurrency } from '../../utils/formatters';

interface KPICardsProps {
  currentBalance: number;
  incomeToday: number;
  expenseToday: number;
  stockItems: number;
  employeesOnVacation: number;
  activeUsers: number;
}

const KPICards: React.FC<KPICardsProps> = ({
  currentBalance,
  incomeToday,
  expenseToday,
  stockItems,
  employeesOnVacation,
  activeUsers
}) => {
  const { t } = useTranslation();
  
  // Array de métricas para facilitar a renderização e manutenção
  // Metrics array to facilitate rendering and maintenance
  const metrics = [
    {
      id: 'currentBalance',
      title: t('saldoAtual'),
      value: formatCurrency(currentBalance),
      icon: <MoneyIcon />,
      iconBg: 'rgba(25, 118, 210, 0.15)', // primary.main + 15% opacity
      color: 'primary.main'
    },
    {
      id: 'incomeToday',
      title: t('receitaHoje'),
      value: formatCurrency(incomeToday),
      icon: <TrendingUpIcon />,
      iconBg: 'rgba(46, 125, 50, 0.15)', // success.main + 15% opacity
      color: 'success.main'
    },
    {
      id: 'expenseToday',
      title: t('despesaHoje'),
      value: formatCurrency(expenseToday),
      icon: <TrendingDownIcon />,
      iconBg: 'rgba(211, 47, 47, 0.15)', // error.main + 15% opacity
      color: 'error.main'
    },
    {
      id: 'stockItems',
      title: t('itensEmEstoque'),
      value: stockItems.toString(),
      icon: <InventoryIcon />,
      iconBg: 'rgba(2, 136, 209, 0.15)', // info.main + 15% opacity
      color: 'info.main'
    },
    {
      id: 'employeesOnVacation',
      title: t('funcionariosEmFerias'),
      value: employeesOnVacation.toString(),
      icon: <BeachAccessIcon />,
      iconBg: 'rgba(156, 39, 176, 0.15)', // purple + 15% opacity
      color: 'secondary.main'
    },
    {
      id: 'activeUsers',
      title: t('usuariosAtivos'),
      value: activeUsers.toString(),
      icon: <PersonIcon />,
      iconBg: 'rgba(245, 124, 0, 0.15)', // orange + 15% opacity
      color: 'warning.main'
    }
  ];

  return (
    <Grid container spacing={3}>
      {metrics.map((metric) => (
        <Grid item xs={12} sm={6} md={4} key={metric.id}>
          <MetricCard
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            iconBg={metric.iconBg}
            color={metric.color}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default KPICards; 