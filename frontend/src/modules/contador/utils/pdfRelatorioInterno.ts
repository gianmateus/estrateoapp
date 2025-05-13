import { jsPDF } from 'jspdf';
// Importando a biblioteca jspdf-autotable - vamos tentar usar, mas temos backup
import 'jspdf-autotable';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Adicionar tipagem para o plugin autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable?: (options: any) => any;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

// Interfaces
interface Funcionario {
  nome: string;
  horasSemanais: number;
  salarioBruto: number;
}

interface ProdutoEstoque {
  nome: string;
  quantidade: number;
  movimentacao: number;
  abaixoMinimo: boolean;
}

interface DadosRelatorio {
  nomeEmpresa: string;
  mes: string;
  ano: string;
  totalEntradas: number;
  totalSaidas: number;
  funcionarios: Funcionario[];
  produtos: ProdutoEstoque[];
  vatPercentual: number;
  vatValor: number;
  gewerbesteuerValor: number;
}

// Interface para o parâmetro row do autoTable
interface TableRow {
  index: number;
  [key: string]: any;
}

/**
 * Gera o PDF de relatório mensal interno
 * @param dados Dados para o relatório
 * @returns URL do Blob do PDF gerado
 */
export const gerarPDFRelatorioInterno = (dados: DadosRelatorio): string => {
  try {
    // Criar documento PDF
    const doc = new jsPDF();
    const dataGeracao = format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR });
    const nomeMes = format(new Date(`${dados.ano}-${dados.mes}-01`), 'MMMM yyyy', { locale: ptBR });
    
    // Definir cores e estilos
    const corTitulo = '#0066CC';
    const corSubtitulo = '#444444';
    const corTexto = '#333333';
    
    // Adicionar cabeçalho
    doc.setFontSize(22);
    doc.setTextColor(corTitulo);
    doc.text(`${dados.nomeEmpresa}`, 105, 20, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(corSubtitulo);
    doc.text(`Relatório Mensal Interno`, 105, 30, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(`${nomeMes}`, 105, 40, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setTextColor(corTexto);
    doc.text(`Gerado em: ${dataGeracao}`, 195, 10, { align: 'right' });
    
    // Adicionar seção de resumo financeiro
    doc.setFontSize(14);
    doc.setTextColor(corTitulo);
    doc.text('Resumo Financeiro', 14, 60);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 63, 195, 63);
    
    doc.setFontSize(10);
    doc.setTextColor(corTexto);
    
    const lucroPreju = dados.totalEntradas - dados.totalSaidas;
    const isLucro = lucroPreju >= 0;
    
    const formatarEuro = (valor: number) => {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(valor);
    };
    
    doc.text(`Total de Entradas: ${formatarEuro(dados.totalEntradas)}`, 14, 72);
    doc.text(`Total de Saídas: ${formatarEuro(dados.totalSaidas)}`, 14, 80);
    
    doc.setTextColor(isLucro ? '#008800' : '#BB0000');
    doc.text(`${isLucro ? 'Lucro' : 'Prejuízo'} do Mês: ${formatarEuro(Math.abs(lucroPreju))}`, 14, 88);
    
    // Adicionar folha de pagamento
    doc.setFontSize(14);
    doc.setTextColor(corTitulo);
    doc.text('Folha de Pagamento', 14, 105);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 108, 195, 108);
    
    // Função para desenhar tabela simples (sem autoTable)
    const desenharTabelaSimples = (
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
    
    // Tabela de funcionários
    const funcionariosHeaders = ['Nome', 'Horas Semanais', 'Salário Bruto'];
    const funcionariosRows = dados.funcionarios.map(f => [
      f.nome,
      `${f.horasSemanais}h`,
      formatarEuro(f.salarioBruto)
    ]);
    
    // Desenhar tabela de funcionários
    const finalYFuncionarios = desenharTabelaSimples(
      funcionariosHeaders, 
      funcionariosRows, 
      115, 
      [80, 40, 50]
    );
    
    // Adicionar estoque
    const finalY = finalYFuncionarios + 15;
    
    doc.setFontSize(14);
    doc.setTextColor(corTitulo);
    doc.text('Estoque', 14, finalY);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, finalY + 3, 195, finalY + 3);
    
    // Tabela de produtos
    const produtosHeaders = ['Produto', 'Quantidade', 'Movimentação', 'Status'];
    const produtosRows = dados.produtos.map(p => [
      p.nome,
      p.quantidade,
      p.movimentacao >= 0 ? `+${p.movimentacao}` : p.movimentacao,
      p.abaixoMinimo ? 'Abaixo do mínimo' : 'Normal'
    ]);
    
    // Destacar produtos abaixo do mínimo
    const destaqueProdutos: Record<number, boolean> = {};
    dados.produtos.forEach((p, index) => {
      if (p.abaixoMinimo) {
        destaqueProdutos[index] = true;
      }
    });
    
    // Desenhar tabela de produtos
    const finalYProdutos = desenharTabelaSimples(
      produtosHeaders, 
      produtosRows, 
      finalY + 10, 
      [80, 35, 35, 40],
      10,
      destaqueProdutos
    );
    
    // Adicionar impostos estimados
    const finalYImpostos = finalYProdutos + 15;
    
    doc.setFontSize(14);
    doc.setTextColor(corTitulo);
    doc.text('Impostos Estimados', 14, finalYImpostos);
    
    doc.setDrawColor(200, 200, 200);
    doc.line(14, finalYImpostos + 3, 195, finalYImpostos + 3);
    
    // Tabela de impostos
    const impostosHeaders = ['Imposto', 'Alíquota', 'Valor'];
    const impostosRows = [
      ['VAT (Mehrwertsteuer)', `${dados.vatPercentual}%`, formatarEuro(dados.vatValor)],
      ['Gewerbesteuer', '-', formatarEuro(dados.gewerbesteuerValor)]
    ];
    
    // Desenhar tabela de impostos
    const finalYImpostosTabela = desenharTabelaSimples(
      impostosHeaders, 
      impostosRows, 
      finalYImpostos + 10, 
      [90, 40, 50]
    );
    
    // Adicionar rodapé
    const finalYRodape = finalYImpostosTabela + 20;
    
    doc.setFontSize(8);
    doc.setTextColor(corSubtitulo);
    doc.text('Gerado automaticamente por Estrateo', 105, finalYRodape, { align: 'center' });
    
    // Gerar URL para download
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    return pdfUrl;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    // Criar um PDF básico em caso de erro
    const doc = new jsPDF();
    doc.text('Erro ao gerar relatório completo. Detalhes do erro:', 10, 10);
    doc.text(String(error), 10, 20);
    doc.text('Por favor contate o suporte técnico', 10, 30);
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    return pdfUrl;
  }
};

export default gerarPDFRelatorioInterno; 