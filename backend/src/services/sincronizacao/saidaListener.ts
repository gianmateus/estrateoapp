/**
 * Serviço para sincronização de saídas com outros módulos
 * Service for synchronizing expense entries with other modules
 * 
 * Este serviço escuta eventos relacionados a saídas financeiras e atualiza
 * os módulos afetados, como Contador, Financeiro e Relatórios
 * 
 * This service listens to expense-related events and updates
 * the affected modules, such as Accounting, Financial, and Reports
 */

import prisma from '../../lib/prisma';
import { EventBus } from '../../lib/EventBus';
import { format } from 'date-fns';

export interface Saida {
  id: string;
  descricao: string;
  valor: number;
  data: Date;
  categoria: string;
  
  // Campos novos
  tipoDespesa?: string;
  dataPrevistaPagamento?: Date;
  fornecedor?: string;
  formaPagamento?: string;
  numeroDocumento?: string;
  parcelamento?: boolean;
  quantidadeParcelas?: number;
  parcelas?: Array<{
    numero: number;
    valorParcela: number;
    dataPrevista: Date;
    pago: boolean;
    dataPagamento?: Date;
  }>;
  
  [key: string]: any;
}

/**
 * Inicializa os listeners para eventos relacionados a saídas
 * Initializes listeners for expense-related events
 */
export function initializeSaidaListeners() {
  console.log('[SaidaListener] Inicializando listeners de saídas');
  
  // Ouve evento de criação de saída
  // Listens for expense creation event
  EventBus.on('pagamento.criado', async (saida: Saida) => {
    console.log('[SaidaListener] Processando evento pagamento.criado', saida.id);
    
    try {
      // Atualiza o módulo Financeiro
      await atualizarFinanceiro(saida);
      
      // Notifica o módulo Contador
      await notificarContador(saida);
      
      // Atualiza relatórios
      await atualizarRelatorios(saida);
      
      console.log('[SaidaListener] Saída sincronizada com sucesso', saida.id);
    } catch (error) {
      console.error('[SaidaListener] Erro ao sincronizar saída:', error);
    }
  });
  
  // Ouve evento de atualização de saída
  // Listens for expense update event
  EventBus.on('pagamento.atualizado', async (saida: Saida) => {
    console.log('[SaidaListener] Processando evento pagamento.atualizado', saida.id);
    
    try {
      // Atualiza o módulo Financeiro
      await atualizarFinanceiro(saida, true);
      
      // Notifica o módulo Contador
      await notificarContador(saida, true);
      
      // Atualiza relatórios
      await atualizarRelatorios(saida, true);
      
      console.log('[SaidaListener] Atualização de saída sincronizada com sucesso', saida.id);
    } catch (error) {
      console.error('[SaidaListener] Erro ao sincronizar atualização de saída:', error);
    }
  });
  
  // Ouve evento de exclusão de saída
  // Listens for expense deletion event
  EventBus.on('pagamento.excluido', async (saidaId: string) => {
    console.log('[SaidaListener] Processando evento pagamento.excluido', saidaId);
    
    try {
      // Remove do Financeiro
      await removerDoFinanceiro(saidaId);
      
      // Notifica o módulo Contador sobre a exclusão
      await notificarContadorSobreExclusao(saidaId);
      
      // Atualiza relatórios após exclusão
      await atualizarRelatoriosAposExclusao(saidaId);
      
      console.log('[SaidaListener] Exclusão de saída sincronizada com sucesso', saidaId);
    } catch (error) {
      console.error('[SaidaListener] Erro ao sincronizar exclusão de saída:', error);
    }
  });
  
  // Novos eventos para saídas parceladas
  
  // Ouve evento de criação de saída parcelada
  EventBus.on('saida.parcelada.criada', async (saida: Saida) => {
    console.log('[SaidaListener] Processando evento saida.parcelada.criada', saida.id);
    
    try {
      // Cria o registro principal da saída
      await atualizarFinanceiro(saida);
      
      // Cria os registros para cada parcela
      if (saida.parcelas && saida.parcelas.length > 0) {
        await criarParcelas(saida);
      }
      
      // Notifica o módulo Contador
      await notificarContador(saida);
      
      // Atualiza relatórios
      await atualizarRelatorios(saida);
      
      console.log('[SaidaListener] Saída parcelada sincronizada com sucesso', saida.id);
    } catch (error) {
      console.error('[SaidaListener] Erro ao sincronizar saída parcelada:', error);
    }
  });
  
  // Ouve evento de pagamento de parcela
  EventBus.on('saida.parcela.paga', async (dadosParcela: { saidaId: string, parcelaId: string, dataPagamento: Date }) => {
    console.log('[SaidaListener] Processando evento saida.parcela.paga', dadosParcela.parcelaId);
    
    try {
      // Atualiza o status da parcela no banco de dados
      await atualizarStatusParcela(dadosParcela.parcelaId, true, dadosParcela.dataPagamento);
      
      // Verifica e atualiza o status geral da saída se necessário
      await verificarStatusSaida(dadosParcela.saidaId);
      
      console.log('[SaidaListener] Pagamento de parcela registrado com sucesso', dadosParcela.parcelaId);
    } catch (error) {
      console.error('[SaidaListener] Erro ao registrar pagamento de parcela:', error);
    }
  });
}

