import { Theme } from '@mui/material';

export type TipoEvento = 'vencido' | 'venceHoje' | 'futuro' | 'feriado' | 'ferias';

export const getCoresEventos = (theme: Theme) => {
  return {
    vencido: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      borderColor: theme.palette.error.dark
    },
    venceHoje: {
      backgroundColor: theme.palette.warning.main,
      color: theme.palette.warning.contrastText,
      borderColor: theme.palette.warning.dark
    },
    futuro: {
      backgroundColor: theme.palette.success.main,
      color: theme.palette.success.contrastText,
      borderColor: theme.palette.success.dark
    },
    feriado: {
      backgroundColor: theme.palette.info.light,
      color: theme.palette.info.contrastText,
      borderColor: theme.palette.info.main
    },
    ferias: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.contrastText,
      borderColor: theme.palette.secondary.main
    }
  };
};

export const getTipoEvento = (data: Date, vencimento: Date): TipoEvento => {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  
  const dataEvento = new Date(vencimento);
  dataEvento.setHours(0, 0, 0, 0);
  
  if (dataEvento < hoje) {
    return 'vencido';
  } else if (dataEvento.getTime() === hoje.getTime()) {
    return 'venceHoje';
  } else {
    return 'futuro';
  }
}; 