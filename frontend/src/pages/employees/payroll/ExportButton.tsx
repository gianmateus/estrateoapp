import React from 'react';
import { Button, Box, Tooltip } from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { PaymentData } from './PayrollPage';

interface ExportButtonProps {
  payments: PaymentData[];
  monthYear: { month: number; year: number };
}

const ExportButton: React.FC<ExportButtonProps> = ({ payments, monthYear }) => {
  const { t } = useTranslation();
  const isDisabled = payments.length === 0;

  // Função para gerar o nome do mês
  const getNomeMes = (mes: number): string => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril',
      'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    
    return meses[mes - 1];
  };

  // Manipulador para exportar a folha de pagamento
  const handleExportPDF = () => {
    // Em uma implementação real, aqui seria feita a geração do PDF
    // Usando bibliotecas como jsPDF ou react-pdf
    
    const fileName = `folha_pagamento_${getNomeMes(monthYear.month)}_${monthYear.year}.pdf`;
    console.log('Gerando PDF:', fileName);
    
    // Formato de dados para exportação:
    // 1. Cabeçalho: Nome da empresa, mês/ano, data de geração
    // 2. Tabela com colunas: Funcionário, Valor Bruto, Descontos, Valor Líquido
    // 3. Rodapé com totais
    
    const dadosExportacao = {
      cabecalho: {
        empresa: 'Estrateo',
        periodo: `${getNomeMes(monthYear.month)} ${monthYear.year}`,
        dataGeracao: new Date().toLocaleDateString('pt-BR')
      },
      funcionarios: payments.map(payment => ({
        nome: payment.employeeName,
        valorBruto: payment.grossAmount,
        descontos: payment.deductions,
        valorLiquido: payment.netAmount,
        status: payment.status
      })),
      totais: {
        valorBruto: payments.reduce((total, p) => total + p.grossAmount, 0),
        descontos: payments.reduce((total, p) => total + p.deductions, 0),
        valorLiquido: payments.reduce((total, p) => total + p.netAmount, 0)
      }
    };
    
    console.log('Dados para exportação:', dadosExportacao);
    
    // Apenas para fins de demonstração
    alert(`Exportando PDF: ${fileName}`);
  };

  const exportButton = (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<PdfIcon />}
      onClick={handleExportPDF}
      disabled={isDisabled}
    >
      Exportar PDF
    </Button>
  );

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
      {isDisabled ? (
        <Tooltip title="Adicione um pagamento para exportar">
          <span>{exportButton}</span>
        </Tooltip>
      ) : (
        exportButton
      )}
    </Box>
  );
};

export default ExportButton; 