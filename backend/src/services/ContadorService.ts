/**
 * Serviço de contabilidade adaptado para o mercado alemão e europeu
 * 
 * Implementa:
 * - Cálculo de impostos alemães (Mehrwertsteuer, Gewerbesteuer)
 * - Geração de relatórios fiscais no padrão ELSTER
 * - Exportação no formato XBRL para empresas europeias
 * - Tratamento de dados conforme GDPR
 */

import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';
import { TaxEngine } from './TaxEngine';

// Interfaces para tipagem de dados
interface DadosFinanceiros {
  resumo: {
    receita: number;
    despesas: number;
    saldo: number;
    funcionariosPagos: number;
  };
  entradas: EntradaFinanceira[];
  saidas: SaidaFinanceira[];
  funcionarios: DadosFuncionario[];
  graficoData: PontoGrafico[];
}

interface EntradaFinanceira {
  id: number;
  data: string;
  cliente: string;
  descricao: string;
  valor: number;
}

interface SaidaFinanceira {
  id: number;
  data: string;
  fornecedor: string;
  tipo: string;
  valor: number;
}

interface DadosFuncionario {
  id: number;
  nome: string;
  tipoContrato: string;
  horasTrabalhadas: number;
  valorPago: number;
}

interface PontoGrafico {
  dia: string;
  receitas: number;
  despesas: number;
}

interface ConfiguracaoImposto {
  id: string;
  categoria: string;
  descricao: string;
  taxaMehrwertsteuer: number; // VAT
  taxaGewerbesteuer: number; // Imposto comercial
  aplicavelExportacao: boolean;
}

/**
 * Implementação do serviço de contabilidade
 */
class ContadorService {
  private taxEngine: TaxEngine;
  
  constructor() {
    this.taxEngine = new TaxEngine();
  }

