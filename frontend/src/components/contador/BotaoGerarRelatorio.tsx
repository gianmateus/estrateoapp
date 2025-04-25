/**
 * Report generation button component for the Contador (Accountant) module
 * Displays a button that triggers PDF report generation
 * 
 * Componente de botão de geração de relatório para o módulo Contador
 * Exibe um botão que aciona a geração de relatório em PDF
 */
import React from 'react';
import { 
  Button, 
  CircularProgress,
  ButtonProps,
  Typography
} from '@mui/material';
import { PictureAsPdf } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface BotaoGerarRelatorioProps {
  onClick: () => void;  // Click handler function / Função de tratamento de clique
  loading: boolean;     // Loading state / Estado de carregamento
  size?: 'small' | 'medium' | 'large'; // Button size / Tamanho do botão
  color?: ButtonProps['color']; // Button color / Cor do botão
}

/**
 * PDF report generation button with loading state
 * 
 * Botão de geração de relatório PDF com estado de carregamento
 */
const BotaoGerarRelatorio: React.FC<BotaoGerarRelatorioProps> = ({ 
  onClick, 
  loading, 
  size = 'large',
  color = 'primary'
}) => {
  const { t } = useTranslation();
  
  return (
    <Button
      variant="contained"
      color={color}
      size={size}
      startIcon={loading ? undefined : <PictureAsPdf />}
      onClick={onClick}
      disabled={loading}
      sx={{ 
        minWidth: 250,
        py: 1.5,
        fontWeight: 'bold',
        boxShadow: 2,
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: 3,
        },
      }}
    >
      {loading ? (
        <>
          <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
          <Typography variant="button">{t('carregando')}</Typography>
        </>
      ) : (
        t('contador.gerarRelatorio')
      )}
    </Button>
  );
};

export default BotaoGerarRelatorio; 