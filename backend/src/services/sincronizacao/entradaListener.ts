/**
 * Serviço para sincronização de entradas com outros módulos
 * Service for synchronizing income entries with other modules
 * 
 * Este serviço escuta eventos relacionados a entradas financeiras e atualiza
 * os módulos afetados, como Contador, Financeiro e Relatórios
 * 
 * This service listens to income-related events and updates
 * the affected modules, such as Accounting, Financial, and Reports
 */

import prisma from '../../lib/prisma';
import { EventBus } from '../../lib/EventBus';
import { format } from 'date-fns';

export interface Entrada {
  id: string;
  descricao: string;
  valor: number;
  data: Date;
  categoria: string;
  fonte: string;
  
  // Campos novos
  tipoEntrada?: string;
  statusRecebimento?: string;
  dataPrevistaRecebimento?: Date;
  cliente?: string;
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
 * Inicializa os listeners para eventos relacionados a entradas
 * Initializes listeners for income-related events
 */
export function initializeEntradaListeners() {
  console.log('[EntradaListener] Inicializando listeners de entradas');
  
  // Ouve evento de criação de entrada
  // Listens for income creation event
  EventBus.on('entrada.criada', async (entrada: Entrada) => {
    console.log('[EntradaListener] Processando evento entrada.criada', entrada.id);
    
    try {
      // Atualiza o módulo Financeiro
      await atualizarFinanceiro(entrada);
      
      // Notifica o módulo Contador
      await notificarContador(entrada);
      
      // Atualiza relatórios
      await atualizarRelatorios(entrada);
      
      console.log('[EntradaListener] Entrada sincronizada com sucesso', entrada.id);
    } catch (error) {
      console.error('[EntradaListener] Erro ao sincronizar entrada:', error);
    }
  });
  
  // Ouve evento de atualização de entrada
  // Listens for income update event
  EventBus.on('entrada.atualizada', async (entrada: Entrada) => {
    console.log('[EntradaListener] Processando evento entrada.atualizada', entrada.id);
    
    try {
      // Atualiza o módulo Financeiro
      await atualizarFinanceiro(entrada, true);
      
      // Notifica o módulo Contador
      await notificarContador(entrada, true);
      
      // Atualiza relatórios
      await atualizarRelatorios(entrada, true);
      
      console.log('[EntradaListener] Atualização de entrada sincronizada com sucesso', entrada.id);
    } catch (error) {
      console.error('[EntradaListener] Erro ao sincronizar atualização de entrada:', error);
    }
  });
  
  // Ouve evento de exclusão de entrada
  // Listens for income deletion event
  EventBus.on('entrada.excluida', async (entradaId: string) => {
    console.log('[EntradaListener] Processando evento entrada.excluida', entradaId);
    
    try {
      // Remove do Financeiro
      await removerDoFinanceiro(entradaId);
      
      // Notifica o módulo Contador sobre a exclusão
      await notificarContadorSobreExclusao(entradaId);
      
      // Atualiza relatórios após exclusão
      await atualizarRelatoriosAposExclusao(entradaId);
      
      console.log('[EntradaListener] Exclusão de entrada sincronizada com sucesso', entradaId);
    } catch (error) {
      console.error('[EntradaListener] Erro ao sincronizar exclusão de entrada:', error);
    }
  });
  
  // Novos eventos para entradas parceladas
  
  // Ouve evento de criação de entrada parcelada
  EventBus.on('entrada.parcelada.criada', async (entrada: Entrada) => {
    console.log('[EntradaListener] Processando evento entrada.parcelada.criada', entrada.id);
    
    try {
      // Cria o registro principal da entrada
      await atualizarFinanceiro(entrada);
      
      // Cria os registros para cada parcela
      if (entrada.parcelas && entrada.parcelas.length > 0) {
        await criarParcelas(entrada);
      }
      
      // Notifica o módulo Contador
      await notificarContador(entrada);
      
      // Atualiza relatórios
      await atualizarRelatorios(entrada);
      
      console.log('[EntradaListener] Entrada parcelada sincronizada com sucesso', entrada.id);
    } catch (error) {
      console.error('[EntradaListener] Erro ao sincronizar entrada parcelada:', error);
    }
  });
  
  // Ouve evento de pagamento de parcela
  EventBus.on('entrada.parcela.paga', async (dadosParcela: { entradaId: string, parcelaId: string, dataPagamento: Date }) => {
    console.log('[EntradaListener] Processando evento entrada.parcela.paga', dadosParcela.parcelaId);
    
    try {
      // Atualiza o status da parcela no banco de dados
      await atualizarStatusParcela(dadosParcela.parcelaId, true, dadosParcela.dataPagamento);
      
      // Verifica e atualiza o status geral da entrada se necessário
      await verificarStatusEntrada(dadosParcela.entradaId);
      
      console.log('[EntradaListener] Pagamento de parcela registrado com sucesso', dadosParcela.parcelaId);
    } catch (error) {
      console.error('[EntradaListener] Erro ao registrar pagamento de parcela:', error);
    }
  });
}

/**
 * Atualiza o módulo Financeiro com dados da entrada
 * Updates the Financial module with income data
 */
async function atualizarFinanceiro(entrada: Entrada, isUpdate = false) {
  try {
    // Verifica se já existe um registro financeiro para esta entrada
    const registroExistente = await prisma.financeiro.findFirst({
      where: {
        referenciaId: entrada.id,
        tipo: 'receita'
      }
    });
    
    const dadosFinanceiro = {
      descricao: entrada.descricao,
      data: entrada.data,
      tipo: 'receita',
      valor: entrada.valor,
      categoria: entrada.categoria,
      referenciaId: entrada.id,
      // Novos campos
      tipoEntrada: entrada.tipoEntrada,
      statusRecebimento: entrada.statusRecebimento,
      dataPrevistaRecebimento: entrada.dataPrevistaRecebimento,
      cliente: entrada.cliente,
      formaPagamento: entrada.formaPagamento,
      numeroDocumento: entrada.numeroDocumento,
      parcelamento: entrada.parcelamento || false,
      quantidadeParcelas: entrada.quantidadeParcelas
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
    console.error('[EntradaListener] Erro ao atualizar financeiro:', error);
    throw error;
  }
}

/**
 * Cria registros de parcelas para entrada parcelada
 * Creates installment records for a installment income entry
 */
async function criarParcelas(entrada: Entrada) {
  try {
    // Primeiro busca o registro financeiro principal
    const registroFinanceiro = await prisma.financeiro.findFirst({
      where: {
        referenciaId: entrada.id,
        tipo: 'receita'
      }
    });
    
    if (!registroFinanceiro) {
      throw new Error('Registro financeiro principal não encontrado');
    }
    
    // Para cada parcela, cria um registro no banco de dados
    for (const parcela of entrada.parcelas || []) {
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
    console.error('[EntradaListener] Erro ao criar parcelas:', error);
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
    console.error('[EntradaListener] Erro ao atualizar status da parcela:', error);
    throw error;
  }
}

/**
 * Verifica e atualiza o status geral de uma entrada parcelada
 * Checks and updates the general status of an installment income entry
 */
async function verificarStatusEntrada(entradaId: string) {
  try {
    // Busca o registro financeiro
    const registroFinanceiro = await prisma.financeiro.findFirst({
      where: {
        referenciaId: entradaId,
        tipo: 'receita'
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
      novoStatus = 'recebido';
    } else if (algumasPagas) {
      novoStatus = 'parcialmente_recebido';
    } else {
      novoStatus = 'pendente';
    }
    
    // Atualiza o status da entrada
    await prisma.financeiro.update({
      where: { id: registroFinanceiro.id },
      data: { statusRecebimento: novoStatus }
    });
  } catch (error) {
    console.error('[EntradaListener] Erro ao verificar status da entrada:', error);
    throw error;
  }
}

/**
 * Notifica o módulo Contador sobre uma nova entrada ou atualização
 * Notifies the Accountant module about a new income entry or update
 */
async function notificarContador(entrada: Entrada, isUpdate = false) {
  try {
    // Implementação para notificar o módulo Contador
    // Implementation to notify the Accountant module
    console.log(`[EntradaListener] Notificando contador sobre ${isUpdate ? 'atualização de' : 'nova'} entrada`);
    
    // Exemplo: registrar no log de atividades contábeis
    // Example: register in the accounting activity log
    const mesAno = format(entrada.data, 'yyyy-MM');
    
    await prisma.logContabilidade.create({
      data: {
        tipo: 'entrada',
        acao: isUpdate ? 'atualização' : 'criação',
        referenciaId: entrada.id,
        valor: entrada.valor,
        mesAno,
        detalhes: JSON.stringify(entrada)
      }
    });
  } catch (error) {
    console.error('[EntradaListener] Erro ao notificar contador:', error);
    throw error;
  }
}

/**
 * Notifica o módulo Contador sobre a exclusão de uma entrada
 * Notifies the Accountant module about an income entry deletion
 */
async function notificarContadorSobreExclusao(entradaId: string) {
  try {
    // Implementação para notificar o módulo Contador sobre exclusão
    // Implementation to notify the Accountant module about deletion
    console.log(`[EntradaListener] Notificando contador sobre exclusão de entrada: ${entradaId}`);
    
    // Exemplo: registrar no log de atividades contábeis
    // Example: register in the accounting activity log
    await prisma.logContabilidade.create({
      data: {
        tipo: 'entrada',
        acao: 'exclusão',
        referenciaId: entradaId,
        mesAno: format(new Date(), 'yyyy-MM'), // Como a entrada foi excluída, usamos a data atual
        detalhes: JSON.stringify({ id: entradaId })
      }
    });
  } catch (error) {
    console.error('[EntradaListener] Erro ao notificar contador sobre exclusão:', error);
    throw error;
  }
}

/**
 * Atualiza relatórios com dados da entrada
 * Updates reports with income entry data
 */
async function atualizarRelatorios(entrada: Entrada, isUpdate = false) {
  try {
    // Implementação para atualizar os relatórios
    // Implementation to update reports
    console.log(`[EntradaListener] Atualizando relatórios com ${isUpdate ? 'atualização de' : 'nova'} entrada`);
    
    // Exemplo: atualizar dados do relatório mensal
    // Example: update monthly report data
    const mesAno = format(entrada.data, 'yyyy-MM');
    
    // Verificar se já existe um resumo para este mês
    const resumoExistente = await prisma.resumoMensal.findFirst({
      where: { mesAno }
    });
    
    if (resumoExistente) {
      // Se for uma atualização, pode ser necessário ajustar valores
      if (isUpdate) {
        // Buscar o valor anterior para fazer o ajuste
        const entradaAnterior = await prisma.financeiro.findFirst({
          where: {
            referenciaId: entrada.id,
            tipo: 'receita'
          }
        });
        
        if (entradaAnterior) {
          const diferenca = entrada.valor - entradaAnterior.valor;
          
          // Atualizar o resumo com a diferença
          await prisma.resumoMensal.update({
            where: { id: resumoExistente.id },
            data: {
              totalEntradas: { increment: diferenca },
              saldoFinal: { increment: diferenca }
            }
          });
        }
      } else {
        // Se for uma nova entrada, apenas adicionar o valor
        await prisma.resumoMensal.update({
          where: { id: resumoExistente.id },
          data: {
            totalEntradas: { increment: entrada.valor },
            saldoFinal: { increment: entrada.valor }
          }
        });
      }
    } else {
      // Se não existir resumo para o mês, criar um novo
      await prisma.resumoMensal.create({
        data: {
          mesAno,
          totalEntradas: entrada.valor,
          totalSaidas: 0,
          saldoFinal: entrada.valor,
          saldoAnterior: 0 // Idealmente, seria o saldo do mês anterior
        }
      });
    }
  } catch (error) {
    console.error('[EntradaListener] Erro ao atualizar relatórios:', error);
    throw error;
  }
}

/**
 * Atualiza relatórios após exclusão de uma entrada
 * Updates reports after an income entry deletion
 */
async function atualizarRelatoriosAposExclusao(entradaId: string) {
  try {
    // Procurar a entrada no backup (ou em um log) para conseguir o valor e a data
    // Find the entry in backup (or in a log) to get the value and date
    const entradaLog = await prisma.logContabilidade.findFirst({
      where: {
        referenciaId: entradaId,
        tipo: 'entrada',
        acao: 'criação'
      }
    });
    
    if (!entradaLog) {
      console.log('[EntradaListener] Log da entrada não encontrado, não é possível atualizar relatórios');
      return;
    }
    
    // Parse dos detalhes do log
    const detalhes = JSON.parse(entradaLog.detalhes);
    const valor = detalhes.valor || 0;
    const mesAno = entradaLog.mesAno;
    
    // Atualizar o resumo mensal
    const resumoExistente = await prisma.resumoMensal.findFirst({
      where: { mesAno }
    });
    
    if (resumoExistente) {
      await prisma.resumoMensal.update({
        where: { id: resumoExistente.id },
        data: {
          totalEntradas: { decrement: valor },
          saldoFinal: { decrement: valor }
        }
      });
    }
  } catch (error) {
    console.error('[EntradaListener] Erro ao atualizar relatórios após exclusão:', error);
    throw error;
  }
}

/**
 * Remove uma entrada do módulo Financeiro
 * Removes an income entry from the Financial module
 */
async function removerDoFinanceiro(entradaId: string) {
  try {
    // Primeiro, excluir as parcelas associadas (se houver)
    const registroFinanceiro = await prisma.financeiro.findFirst({
      where: {
        referenciaId: entradaId,
        tipo: 'receita'
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
          referenciaId: entradaId,
          tipo: 'receita'
        }
      });
    }
  } catch (error) {
    console.error('[EntradaListener] Erro ao remover do financeiro:', error);
    throw error;
  }
} 