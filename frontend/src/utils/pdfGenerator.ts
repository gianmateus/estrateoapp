import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { jsPDFWithAutoTable } from 'jspdf-autotable';

interface ReportData {
  period: {
    start: string;
    end: string;
  };
  financial: {
    entries: {
      category: string;
      total: number;
    }[];
    exits: {
      category: string;
      total: number;
    }[];
    balance: number;
  };
  inventory: {
    critical: {
      product: string;
      currentStock: number;
      minimumStock: number;
    }[];
    movements: {
      product: string;
      entries: number;
      exits: number;
    }[];
  };
}

type ReportType = 'daily' | 'weekly' | 'monthly';

export const generatePDF = async (data: ReportData, type: ReportType) => {
  const doc = new jsPDF() as unknown as jsPDFWithAutoTable;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Título
  const title = type === 'daily' 
    ? 'Relatório Diário' 
    : type === 'weekly' 
      ? 'Relatório Semanal' 
      : 'Relatório Mensal';
      
  doc.setFontSize(20);
  doc.text(title, pageWidth / 2, 20, { align: 'center' });
  
  // Subtítulo (período)
  doc.setFontSize(12);
  doc.text(
    `Período: ${data.period.start} a ${data.period.end}`,
    pageWidth / 2,
    30,
    { align: 'center' }
  );

  let yPosition = 40;

  // Seção Financeira
  doc.setFontSize(16);
  doc.text('Resumo Financeiro', 14, yPosition);
  yPosition += 10;

  // Entradas
  doc.setFontSize(14);
  doc.text('Entradas por Categoria:', 14, yPosition);
  yPosition += 10;

  const entriesTable = data.financial.entries.map(entry => [
    entry.category,
    `R$ ${entry.total.toFixed(2)}`
  ]);

  doc.autoTable({
    startY: yPosition,
    head: [['Categoria', 'Valor']],
    body: entriesTable,
    theme: 'grid',
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Saídas
  doc.text('Saídas por Categoria:', 14, yPosition);
  yPosition += 10;

  const exitsTable = data.financial.exits.map(exit => [
    exit.category,
    `R$ ${exit.total.toFixed(2)}`
  ]);

  doc.autoTable({
    startY: yPosition,
    head: [['Categoria', 'Valor']],
    body: exitsTable,
    theme: 'grid',
  });

  yPosition = doc.lastAutoTable.finalY + 10;

  // Saldo
  doc.text(`Saldo do Período: R$ ${data.financial.balance.toFixed(2)}`, 14, yPosition);
  yPosition += 20;

  // Seção de Estoque
  doc.setFontSize(16);
  doc.text('Resumo de Estoque', 14, yPosition);
  yPosition += 10;

  // Estoque Crítico
  if (data.inventory.critical.length > 0) {
    doc.setFontSize(14);
    doc.text('Produtos com Estoque Crítico:', 14, yPosition);
    yPosition += 10;

    const criticalTable = data.inventory.critical.map(item => [
      item.product,
      item.currentStock.toString(),
      item.minimumStock.toString()
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Produto', 'Estoque Atual', 'Estoque Mínimo']],
      body: criticalTable,
      theme: 'grid',
    });

    yPosition = doc.lastAutoTable.finalY + 10;
  }

  // Movimentações de Estoque
  if (data.inventory.movements.length > 0) {
    doc.setFontSize(14);
    doc.text('Movimentações de Estoque:', 14, yPosition);
    yPosition += 10;

    const movementsTable = data.inventory.movements.map(movement => [
      movement.product,
      movement.entries.toString(),
      movement.exits.toString()
    ]);

    doc.autoTable({
      startY: yPosition,
      head: [['Produto', 'Entradas', 'Saídas']],
      body: movementsTable,
      theme: 'grid',
    });
  }

  // Rodapé
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.text(
    'Gerado automaticamente por Estrateo',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Salvar o PDF
  doc.save(`${title.toLowerCase().replace(' ', '_')}_${data.period.start}_${data.period.end}.pdf`);
}; 