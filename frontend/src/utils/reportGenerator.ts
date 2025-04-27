import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TFunction } from 'i18next';
import { formatCurrency } from './formatters';
import i18n from '../i18n';

interface ReportData {
  currentDate: Date;
  balance: number;
  todayIncome: number;
  todayExpenses: number;
  payments: {
    total: number;
    paid: number;
    pending: number;
  };
  inventory: {
    totalItems: number;
    criticalItems: number;
    totalValue: number;
  };
  aiSuggestions: string[];
}

/**
 * Gera um relatório em PDF com as informações do dashboard
 * @param data Dados para o relatório
 * @param t Função de tradução do i18next
 */
export const generateDashboardReport = async (data: ReportData, t: TFunction): Promise<void> => {
  // Criar uma nova instância do PDF no formato A4
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Configurações de estilo
  const titleFontSize = 18;
  const subtitleFontSize = 14;
  const normalFontSize = 10;
  const lineHeight = 7;
  let currentY = 20; // posição vertical atual
  
  // Adicionar título
  pdf.setFontSize(titleFontSize);
  pdf.setFont('helvetica', 'bold');
  const title = String(t('titulo'));
  pdf.text(title, pdf.internal.pageSize.getWidth() / 2, currentY, { align: 'center' });
  
  // Adicionar data
  currentY += 10;
  pdf.setFontSize(normalFontSize);
  pdf.setFont('helvetica', 'normal');
  
  // Usar o idioma atual do i18n para formatar a data
  const dateFormatted = new Intl.DateTimeFormat(i18n.language, {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    weekday: 'long'
  }).format(data.currentDate);
  
  pdf.text(
    `${String(t('data'))}: ${dateFormatted}`, 
    pdf.internal.pageSize.getWidth() / 2, 
    currentY, 
    { align: 'center' }
  );
  
  // Linha separadora
  currentY += 15;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(
    20, 
    currentY, 
    pdf.internal.pageSize.getWidth() - 20, 
    currentY
  );
  
  // Seção de Finanças
  currentY += 15;
  pdf.setFontSize(subtitleFontSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text(String(t('financeiro')), 20, currentY);
  
  // Dados financeiros
  currentY += lineHeight * 1.5;
  pdf.setFontSize(normalFontSize);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${String(t('balanco_atual'))}: ${formatCurrency(data.balance)}`, 20, currentY);
  
  currentY += lineHeight;
  pdf.text(`${String(t('entrada_hoje'))}: ${formatCurrency(data.todayIncome)}`, 20, currentY);
  
  currentY += lineHeight;
  pdf.text(`${String(t('saida_hoje'))}: ${formatCurrency(data.todayExpenses)}`, 20, currentY);
  
  // Seção de Pagamentos
  currentY += lineHeight * 2;
  pdf.setFontSize(subtitleFontSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text(String(t('pagamentos')), 20, currentY);
  
  // Dados de pagamentos
  currentY += lineHeight * 1.5;
  pdf.setFontSize(normalFontSize);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${String(t('pagamentos'))} ${String(t('total'))}: ${data.payments.total}`, 20, currentY);
  
  currentY += lineHeight;
  pdf.text(`${String(t('pagos'))}: ${data.payments.paid}`, 20, currentY);
  
  currentY += lineHeight;
  pdf.text(`${String(t('pendentes'))}: ${data.payments.pending}`, 20, currentY);
  
  // Seção de Inventário
  currentY += lineHeight * 2;
  pdf.setFontSize(subtitleFontSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text(String(t('inventario')), 20, currentY);
  
  // Dados de inventário
  currentY += lineHeight * 1.5;
  pdf.setFontSize(normalFontSize);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${String(t('itensTotal'))}: ${data.inventory.totalItems}`, 20, currentY);
  
  currentY += lineHeight;
  pdf.text(`${String(t('itens_criticos'))}: ${data.inventory.criticalItems}`, 20, currentY);
  
  currentY += lineHeight;
  pdf.text(`${String(t('valor_total'))}: ${formatCurrency(data.inventory.totalValue)}`, 20, currentY);
  
  // Seção de Sugestões de IA
  currentY += lineHeight * 2;
  pdf.setFontSize(subtitleFontSize);
  pdf.setFont('helvetica', 'bold');
  pdf.text(String(t('sugestoes_ia')), 20, currentY);
  
  // Listar sugestões
  currentY += lineHeight * 1.5;
  pdf.setFontSize(normalFontSize);
  pdf.setFont('helvetica', 'normal');
  
  data.aiSuggestions.forEach((suggestion, index) => {
    // Se estiver no final da página, criar uma nova
    if (currentY > pdf.internal.pageSize.getHeight() - 20) {
      pdf.addPage();
      currentY = 20;
    }
    
    pdf.text(`${index + 1}. ${suggestion}`, 20, currentY);
    currentY += lineHeight;
  });
  
  // Adicionar rodapé
  currentY = pdf.internal.pageSize.getHeight() - 10;
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    `Estrateo ${new Date().getFullYear()} - ${String(t('geradoHoje'))}`,
    pdf.internal.pageSize.getWidth() / 2,
    currentY,
    { align: 'center' }
  );
  
  // Definir nome do arquivo com a data atual
  const dateStr = data.currentDate.toISOString().split('T')[0];
  const fileName = `estrateo_report_${dateStr}.pdf`;
  
  // Salvar o arquivo
  pdf.save(fileName);
};

/**
 * Captura um elemento HTML para o PDF e adiciona como imagem
 * @param elementId ID do elemento HTML a ser capturado
 * @param pdf Instância do PDF
 * @param x Posição X
 * @param y Posição Y
 * @param width Largura
 * @param height Altura opcional
 */
export const captureElementToPdf = async (
  elementId: string,
  pdf: jsPDF,
  x: number,
  y: number,
  width: number,
  height?: number
): Promise<number> => {
  const element = document.getElementById(elementId);
  if (!element) return y;
  
  const canvas = await html2canvas(element, {
    scale: 2, // Escala melhor para uma maior qualidade
    logging: false,
    useCORS: true
  });
  
  const imgData = canvas.toDataURL('image/png');
  const imgHeight = height || (canvas.height * width / canvas.width);
  
  pdf.addImage(imgData, 'PNG', x, y, width, imgHeight);
  
  return y + imgHeight;
};

/**
 * Gera um relatório em PDF a partir de elementos HTML específicos
 * @param elementsToCapture IDs dos elementos HTML a serem capturados
 * @param t Função de tradução do i18next
 */
export const generateDashboardReportFromDOM = async (
  elementsToCapture: string[],
  t: TFunction
): Promise<void> => {
  // Criar uma nova instância do PDF no formato A4
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Adicionar título
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  const title = String(t('titulo'));
  pdf.text(title, pdf.internal.pageSize.getWidth() / 2, 20, { align: 'center' });
  
  // Adicionar data
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  // Usar o idioma atual do i18n para formatar a data
  const dateFormatted = new Intl.DateTimeFormat(i18n.language, {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }).format(new Date());
  
  pdf.text(
    `${String(t('data'))}: ${dateFormatted}`, 
    pdf.internal.pageSize.getWidth() / 2, 
    30, 
    { align: 'center' }
  );
  
  let currentY = 40;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - 40; // 20mm de margem de cada lado
  
  // Capturar cada elemento
  for (const elementId of elementsToCapture) {
    // Verificar se ainda há espaço na página
    if (currentY > pdf.internal.pageSize.getHeight() - 30) {
      pdf.addPage();
      currentY = 20;
    }
    
    const newY = await captureElementToPdf(
      elementId,
      pdf,
      20,
      currentY,
      contentWidth
    );
    
    currentY = newY + 10; // Adicionar algum espaço entre os elementos
  }
  
  // Adicionar rodapé
  const footerY = pdf.internal.pageSize.getHeight() - 10;
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    `Estrateo ${new Date().getFullYear()} - ${String(t('geradoHoje'))}`,
    pdf.internal.pageSize.getWidth() / 2,
    footerY,
    { align: 'center' }
  );
  
  // Definir nome do arquivo com a data atual
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `estrateo_report_${dateStr}.pdf`;
  
  // Salvar o arquivo
  pdf.save(fileName);
}; 