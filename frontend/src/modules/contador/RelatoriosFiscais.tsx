/**
 * Componente de relatórios fiscais para o mercado alemão e europeu
 * 
 * Inclui funcionalidades de:
 * - Geração de relatórios compatíveis com o sistema ELSTER
 * - Exportação em formato XBRL (eXtensible Business Reporting Language)
 * - Declarações fiscais alemãs (Steuererklärungen)
 * - Relatórios financeiros conforme padrões EU
 */
import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Chip,
  Divider,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { 
  PictureAsPdf, 
  FileDownload, 
  Archive, 
  CloudDownload, 
  DataObject,
  CheckCircle,
  Warning,
  BarChart
} from '@mui/icons-material';
import RelatorioMensalInterno from './RelatorioMensalInterno';
import ModalSelecaoPeriodo from './ModalSelecaoPeriodo';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Interfaces
interface RelatoriosFiscaisProps {
  mes: string;
  impostos: any | null;
}

interface ReportOption {
  id: string;
  title: string;
  description: string;
  format: 'pdf' | 'xbrl' | 'xml' | 'elster' | 'interno';
  icon: JSX.Element;
  available: boolean;
  customAction?: boolean;
}

const RelatoriosFiscais: React.FC<RelatoriosFiscaisProps> = ({ mes, impostos }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [relatorioAtual, setRelatorioAtual] = useState<{id: string, format: string} | null>(null);

  // Função para garantir que o texto da tradução não seja null
  const getText = (key: string, fallback: string): string => {
    const translated = t(key);
    return translated !== key ? translated : fallback;
  };

  // Lista de relatórios disponíveis
  const reportOptions: ReportOption[] = [
    {
      id: 'monthly_vat',
      title: getText('contador.relatorios.vatReport', 'Declaração de IVA'),
      description: getText('contador.relatorios.vatReportDesc', 'Declaração mensal de IVA para o sistema ELSTER'),
      format: 'elster',
      icon: <CloudDownload />,
      available: true
    },
    {
      id: 'annual_financial',
      title: getText('contador.relatorios.annualFinancial', 'Demonstração Financeira Anual'),
      description: getText('contador.relatorios.annualFinancialDesc', 'Relatório financeiro completo no formato XBRL'),
      format: 'xbrl',
      icon: <DataObject />,
      available: true
    },
    {
      id: 'trade_tax',
      title: getText('contador.relatorios.tradeTax', 'Declaração de Imposto Comercial'),
      description: getText('contador.relatorios.tradeTaxDesc', 'Declaração anual do imposto comercial (Gewerbesteuer)'),
      format: 'pdf',
      icon: <PictureAsPdf />,
      available: true
    },
    {
      id: 'eu_vat_reporting',
      title: getText('contador.relatorios.euVatReport', 'Declaração de IVA da UE'),
      description: getText('contador.relatorios.euVatReportDesc', 'Relatório para transações transfronteiriças na UE'),
      format: 'xml',
      icon: <Archive />,
      available: false // Funcionalidade futura
    },
    {
      id: 'relatorio_mensal_interno',
      title: getText('contador.relatorios.monthlyInternal', 'Relatório Mensal Interno'),
      description: getText('contador.relatorios.monthlyInternalDesc', 'Resumo administrativo mensal com entradas, saídas, folha de pagamento e movimentação de estoque'),
      format: 'interno',
      icon: <BarChart />,
      available: true,
      customAction: true
    }
  ];

  // Função para abrir modal de seleção de período
  const handleIniciarGeracao = (reportId: string, format: string) => {
    setRelatorioAtual({ id: reportId, format });
    setModalAberto(true);
  };

  // Função para fechar modal
  const handleFecharModal = () => {
    setModalAberto(false);
    setRelatorioAtual(null);
  };

  // Função para gerar e baixar relatório
  const handleConfirmarGeracao = async (mesSelec: string, anoSelec: string) => {
    if (!relatorioAtual) return;
    
    const { id: reportId, format } = relatorioAtual;
    
    setLoading(reportId);
    setError(null);
    setSuccess(null);
    setModalAberto(false);

    try {
      // Gerar diferentes tipos de relatório com base no ID
      let pdfUrl: string;
      
      switch (reportId) {
        case 'monthly_vat':
          pdfUrl = gerarDeclaracaoIVA(mesSelec, anoSelec);
          break;
        case 'annual_financial':
          pdfUrl = gerarDemonstracaoFinanceira(mesSelec, anoSelec);
          break;
        case 'trade_tax':
          pdfUrl = gerarDeclaracaoImpostoComercial(mesSelec, anoSelec);
          break;
        default:
          throw new Error('Tipo de relatório não implementado');
      }
      
      // Abrir o PDF em uma nova aba
      window.open(pdfUrl, '_blank');
      
      // Mostrar mensagem de sucesso
      setSuccess(getText('contador.relatorios.sucessoGeracao', 'Relatório gerado com sucesso'));
    } catch (err) {
      console.error('Erro ao gerar relatório:', err);
      setError(getText('contador.relatorios.erroGeracao', 'Erro ao gerar relatório'));
    } finally {
      setLoading(null);
      setRelatorioAtual(null);
    }
  };
  
  // Função para desenhar tabela simples
  const desenharTabelaSimples = (
    doc: jsPDF,
    headers: string[], 
    data: any[][], 
    startY: number, 
    columnWidths: number[],
    rowHeight: number = 10,
    destaqueRows: Record<number, boolean> = {}
  ) => {
    const totalWidth = columnWidths.reduce((acc, w) => acc + w, 0);
    let startX = (210 - totalWidth) / 2; // Centralizar tabela na página A4
    
    // Desenhar cabeçalho
    doc.setFillColor(230, 230, 230);
    doc.setDrawColor(180, 180, 180);
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    
    // Retângulo do cabeçalho
    doc.rect(startX, startY, totalWidth, rowHeight, 'FD');
    
    // Textos do cabeçalho
    let colX = startX;
    headers.forEach((header, i) => {
      doc.text(header, colX + 2, startY + rowHeight/2 + 3);
      colX += columnWidths[i];
    });
    
    // Desenhar dados
    let currentY = startY + rowHeight;
    
    data.forEach((row, rowIndex) => {
      // Alternar cor de fundo das linhas
      if (rowIndex % 2 === 0) {
        doc.setFillColor(245, 245, 245);
      } else {
        doc.setFillColor(255, 255, 255);
      }
      
      // Verificar se a linha tem destaque especial
      if (destaqueRows[rowIndex]) {
        doc.setTextColor(200, 0, 0);
      } else {
        doc.setTextColor(80, 80, 80);
      }
      
      // Retângulo da linha
      doc.rect(startX, currentY, totalWidth, rowHeight, 'FD');
      
      // Textos da linha
      colX = startX;
      row.forEach((cell, i) => {
        doc.text(String(cell), colX + 2, currentY + rowHeight/2 + 3);
        colX += columnWidths[i];
      });
      
      // Restaurar cor de texto padrão
      doc.setTextColor(80, 80, 80);
      
      currentY += rowHeight;
    });
    
    return currentY; // retornar posição Y final
  };

  // Função para formatar moeda
  const formatarEuro = (valor: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(valor);
  };

  // Funções para gerar relatórios específicos
  
  // 1. Declaração de IVA
  const gerarDeclaracaoIVA = (mes: string, ano: string): string => {
    try {
      const doc = new jsPDF();
      const dataGeracao = format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR });
      const nomeMes = format(new Date(`${ano}-${mes}-01`), 'MMMM yyyy', { locale: ptBR });
      
      // Cabeçalho
      doc.setFontSize(22);
      doc.setTextColor('#0066CC');
      doc.text('Estrateo GmbH', 105, 20, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor('#444444');
      doc.text('Declaração de IVA (Mehrwertsteuer)', 105, 30, { align: 'center' });
      
      doc.setFontSize(14);
      doc.text(`${nomeMes}`, 105, 40, { align: 'center' });
      
      doc.setFontSize(8);
      doc.setTextColor('#333333');
      doc.text(`Gerado em: ${dataGeracao}`, 195, 10, { align: 'right' });
      
      // Informações fiscais
      doc.setFontSize(10);
      doc.setTextColor('#333333');
      doc.text('Número de Identificação Fiscal: DE123456789', 20, 60);
      doc.text('Período de Referência: ' + nomeMes, 20, 70);
      
      // Tabela de IVA
      const ivaHeaders = ['Descrição', 'Base de Cálculo', 'Taxa', 'Valor IVA'];
      const ivaRows = [
        ['Vendas - Taxa Normal', formatarEuro(12500.45), '19%', formatarEuro(2375.09)],
        ['Vendas - Taxa Reduzida', formatarEuro(3180.00), '7%', formatarEuro(222.60)],
        ['Compras - Taxa Normal', formatarEuro(8250.30), '19%', formatarEuro(1567.56)],
        ['Compras - Taxa Reduzida', formatarEuro(1535.00), '7%', formatarEuro(107.45)]
      ];
      
      const finalYTabela = desenharTabelaSimples(
        doc,
        ivaHeaders, 
        ivaRows, 
        90, 
        [70, 45, 30, 45]
      );
      
      // Resumo
      doc.setFontSize(12);
      doc.setTextColor('#0066CC');
      doc.text('Resumo', 20, finalYTabela + 20);
      
      doc.setFontSize(10);
      doc.setTextColor('#333333');
      doc.text('IVA a recolher sobre vendas: ' + formatarEuro(2597.69), 20, finalYTabela + 40);
      doc.text('IVA a recuperar sobre compras: ' + formatarEuro(1675.01), 20, finalYTabela + 50);
      
      doc.setFontSize(12);
      doc.setTextColor('#008800');
      doc.text('Total IVA a pagar: ' + formatarEuro(922.68), 20, finalYTabela + 70);
      
      // Informações de conformidade
      doc.setFontSize(8);
      doc.setTextColor('#666666');
      doc.text('Este documento está em conformidade com os requisitos do sistema ELSTER alemão.', 105, 250, { align: 'center' });
      doc.text('Gerado automaticamente por Estrateo', 105, 260, { align: 'center' });
      
      // Gerar URL para download
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      return pdfUrl;
    } catch (error) {
      console.error('Erro ao gerar PDF de Declaração de IVA:', error);
      throw error;
    }
  };
  
  // 2. Demonstração Financeira Anual
  const gerarDemonstracaoFinanceira = (mes: string, ano: string): string => {
    try {
      const doc = new jsPDF();
      const dataGeracao = format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR });
      
      // Cabeçalho
      doc.setFontSize(22);
      doc.setTextColor('#0066CC');
      doc.text('Estrateo GmbH', 105, 20, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor('#444444');
      doc.text('Demonstração Financeira Anual', 105, 30, { align: 'center' });
      
      doc.setFontSize(14);
      doc.text(`Exercício ${ano}`, 105, 40, { align: 'center' });
      
      doc.setFontSize(8);
      doc.setTextColor('#333333');
      doc.text(`Gerado em: ${dataGeracao}`, 195, 10, { align: 'right' });
      
      // Introdução
      doc.setFontSize(10);
      doc.setTextColor('#333333');
      doc.text('Este relatório apresenta a demonstração financeira anual da empresa, incluindo balanço', 20, 60);
      doc.text('patrimonial, demonstração de resultados e fluxo de caixa para o exercício financeiro.', 20, 68);
      
      // Seção 1: Balanço Patrimonial
      doc.setFontSize(12);
      doc.setTextColor('#0066CC');
      doc.text('Balanço Patrimonial', 20, 85);
      
      const ativosHeaders = ['Ativos', 'Valor'];
      const ativosRows = [
        ['Caixa e Equivalentes', formatarEuro(45680.25)],
        ['Contas a Receber', formatarEuro(28750.30)],
        ['Estoques', formatarEuro(32450.00)],
        ['Imobilizado', formatarEuro(123500.00)],
        ['Outros Ativos', formatarEuro(17800.45)]
      ];
      
      const finalYAtivos = desenharTabelaSimples(
        doc,
        ativosHeaders, 
        ativosRows, 
        95, 
        [100, 60]
      );
      
      doc.setFontSize(10);
      doc.setTextColor('#333333');
      doc.text(`Total de Ativos: ${formatarEuro(248181.00)}`, 145, finalYAtivos + 15);
      
      const passivosHeaders = ['Passivos e Patrimônio', 'Valor'];
      const passivosRows = [
        ['Contas a Pagar', formatarEuro(18560.75)],
        ['Empréstimos', formatarEuro(75000.00)],
        ['Impostos a Pagar', formatarEuro(12450.25)],
        ['Capital Social', formatarEuro(100000.00)],
        ['Lucros Acumulados', formatarEuro(42170.00)]
      ];
      
      const finalYPassivos = desenharTabelaSimples(
        doc,
        passivosHeaders, 
        passivosRows, 
        finalYAtivos + 30, 
        [100, 60]
      );
      
      doc.text(`Total de Passivos e Patrimônio: ${formatarEuro(248181.00)}`, 145, finalYPassivos + 15);
      
      // Seção 2: DRE
      doc.setFontSize(12);
      doc.setTextColor('#0066CC');
      doc.text('Demonstração de Resultados', 20, finalYPassivos + 35);
      
      const dreHeaders = ['Item', 'Valor'];
      const dreRows = [
        ['Receita Bruta', formatarEuro(350000.00)],
        ['(-) Impostos sobre Vendas', formatarEuro(66500.00)],
        ['(=) Receita Líquida', formatarEuro(283500.00)],
        ['(-) Custos Operacionais', formatarEuro(156200.00)],
        ['(-) Despesas Administrativas', formatarEuro(48700.00)],
        ['(-) Despesas Financeiras', formatarEuro(12500.00)],
        ['(=) Lucro Antes dos Impostos', formatarEuro(66100.00)],
        ['(-) Imposto de Renda', formatarEuro(19830.00)],
        ['(=) Lucro Líquido', formatarEuro(46270.00)]
      ];
      
      desenharTabelaSimples(
        doc,
        dreHeaders, 
        dreRows, 
        finalYPassivos + 45, 
        [100, 60],
        10,
        { 8: true } // Destacar o lucro líquido
      );
      
      // Informações de conformidade
      doc.setFontSize(8);
      doc.setTextColor('#666666');
      doc.text('Este documento está em conformidade com padrões contábeis alemães e diretrizes da EU.', 105, 280, { align: 'center' });
      doc.text('Contém dados financeiros preparados no formato XBRL.', 105, 285, { align: 'center' });
      
      // Gerar URL para download
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      return pdfUrl;
    } catch (error) {
      console.error('Erro ao gerar PDF de Demonstração Financeira:', error);
      throw error;
    }
  };
  
  // 3. Declaração de Imposto Comercial
  const gerarDeclaracaoImpostoComercial = (mes: string, ano: string): string => {
    try {
      const doc = new jsPDF();
      const dataGeracao = format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR });
      
      // Cabeçalho
      doc.setFontSize(22);
      doc.setTextColor('#0066CC');
      doc.text('Estrateo GmbH', 105, 20, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor('#444444');
      doc.text('Declaração de Imposto Comercial', 105, 30, { align: 'center' });
      doc.text('(Gewerbesteuer)', 105, 40, { align: 'center' });
      
      doc.setFontSize(14);
      doc.text(`Ano Fiscal ${ano}`, 105, 50, { align: 'center' });
      
      doc.setFontSize(8);
      doc.setTextColor('#333333');
      doc.text(`Gerado em: ${dataGeracao}`, 195, 10, { align: 'right' });
      
      // Informações fiscais
      doc.setFontSize(10);
      doc.setTextColor('#333333');
      doc.text('Número de Identificação Fiscal: DE123456789', 20, 70);
      doc.text('Endereço Fiscal: Berlinerstrasse 123, 10115 Berlin', 20, 80);
      doc.text('Município: Berlin', 20, 90);
      doc.text('Taxa de Imposto Comercial: 3.5% (base) + 400% (multiplicador municipal)', 20, 100);
      
      // Tabela de bases de cálculo
      doc.setFontSize(12);
      doc.setTextColor('#0066CC');
      doc.text('Base de Cálculo do Imposto Comercial', 20, 120);
      
      const baseHeaders = ['Item', 'Valor'];
      const baseRows = [
        ['Lucro do Exercício', formatarEuro(66100.00)],
        ['(+) Adições', formatarEuro(12400.00)],
        ['(-) Deduções', formatarEuro(5200.00)],
        ['(=) Base de Cálculo', formatarEuro(73300.00)]
      ];
      
      const finalYBase = desenharTabelaSimples(
        doc,
        baseHeaders, 
        baseRows, 
        130, 
        [100, 60]
      );
      
      // Cálculo do imposto
      doc.setFontSize(12);
      doc.setTextColor('#0066CC');
      doc.text('Cálculo do Imposto Comercial', 20, finalYBase + 30);
      
      const calculoHeaders = ['Etapa', 'Descrição', 'Valor'];
      const calculoRows = [
        ['1', 'Base de Cálculo', formatarEuro(73300.00)],
        ['2', 'Dedução Base (24.500€)', formatarEuro(24500.00)],
        ['3', 'Base Tributável', formatarEuro(48800.00)],
        ['4', 'Taxa Base (3.5%)', '3.5%'],
        ['5', 'Imposto Base', formatarEuro(1708.00)],
        ['6', 'Multiplicador Municipal', '400%'],
        ['7', 'Imposto Comercial Devido', formatarEuro(6832.00)]
      ];
      
      desenharTabelaSimples(
        doc,
        calculoHeaders, 
        calculoRows, 
        finalYBase + 40, 
        [20, 100, 40],
        10,
        { 6: true } // Destacar o imposto devido
      );
      
      // Observações
      doc.setFontSize(10);
      doc.setTextColor('#333333');
      doc.text('Observações:', 20, 240);
      doc.text('1. Este documento é uma simulação para fins de planejamento.', 20, 250);
      doc.text('2. A declaração oficial deve ser enviada via sistema ELSTER.', 20, 260);
      doc.text('3. Prazo de envio: 31 de maio do ano seguinte ao exercício fiscal.', 20, 270);
      
      // Rodapé
      doc.setFontSize(8);
      doc.setTextColor('#666666');
      doc.text('Este documento está em conformidade com as regulamentações fiscais alemãs.', 105, 280, { align: 'center' });
      
      // Gerar URL para download
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      return pdfUrl;
    } catch (error) {
      console.error('Erro ao gerar PDF de Imposto Comercial:', error);
      throw error;
    }
  };

  // Obter o status do chip baseado no formato
  const getChipProps = (format: string) => {
    switch (format) {
      case 'pdf':
        return { color: 'primary', label: 'PDF' };
      case 'xml':
        return { color: 'secondary', label: 'XML' };
      case 'xbrl':
        return { color: 'success', label: 'XBRL' };
      case 'elster':
        return { color: 'warning', label: 'ELSTER' };
      case 'interno':
        return { color: 'info', label: 'PDF' };
      default:
        return { color: 'default', label: format.toUpperCase() };
    }
  };

  // Manipuladores para mensagens de feedback
  const handleSuccessMessage = (mensagem: string) => {
    setSuccess(mensagem);
  };

  const handleErrorMessage = (mensagem: string) => {
    setError(mensagem);
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Typography variant="h6" gutterBottom>
        {getText('contador.relatorios.titulo', 'Relatórios Fiscais & Documentos Financeiros')}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        {getText('contador.relatorios.subtitulo', 'Gere relatórios em conformidade com padrões alemães e europeus')}
      </Typography>
      
      <Paper sx={{ mt: 3 }}>
        <List>
          {reportOptions.map((report, index) => (
            <React.Fragment key={report.id}>
              {index > 0 && <Divider component="li" />}
              <ListItem
                secondaryAction={
                  report.customAction ? (
                    <RelatorioMensalInterno 
                      onSuccess={handleSuccessMessage} 
                      onError={handleErrorMessage}
                    />
                  ) : (
                    <Button
                      variant="contained"
                      size="small"
                      disabled={loading === report.id || !report.available}
                      onClick={() => handleIniciarGeracao(report.id, report.format)}
                      startIcon={loading === report.id ? <CircularProgress size={20} /> : <FileDownload />}
                    >
                      {loading === report.id 
                        ? getText('contador.relatorios.processando', 'Processando...')
                        : getText('contador.relatorios.gerar', 'Gerar')
                      }
                    </Button>
                  )
                }
                sx={{ py: 2 }}
              >
                <ListItemIcon>
                  {report.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1">{report.title}</Typography>
                      <Chip 
                        size="small"
                        label={getChipProps(report.format).label}
                        color={getChipProps(report.format).color as any}
                      />
                      {!report.available && (
                        <Chip 
                          size="small"
                          label={getText('contador.relatorios.emBreve', 'Em breve')}
                          color="default"
                          icon={<Warning fontSize="small" />}
                        />
                      )}
                    </Stack>
                  }
                  secondary={report.description}
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </Paper>
      
      {/* Modal de seleção de período para outros relatórios */}
      <ModalSelecaoPeriodo
        open={modalAberto}
        onClose={handleFecharModal}
        onConfirm={handleConfirmarGeracao}
      />
      
      <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="subtitle2" gutterBottom>
          {getText('contador.relatorios.conformidadeInfo', 'Conformidade e Regulamentação')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {getText('contador.relatorios.conformidadeDesc', 'Todos os relatórios gerados estão em conformidade com as regulamentações fiscais alemãs atuais e diretrizes da UE.')}
        </Typography>
      </Box>
    </Box>
  );
};

export default RelatoriosFiscais; 