/**
 * Atualiza o módulo Financeiro com dados da saída
 * Updates the Financial module with expense data
 */
async function atualizarFinanceiro(saida: Saida, isUpdate = false) {
  try {
    // Verifica se já existe um registro financeiro para esta saída
    const registroExistente = await prisma.financeiro.findFirst({
      where: {
        referenciaId: saida.id,
        tipo: 'despesa'
      }
    });
    
    const dadosFinanceiro = {
      descricao: saida.descricao,
      data: saida.data,
      tipo: 'despesa',
      valor: saida.valor,
      categoria: saida.categoria,
      referenciaId: saida.id,
      // Novos campos
      tipoDespesa: saida.tipoDespesa,
      dataPrevistaPagamento: saida.dataPrevistaPagamento,
      fornecedor: saida.fornecedor,
      formaPagamento: saida.formaPagamento,
      numeroDocumento: saida.numeroDocumento,
      parcelamento: saida.parcelamento || false,
      quantidadeParcelas: saida.quantidadeParcelas
    };
    
    if (isUpdate && registroExistente) {
      // Atualiza o registro existente
      await prisma.financeiro.update({
        where: { id: registroExistente.id },
        data: dadosFinanceiro
      });
    } else if (!registroExistente) {
      // Cria um novo registro financeiro
      await prisma.financeiro.create({
        data: dadosFinanceiro
      });
    }
  } catch (error) {
    console.error('[SaidaListener] Erro ao atualizar financeiro:', error);
    throw error;
  }
}

/**
 * Cria registros de parcelas para saída parcelada
 * Creates installment records for a installment expense entry
 */
async function criarParcelas(saida: Saida) {
  try {
    // Primeiro busca o registro financeiro principal
    const registroFinanceiro = await prisma.financeiro.findFirst({
      where: {
        referenciaId: saida.id,
        tipo: 'despesa'
      }
    });
    
    if (!registroFinanceiro) {
      throw new Error('Registro financeiro principal não encontrado');
    }
    
    // Para cada parcela, cria um registro no banco de dados
    for (const parcela of saida.parcelas || []) {
      await prisma.parcela.create({
        data: {
          financeiroId: registroFinanceiro.id,
          numero: parcela.numero,
          valorParcela: parcela.valorParcela,
          dataPrevista: parcela.dataPrevista,
          pago: parcela.pago,
          dataPagamento: parcela.dataPagamento
        }
      });
    }
  } catch (error) {
    console.error('[SaidaListener] Erro ao criar parcelas:', error);
    throw error;
  }
}

/**
 * Atualiza o status de pagamento de uma parcela
 * Updates the payment status of an installment
 */