  /**
   * Obtém dados financeiros para um período específico
   * @param periodo Período no formato AAAA-MM
   * @returns Dados financeiros completos
   */
  async getDadosFinanceiros(periodo: string): Promise<DadosFinanceiros> {
    try {
      // Em uma implementação real, buscaria dados do banco de dados
      // Para este exemplo, retornamos dados mockados
      
      console.log(`Buscando dados financeiros para o período ${periodo}`);
      
      // Simulamos uma pequena demora para simular consulta ao banco
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        resumo: {
          receita: 12500.50,
          despesas: 8750.25,
          saldo: 3750.25,
          funcionariosPagos: 5
        },
        entradas: [
          { id: 1, data: `${periodo}-05`, cliente: 'Restaurant Mueller', descricao: 'Software Lizenz', valor: 3200.00 },
          { id: 2, data: `${periodo}-12`, cliente: 'Café Schmidt', descricao: 'Beratung', valor: 1800.00 },
          { id: 3, data: `${periodo}-18`, cliente: 'Bäckerei Weber', descricao: 'Implementation', valor: 3500.00 },
          { id: 4, data: `${periodo}-25`, cliente: 'Gaststätte Fischer', descricao: 'Support', valor: 1200.00 },
          { id: 5, data: `${periodo}-28`, cliente: 'Imbiss Wagner', descricao: 'Zusätzliche Module', valor: 2800.50 }
        ],
        saidas: [
          { id: 1, data: `${periodo}-03`, fornecedor: 'Miete', tipo: 'Infrastruktur', valor: 2100.00 },
          { id: 2, data: `${periodo}-07`, fornecedor: 'Strom & Wasser', tipo: 'Versorgung', valor: 520.75 },
          { id: 3, data: `${periodo}-14`, fornecedor: 'Büromaterial', tipo: 'Verbrauchsmaterial', valor: 380.50 },
          { id: 4, data: `${periodo}-21`, fornecedor: 'Digitales Marketing', tipo: 'Werbung', valor: 750.00 },
          { id: 5, data: `${periodo}-26`, fornecedor: 'Wartung', tipo: 'Service', valor: 340.00 },
          { id: 6, data: `${periodo}-30`, fornecedor: 'Gehalt', tipo: 'Personal', valor: 4650.00 }
        ],
        funcionarios: [
          { id: 1, nome: 'Anna Schmidt', tipoContrato: 'Vollzeit', horasTrabalhadas: 160, valorPago: 2800.00 },
          { id: 2, nome: 'Michael Weber', tipoContrato: 'Freiberufler', horasTrabalhadas: 120, valorPago: 3600.00 },
          { id: 3, nome: 'Sophie Fischer', tipoContrato: 'Vollzeit', horasTrabalhadas: 160, valorPago: 2600.00 },
          { id: 4, nome: 'Thomas Meyer', tipoContrato: 'Praktikant', horasTrabalhadas: 120, valorPago: 950.00 },
          { id: 5, nome: 'Julia Wagner', tipoContrato: 'Teilzeit', horasTrabalhadas: 80, valorPago: 1400.00 }
        ],
        graficoData: [
          { dia: `${periodo.substring(5)}-05`, receitas: 3200, despesas: 3000 },
          { dia: `${periodo.substring(5)}-12`, receitas: 1800, despesas: 1650 },
          { dia: `${periodo.substring(5)}-19`, receitas: 3500, despesas: 2100 },
          { dia: `${periodo.substring(5)}-26`, receitas: 4000, despesas: 2000 }
        ]
      };
    } catch (error) {
      console.error('Erro ao buscar dados financeiros:', error);
      throw error;
    }
  }

  /**
   * Gera um relatório no formato do sistema ELSTER (sistema fiscal alemão)
   * 
   * @param periodo Período do relatório
   * @param dados Dados financeiros
   * @returns String XML formatada para o sistema ELSTER
   */
  async gerarElsterReport(periodo: string, dados: any): Promise<string> {
    try {
      console.log(`Gerando relatório ELSTER para ${periodo}`);
      
      // Simulação - em um ambiente real, utilizaria bibliotecas específicas para o ELSTER
      const elsterXML = `<?xml version="1.0" encoding="UTF-8"?>
<Elster xmlns="http://www.elster.de/elsterxml/schema/v11">
  <TransferHeader version="11">
    <Verfahren>ElsterAnmeldung</Verfahren>
    <DatenArt>UStVA</DatenArt>
    <Zeitraum>${periodo.replace('-', '')}</Zeitraum>
  </TransferHeader>
  <Nutzdatenblock>
    <Nutzdaten>
      <Anmeldungssteuern art="USt" zeitraum="${periodo.replace('-', '')}">
        <Unternehmer>
          <Steuernummer>12345678901</Steuernummer>
          <Name>${dados.firma || 'Musterfirma GmbH'}</Name>
        </Unternehmer>
        <Umsaetze>
          <Steuerbetraege>
            <Kz81>${dados.resumo?.receita || 0}</Kz81>
            <Kz66>${this.taxEngine.calcularMehrwertsteuer(dados.resumo?.receita || 0)}</Kz66>
          </Steuerbetraege>
        </Umsaetze>
      </Anmeldungssteuern>
    </Nutzdaten>
  </Nutzdatenblock>
</Elster>`;
      
      return elsterXML;
    } catch (error) {
      console.error('Erro ao gerar relatório ELSTER:', error);
      throw error;
    }
  }

  /**
   * Gera um relatório no formato XBRL (eXtensible Business Reporting Language)
   * 
   * @param periodo Período do relatório
   * @param dados Dados financeiros
   * @param tipo Tipo de relatório (anual, trimestral, mensal)
   * @returns String XBRL formatada
   */
  async gerarXBRLReport(periodo: string, dados: any, tipo: string): Promise<string> {
    try {
      console.log(`Gerando relatório XBRL ${tipo} para ${periodo}`);
      
      // Contexto para definir o período do relatório
      const contextRef = tipo === 'anual' ? 'FY' : tipo === 'trimestral' ? 'Q' : 'M';
      const contextId = `${contextRef}_${periodo.replace('-', '')}`;
      
      // Simulação - em um ambiente real, utilizaria bibliotecas específicas para XBRL
      const xbrlString = `<?xml version="1.0" encoding="UTF-8"?>
<xbrl 
  xmlns="http://www.xbrl.org/2003/instance"
  xmlns:link="http://www.xbrl.org/2003/linkbase"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:iso4217="http://www.xbrl.org/2003/iso4217"
  xmlns:ifrs-gp="http://xbrl.ifrs.org/taxonomy/2021-03-24/ifrs-gp"
>
  <link:schemaRef xlink:type="simple" xlink:href="http://xbrl.ifrs.org/taxonomy/2021-03-24/full_ifrs/full_ifrs-cor_2021-03-24.xsd"/>
  
  <context id="${contextId}">
    <entity>
      <identifier scheme="http://standards.iso.org/iso/17442">123456789ABCDEFGHIJ</identifier>
    </entity>
    <period>
      <startDate>${periodo}-01</startDate>
      <endDate>${periodo}-${tipo === 'anual' ? '12-31' : tipo === 'trimestral' ? '03-31' : '30'}</endDate>
    </period>
  </context>
  
  <unit id="EUR">
    <measure>iso4217:EUR</measure>
  </unit>
  
  <ifrs-gp:Revenue contextRef="${contextId}" unitRef="EUR" decimals="2">${dados.resumo?.receita || 0}</ifrs-gp:Revenue>
  <ifrs-gp:CostOfSales contextRef="${contextId}" unitRef="EUR" decimals="2">${dados.resumo?.despesas || 0}</ifrs-gp:CostOfSales>
  <ifrs-gp:GrossProfit contextRef="${contextId}" unitRef="EUR" decimals="2">${(dados.resumo?.receita || 0) - (dados.resumo?.despesas || 0)}</ifrs-gp:GrossProfit>
  <ifrs-gp:ProfitLossBeforeTax contextRef="${contextId}" unitRef="EUR" decimals="2">${dados.resumo?.saldo || 0}</ifrs-gp:ProfitLossBeforeTax>
</xbrl>`;
      
      return xbrlString;
    } catch (error) {
      console.error('Erro ao gerar relatório XBRL:', error);
      throw error;
    }
  }

  /**
   * Gera um relatório PDF com dados financeiros
   * 
   * @param periodo Período do relatório
   * @param idioma Idioma do relatório (pt, en, de)
   * @returns Buffer com o PDF gerado
   */
  async gerarRelatorioPDF(periodo: string, idioma: string): Promise<Buffer> {
    try {
      // Obtém os dados financeiros
      const dados = await this.getDadosFinanceiros(periodo);
      
      // Configurações de texto baseadas no idioma
      const textos = this.getTextosRelatorio(idioma);
      
      // Criar um buffer para armazenar o PDF
      const buffers: Buffer[] = [];
      
      // Criar documento PDF
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: `${textos.titulo} - ${periodo}`,
          Author: 'Sistema Estrateo',
          Subject: `${textos.subtitulo} ${periodo}`
        }
      });
      
      // Capturar o conteúdo do PDF em buffers
      doc.on('data', buffer => buffers.push(buffer));
      
      // Adicionar conteúdo ao PDF
      // Cabeçalho
      doc.fontSize(20).font('Helvetica-Bold').text(textos.titulo, { align: 'center' });
      doc.fontSize(14).font('Helvetica').text(`${textos.periodo}: ${periodo}`, { align: 'center' });
      doc.moveDown();
      
      // Resumo financeiro
      doc.fontSize(16).font('Helvetica-Bold').text(textos.resumoFinanceiro);
      doc.moveDown(0.5);
      
      // Tabela de resumo
      const resumoY = doc.y;
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text(textos.receitas, 50, resumoY);
      doc.text(this.formatarMoeda(dados.resumo.receita), 300, resumoY, { align: 'right' });
      
      doc.text(textos.despesas, 50, resumoY + 25);
      doc.text(this.formatarMoeda(dados.resumo.despesas), 300, resumoY + 25, { align: 'right' });
      
      doc.moveTo(50, resumoY + 50).lineTo(300, resumoY + 50).stroke();
      
      doc.text(textos.saldo, 50, resumoY + 60);
      doc.text(this.formatarMoeda(dados.resumo.saldo), 300, resumoY + 60, { align: 'right' });
      
      doc.moveDown(3);
      
      // Cálculos de impostos alemães
      doc.fontSize(16).font('Helvetica-Bold').text(textos.calculosImpostos);
      doc.moveDown(0.5);
      
      const impostos = this.taxEngine.calcularImpostosAlemanha({
        receita: dados.resumo.receita,
        despesas: dados.resumo.despesas,
        periodo
      });
      
      const impostosY = doc.y;
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('Mehrwertsteuer (19%)', 50, impostosY);
      doc.text(this.formatarMoeda(impostos.mehrwertsteuer.normal), 300, impostosY, { align: 'right' });
      
      doc.text('Mehrwertsteuer (7%)', 50, impostosY + 25);
      doc.text(this.formatarMoeda(impostos.mehrwertsteuer.reduzido), 300, impostosY + 25, { align: 'right' });
      
      doc.text('Gewerbesteuer', 50, impostosY + 50);
      doc.text(this.formatarMoeda(impostos.gewerbesteuer), 300, impostosY + 50, { align: 'right' });
      
      doc.moveTo(50, impostosY + 75).lineTo(300, impostosY + 75).stroke();
      
      doc.text(textos.totalImpostos, 50, impostosY + 85);
      const totalImpostos = impostos.mehrwertsteuer.normal + impostos.mehrwertsteuer.reduzido + impostos.gewerbesteuer;
      doc.text(this.formatarMoeda(totalImpostos), 300, impostosY + 85, { align: 'right' });
      
      // Finalizar documento
      doc.end();
      
      // Retornar quando o documento estiver completo
      return new Promise<Buffer>((resolve, reject) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(buffers);
          resolve(pdfBuffer);
        });
        
        doc.on('error', reject);
      });
    } catch (error) {
      console.error('Erro ao gerar relatório PDF:', error);
      throw error;
    }
  }

  /**
   * Obtém as configurações de impostos por tipo de produto/serviço
   * 
   * @returns Lista de configurações de impostos
   */
  async getConfiguracoesImposto(): Promise<ConfiguracaoImposto[]> {
    try {
      // Em uma implementação real, buscaria do banco de dados
      // Para este exemplo, retornamos dados mockados
      
      return [
        {
          id: 'alimentos',
          categoria: 'Alimentos',
          descricao: 'Produtos alimentícios básicos',
          taxaMehrwertsteuer: 7, // Taxa reduzida na Alemanha
          taxaGewerbesteuer: 3.5,
          aplicavelExportacao: true
        },
        {
          id: 'bebidas_alcoolicas',
          categoria: 'Bebidas Alcoólicas',
          descricao: 'Cervejas, vinhos e destilados',
          taxaMehrwertsteuer: 19, // Taxa normal na Alemanha
          taxaGewerbesteuer: 3.5,
          aplicavelExportacao: true
        },
        {
          id: 'servicos_restaurante',
          categoria: 'Serviços de Restaurante',
          descricao: 'Serviços prestados no local',
          taxaMehrwertsteuer: 19,
          taxaGewerbesteuer: 3.5,
          aplicavelExportacao: false
        },
        {
          id: 'software',
          categoria: 'Software',
          descricao: 'Licenças e serviços de software',
          taxaMehrwertsteuer: 19,
          taxaGewerbesteuer: 3.5,
          aplicavelExportacao: true
        },
        {
          id: 'livros',
          categoria: 'Livros',
          descricao: 'Livros físicos e eletrônicos',
          taxaMehrwertsteuer: 7,
          taxaGewerbesteuer: 3.5,
          aplicavelExportacao: true
        }
      ];
    } catch (error) {
      console.error('Erro ao buscar configurações de impostos:', error);
      throw error;
    }
  }

  /**
   * Atualiza configurações de impostos por tipo de produto/serviço
   * 
   * @param configuracoes Novas configurações
   */
  async atualizarConfiguracoesImposto(configuracoes: ConfiguracaoImposto[]): Promise<void> {
    try {
      // Em uma implementação real, atualizaria no banco de dados
      // Para este exemplo, apenas logamos as configurações
      
      console.log('Atualizando configurações de impostos:', configuracoes);
      
      // Simulamos uma pequena demora para simular escrita no banco
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return;
    } catch (error) {
      console.error('Erro ao atualizar configurações de impostos:', error);
      throw error;
    }
  }

  /**
   * Helper - Formata um valor monetário no padrão europeu
   * 
   * @param valor Valor a ser formatado
   * @returns String formatada (€X.XXX,XX)
   */
  private formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor);
  }

  /**
   * Helper - Obtém textos do relatório de acordo com o idioma
   * 
   * @param idioma Código do idioma (pt, en, de)
   * @returns Objeto com textos traduzidos
   */
  private getTextosRelatorio(idioma: string): Record<string, string> {
    const textos: Record<string, Record<string, string>> = {
      pt: {
        titulo: 'Relatório Financeiro',
        subtitulo: 'Dados financeiros para o período',
        periodo: 'Período',
        resumoFinanceiro: 'Resumo Financeiro',
        receitas: 'Receitas',
        despesas: 'Despesas',
        saldo: 'Saldo',
        calculosImpostos: 'Cálculos de Impostos (Alemanha)',
        totalImpostos: 'Total de Impostos'
      },
      en: {
        titulo: 'Financial Report',
        subtitulo: 'Financial data for the period',
        periodo: 'Period',
        resumoFinanceiro: 'Financial Summary',
        receitas: 'Revenue',
        despesas: 'Expenses',
        saldo: 'Balance',
        calculosImpostos: 'Tax Calculations (Germany)',
        totalImpostos: 'Total Taxes'
      },
      de: {
        titulo: 'Finanzbericht',
        subtitulo: 'Finanzdaten für den Zeitraum',
        periodo: 'Zeitraum',
        resumoFinanceiro: 'Finanzübersicht',
        receitas: 'Einnahmen',
        despesas: 'Ausgaben',
        saldo: 'Saldo',
        calculosImpostos: 'Steuerberechnungen (Deutschland)',
        totalImpostos: 'Steuern Gesamt'
      }
    };
    
    return textos[idioma] || textos.pt;
  }
}

export default ContadorService; 