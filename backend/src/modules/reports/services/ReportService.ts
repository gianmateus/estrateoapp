import { PrismaClient } from '@prisma/client';
import { format } from 'date-fns';

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

export class ReportService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async generateReport(startDate: Date, endDate: Date): Promise<ReportData> {
    // Buscar entradas financeiras
    const entries = await this.prisma.entrada.findMany({
      where: {
        data: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        categoria: true,
      },
    });

    // Buscar saídas financeiras
    const exits = await this.prisma.saida.findMany({
      where: {
        data: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        categoria: true,
      },
    });

    // Buscar produtos com estoque crítico
    const criticalStock = await this.prisma.produto.findMany({
      where: {
        quantidade: {
          lte: this.prisma.produto.fields.quantidadeMinima,
        },
      },
    });

    // Buscar movimentações de estoque
    const inventoryMovements = await this.prisma.movimentacaoEstoque.findMany({
      where: {
        data: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        produto: true,
      },
    });

    // Agrupar entradas por categoria
    const entriesByCategory = this.groupByCategory(entries, 'entrada');
    
    // Agrupar saídas por categoria
    const exitsByCategory = this.groupByCategory(exits, 'saida');

    // Calcular saldo
    const totalEntries = entries.reduce((sum, entry) => sum + entry.valor, 0);
    const totalExits = exits.reduce((sum, exit) => sum + exit.valor, 0);
    const balance = totalEntries - totalExits;

    // Agrupar movimentações de estoque por produto
    const inventoryMovementsByProduct = this.groupInventoryMovements(inventoryMovements);

    return {
      period: {
        start: format(startDate, 'dd/MM/yyyy'),
        end: format(endDate, 'dd/MM/yyyy'),
      },
      financial: {
        entries: entriesByCategory,
        exits: exitsByCategory,
        balance,
      },
      inventory: {
        critical: criticalStock.map(product => ({
          product: product.nome,
          currentStock: product.quantidade,
          minimumStock: product.quantidadeMinima,
        })),
        movements: inventoryMovementsByProduct,
      },
    };
  }

  private groupByCategory(transactions: any[], type: 'entrada' | 'saida') {
    const grouped = transactions.reduce((acc, transaction) => {
      const category = transaction.categoria.nome;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += transaction.valor;
      return acc;
    }, {});

    return Object.entries(grouped).map(([category, total]) => ({
      category,
      total: Number(total),
    }));
  }

  private groupInventoryMovements(movements: any[]) {
    const grouped = movements.reduce((acc, movement) => {
      const product = movement.produto.nome;
      if (!acc[product]) {
        acc[product] = { entries: 0, exits: 0 };
      }
      if (movement.tipo === 'ENTRADA') {
        acc[product].entries += movement.quantidade;
      } else {
        acc[product].exits += movement.quantidade;
      }
      return acc;
    }, {});

    return Object.entries(grouped).map(([product, data]: [string, any]) => ({
      product,
      entries: data.entries,
      exits: data.exits,
    }));
  }
} 