async function atualizarStatusParcela(parcelaId: string, pago: boolean, dataPagamento?: Date) {
  try {
    await prisma.parcela.update({
      where: { id: parcelaId },
      data: {
        pago,
        dataPagamento: pago ? dataPagamento || new Date() : null
      }
    });
  } catch (error) {
    console.error('[SaidaListener] Erro ao atualizar status da parcela:', error);
    throw error;
  }
}

/**
 * Verifica e atualiza o status geral de uma saída parcelada
 * Checks and updates the general status of an installment expense entry
 */
async function verificarStatusSaida(saidaId: string) {
  try {
    // Busca o registro financeiro
    const registroFinanceiro = await prisma.financeiro.findFirst({
      where: {
        referenciaId: saidaId,
        tipo: 'despesa'
      },
      include: {
        parcelas: true
      }
    });
    
    if (!registroFinanceiro || !registroFinanceiro.parcelas.length) {
      return;
    }
    
    // Verifica se todas as parcelas estão pagas
    const todasPagas = registroFinanceiro.parcelas.every(p => p.pago);
    const algumasPagas = registroFinanceiro.parcelas.some(p => p.pago);
    
    // Define o status com base no pagamento das parcelas
    let novoStatus;
    if (todasPagas) {
      novoStatus = 'pago';
    } else if (algumasPagas) {
      novoStatus = 'parcialmente_pago';
    } else {
      novoStatus = 'pendente';
    }
    
    // Atualiza o status da saída
    await prisma.financeiro.update({
      where: { id: registroFinanceiro.id },
      data: { status: novoStatus }
    });
  } catch (error) {
    console.error('[SaidaListener] Erro ao verificar status da saída:', error);
    throw error;
  }
}

/**
 * Notifica o módulo Contador sobre uma nova saída ou atualização
 * Notifies the Accountant module about a new expense entry or update
 */
async function notificarContador(saida: Saida, isUpdate = false) {
  try {
    // Implementação para notificar o módulo Contador
    // Implementation to notify the Accountant module
    console.log(`[SaidaListener] Notificando contador sobre ${isUpdate ? 'atualização de' : 'nova'} saída`);
    
    // Exemplo: registrar no log de atividades contábeis
    // Example: register in the accounting activity log
    const mesAno = format(saida.data, 'yyyy-MM');
    
    await prisma.logContabilidade.create({
      data: {
        tipo: 'saida',
        acao: isUpdate ? 'atualização' : 'criação',
        referenciaId: saida.id,
        valor: saida.valor,
        mesAno,
        detalhes: JSON.stringify(saida)
      }
    });
  } catch (error) {
    console.error('[SaidaListener] Erro ao notificar contador:', error);
    throw error;
  }
}

/**
 * Notifica o módulo Contador sobre a exclusão de uma saída
 * Notifies the Accountant module about an expense entry deletion
 */
async function notificarContadorSobreExclusao(saidaId: string) {
  try {
    // Implementação para notificar o módulo Contador sobre exclusão
    // Implementation to notify the Accountant module about deletion
    console.log(`[SaidaListener] Notificando contador sobre exclusão de saída: ${saidaId}`);
    
    // Exemplo: registrar no log de atividades contábeis
    // Example: register in the accounting activity log
    await prisma.logContabilidade.create({
      data: {
        tipo: 'saida',
        acao: 'exclusão',
        referenciaId: saidaId,
        mesAno: format(new Date(), 'yyyy-MM'), // Como a saída foi excluída, usamos a data atual
        detalhes: JSON.stringify({ id: saidaId })
      }
    });
  } catch (error) {
    console.error('[SaidaListener] Erro ao notificar contador sobre exclusão:', error);
    throw error;
  }
}

/**
 * Atualiza relatórios com dados da saída
 * Updates reports with expense entry data
 */
