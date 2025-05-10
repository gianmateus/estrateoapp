import React from 'react';
import { Button, Box } from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PaymentData } from './PayrollPage';

interface ExportButtonProps {
  payments: PaymentData[];
  monthYear: { month: number; year: number };
}

const ExportButton: React.FC<ExportButtonProps> = ({ payments, monthYear }) => {
  const { t } = useTranslation();

  // Função para gerar o nome do mês
  const getNomeMes = (mes: number): string => {
    const meses = [
      t('janeiro'), t('fevereiro'), t('marco'), t('abril'),
      t('maio'), t('junho'), t('julho'), t('agosto'),
      t('setembro'), t('outubro'), t('novembro'), t('dezembro')
    ];
    
    return meses[mes - 1];
  };

  // Manipulador para exportar a folha de pagamento
  const handleExportPDF = () => {
    // Em uma implementação real, aqui seria feita a geração do PDF
    // Usando bibliotecas como jsPDF ou react-pdf
    
    const fileName = `folha_pagamento_${getNomeMes(monthYear.month)}_${monthYear.year}.pdf`;
    alert(`${t('exportandoPDF')} ${fileName}`);
    
    console.log('Dados para exportação:', payments);
    
    // Futura implementação:
    // 1. Gerar um PDF com cabeçalho do Estrateo
    // 2. Adicionar resumo dos pagamentos (totais)
    // 3. Criar tabela com todos os pagamentos
    // 4. Permitir o download do arquivo
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
      <Button
        variant="outlined"
        color="primary"
        startIcon={<PdfIcon />}
        onClick={handleExportPDF}
        disabled={payments.length === 0}
      >
        {t('exportarPDF')}
      </Button>
    </Box>
  );
};

export default ExportButton; 