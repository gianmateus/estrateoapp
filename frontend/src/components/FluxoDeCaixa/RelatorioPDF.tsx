import React, { useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { 
  FileDownload as DownloadIcon,
  PictureAsPdf as PdfIcon 
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Transacao } from '../../contexts/FinanceiroContext';

// Interfaces
interface RelatorioPDFProps {
  transacoes: Transacao[];
  periodo: {
    inicio: string;
    fim: string;
  };
  estatisticas: {
    totalEntradas: number;
    totalSaidas: number;
    saldoFinal: number;
  };
}

const RelatorioPDF: React.FC<RelatorioPDFProps> = ({
  transacoes,
  periodo,
  estatisticas
}) => {
  const { t } = useTranslation();
  const [gerando, setGerando] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Formatar moeda para exibição
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(valor);
  };
  
  // Gerar e fazer download do PDF
  const gerarPDF = async () => {
    if (transacoes.length === 0) {
      return;
    }
    
    setGerando(true);
    
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(18);
      doc.text(t('fluxoCaixa.titulo') || 'Fluxo de Caixa', 105, 15, { align: 'center' });
      
      // Período
      doc.setFontSize(12);
      doc.text(
        `${t('fluxoCaixa.periodo') || 'Período'}: ${format(new Date(periodo.inicio), 'dd/MM/yyyy')} - ${format(new Date(periodo.fim), 'dd/MM/yyyy')}`,
        105, 25, { align: 'center' }
      );
      
      // Resumo financeiro
      doc.setFontSize(14);
      doc.text(t('fluxoCaixa.resumoFinanceiro') || 'Resumo Financeiro', 20, 40);
      
      // Tabela de resumo
      (doc as any).autoTable({
        startY: 45,
        head: [[
          t('fluxoCaixa.totalEntradas') || 'Total Entradas', 
          t('fluxoCaixa.totalSaidas') || 'Total Saídas', 
          t('fluxoCaixa.saldoFinal') || 'Saldo Final'
        ]],
        body: [[
          `€ ${estatisticas.totalEntradas.toFixed(2)}`,
          `€ ${estatisticas.totalSaidas.toFixed(2)}`,
          `€ ${estatisticas.saldoFinal.toFixed(2)}`
        ]],
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] }
      });
      
      // Movimentações detalhadas
      doc.setFontSize(14);
      doc.text(t('fluxoCaixa.movimentacoesDetalhadas') || 'Movimentações Detalhadas', 20, (doc as any).lastAutoTable.finalY + 15);
      
      // Preparar dados para tabela de movimentações
      const movimentacoes = transacoes.map(transacao => [
        format(new Date(transacao.data), 'dd/MM/yyyy'),
        transacao.tipo === 'entrada' ? t('fluxoCaixa.entrada') || 'Entrada' : t('fluxoCaixa.saida') || 'Saída',
        transacao.descricao,
        `€ ${transacao.valor.toFixed(2)}`,
        transacao.parcelamento?.parcelas.some(p => p.pago) ? 
          t('fluxoCaixa.confirmado') || 'Confirmado' : t('fluxoCaixa.pendente') || 'Pendente'
      ]);
      
      // Tabela de movimentações
      (doc as any).autoTable({
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [[
          t('fluxoCaixa.data') || 'Data', 
          t('fluxoCaixa.tipo') || 'Tipo', 
          t('fluxoCaixa.descricao') || 'Descrição', 
          t('fluxoCaixa.valor') || 'Valor', 
          t('fluxoCaixa.status') || 'Status'
        ]],
        body: movimentacoes,
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] }
      });
      
      // Rodapé
      const dataGeracao = format(new Date(), 'dd/MM/yyyy HH:mm');
      doc.setFontSize(10);
      doc.text(
        `${t('fluxoCaixa.geradoEm') || 'Gerado em'}: ${dataGeracao}`,
        20, doc.internal.pageSize.height - 10
      );
      
      // Salvar o PDF
      doc.save(`fluxo-de-caixa-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setGerando(false);
    }
  };
  
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={gerando ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
        onClick={gerarPDF}
        disabled={gerando || transacoes.length === 0}
      >
        {gerando ? t('comum.gerando') || 'Gerando...' : t('fluxoCaixa.gerarRelatorio') || 'Gerar Relatório'}
      </Button>
      
      {/* Modal de visualização */}
      <Dialog 
        open={showPreview} 
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t('fluxoCaixa.previewRelatorio') || 'Visualização do Relatório'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2 }}>
            <Typography variant="h4" align="center" gutterBottom>
              {t('fluxoCaixa.titulo') || 'Fluxo de Caixa'}
            </Typography>
            
            <Typography variant="subtitle1" align="center" gutterBottom>
              {t('fluxoCaixa.periodo') || 'Período'}: {format(new Date(periodo.inicio), 'dd/MM/yyyy')} - {format(new Date(periodo.fim), 'dd/MM/yyyy')}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              {t('fluxoCaixa.resumoFinanceiro') || 'Resumo Financeiro'}
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('fluxoCaixa.totalEntradas') || 'Total Entradas'}
                </Typography>
                <Typography variant="h6" color="success.main">
                  {formatarMoeda(estatisticas.totalEntradas)}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('fluxoCaixa.totalSaidas') || 'Total Saídas'}
                </Typography>
                <Typography variant="h6" color="error.main">
                  {formatarMoeda(estatisticas.totalSaidas)}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('fluxoCaixa.saldoFinal') || 'Saldo Final'}
                </Typography>
                <Typography 
                  variant="h6" 
                  color={estatisticas.saldoFinal >= 0 ? 'success.main' : 'error.main'}
                >
                  {formatarMoeda(estatisticas.saldoFinal)}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              {t('fluxoCaixa.movimentacoesDetalhadas') || 'Movimentações Detalhadas'}
            </Typography>
            
            {/* Aqui poderia renderizar uma tabela com as movimentações, mas para simplificar,
                apenas indicamos que estará no PDF */}
            <Typography variant="body2" color="text.secondary" align="center" sx={{ my: 3 }}>
              {t('fluxoCaixa.movimentacoesNoRelatorio', { count: transacoes.length }) || 
                `O relatório incluirá ${transacoes.length} movimentações detalhadas.`}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowPreview(false)} 
            color="inherit"
          >
            {t('comum.fechar') || 'Fechar'}
          </Button>
          <Button 
            onClick={gerarPDF} 
            variant="contained" 
            color="primary"
            startIcon={<PdfIcon />}
            disabled={gerando}
          >
            {gerando ? 
              t('comum.gerando') || 'Gerando...' : 
              t('comum.exportarPDF') || 'Exportar PDF'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RelatorioPDF; 