async function atualizarRelatorios(saida: Saida, isUpdate = false) {
  try {
    // Implementação para atualizar os relatórios
    // Implementation to update reports
    console.log(`[SaidaListener] Atualizando relatórios com ${isUpdate ? 'atualização de' : 'nova'} saída`);
    
    // Exemplo: atualizar dados do relatório mensal
    // Example: update monthly report data
    const mesAno = format(saida.data, 'yyyy-MM');
    
    // Verificar se já existe um resumo para este mês
    const resumoExistente = await prisma.resumoMensal.findFirst({
      where: { mesAno }
    });
    
    if (resumoExistente) {
      // Se for uma atualização, pode ser necessário ajustar valores
      if (isUpdate) {
        // Buscar o valor anterior para fazer o ajuste
        const saidaAnterior = await prisma.financeiro.findFirst({
          where: {
            referenciaId: saida.id,
            tipo: 'despesa'
          }
        });
        
        if (saidaAnterior) {
          const diferenca = saida.valor - saidaAnterior.valor;
          
          // Atualizar o resumo com a diferença
          await prisma.resumoMensal.update({
            where: { id: resumoExistente.id },
            data: {
              totalSaidas: { increment: diferenca },
              saldoFinal: { decrement: diferenca }
            }
          });
        }
      } else {
        // Se for uma nova saída, apenas adicionar o valor
        await prisma.resumoMensal.update({
          where: { id: resumoExistente.id },
          data: {
            totalSaidas: { increment: saida.valor },
            saldoFinal: { decrement: saida.valor }
          }
        });
      }
    } else {
      // Se não existir resumo para o mês, criar um novo
      await prisma.resumoMensal.create({
        data: {
          mesAno,
          totalEntradas: 0,
          totalSaidas: saida.valor,
          saldoFinal: -saida.valor,
          saldoAnterior: 0 // Idealmente, seria o saldo do mês anterior
        }
      });
    }
  } catch (error) {
    console.error('[SaidaListener] Erro ao atualizar relatórios:', error);
    throw error;
  }
}

/**
 * Atualiza relatórios após exclusão de uma saída
 * Updates reports after an expense entry deletion
 */
async function atualizarRelatoriosAposExclusao(saidaId: string) {
  try {
    // Procurar a saída no backup (ou em um log) para conseguir o valor e a data
    // Find the entry in backup (or in a log) to get the value and date
    const saidaLog = await prisma.logContabilidade.findFirst({
      where: {
        referenciaId: saidaId,
        tipo: 'saida',
        acao: 'criação'
      }
    });
    
    if (!saidaLog) {
      console.log('[SaidaListener] Log da saída não encontrado, não é possível atualizar relatórios');
      return;
    }
    
    // Parse dos detalhes do log
    const detalhes = JSON.parse(saidaLog.detalhes);
    const valor = detalhes.valor || 0;
    const mesAno = saidaLog.mesAno;
    
    // Atualizar o resumo mensal
    const resumoExistente = await prisma.resumoMensal.findFirst({
      where: { mesAno }
    });
    
    if (resumoExistente) {
      await prisma.resumoMensal.update({
        where: { id: resumoExistente.id },
        data: {
          totalSaidas: { decrement: valor },
          saldoFinal: { increment: valor }
        }
      });
    }
  } catch (error) {
    console.error('[SaidaListener] Erro ao atualizar relatórios após exclusão:', error);
    throw error;
  }
}

/**
 * Remove uma saída do módulo Financeiro
 * Removes an expense entry from the Financial module
 */
async function removerDoFinanceiro(saidaId: string) {
  try {
    // Primeiro, excluir as parcelas associadas (se houver)
    const registroFinanceiro = await prisma.financeiro.findFirst({
      where: {
        referenciaId: saidaId,
        tipo: 'despesa'
      }
    });
    
    if (registroFinanceiro) {
      // Excluir parcelas
      await prisma.parcela.deleteMany({
        where: {
          financeiroId: registroFinanceiro.id
        }
      });
      
      // Excluir o registro financeiro principal
      await prisma.financeiro.delete({
        where: {
          id: registroFinanceiro.id
        }
      });
    } else {
      // Se não encontrou pelo ID de referência, tenta excluir diretamente
      await prisma.financeiro.deleteMany({
        where: {
          referenciaId: saidaId,
          tipo: 'despesa'
        }
      });
    }
  } catch (error) {
    console.error('[SaidaListener] Erro ao remover do financeiro:', error);
    throw error;
  }
} 