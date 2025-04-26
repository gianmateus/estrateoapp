import React, { useState, useEffect } from 'react';
import { Box, Typography, Tab, Tabs } from '@mui/material';
import { Money as MoneyIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import PayrollTable from './PayrollTable';
import PayrollFilter from './PayrollFilter';
import PayrollModal from './PayrollModal';
import ExportButton from './ExportButton';

// Interface para os dados de pagamento
export interface PaymentData {
  id: string;
  employeeId: string;
  employeeName: string;
  contractType: 'mensalista' | 'horista';
  hoursWorked: number;
  grossAmount: number;
  deductions: number;
  netAmount: number;
  status: 'pago' | 'pendente';
  observations?: string;
  month: number;
  year: number;
}

const PayrollPage: React.FC = () => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState<PaymentData[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<PaymentData | null>(null);
  
  // Filtros
  const [monthYear, setMonthYear] = useState<{month: number, year: number}>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pago' | 'pendente'>('todos');

  // Mock de dados para exemplo
  const mockPayments: PaymentData[] = [
    {
      id: '1',
      employeeId: '1',
      employeeName: 'Maria Silva',
      contractType: 'mensalista',
      hoursWorked: 160,
      grossAmount: 4500,
      deductions: 450,
      netAmount: 4050,
      status: 'pago',
      month: 4,
      year: 2025
    },
    {
      id: '2',
      employeeId: '2',
      employeeName: 'João Santos',
      contractType: 'mensalista',
      hoursWorked: 160,
      grossAmount: 3800,
      deductions: 380,
      netAmount: 3420,
      status: 'pago',
      month: 4,
      year: 2025
    },
    {
      id: '3',
      employeeId: '3',
      employeeName: 'Ana Oliveira',
      contractType: 'horista',
      hoursWorked: 140,
      grossAmount: 2200,
      deductions: 220,
      netAmount: 1980,
      status: 'pendente',
      month: 4,
      year: 2025
    },
    {
      id: '4',
      employeeId: '4',
      employeeName: 'Pedro Costa',
      contractType: 'horista',
      hoursWorked: 180,
      grossAmount: 1800,
      deductions: 180,
      netAmount: 1620,
      status: 'pendente',
      month: 4,
      year: 2025
    },
    {
      id: '5',
      employeeId: '5',
      employeeName: 'Juliana Pereira',
      contractType: 'mensalista',
      hoursWorked: 160,
      grossAmount: 2000,
      deductions: 200,
      netAmount: 1800,
      status: 'pago',
      month: 4,
      year: 2025
    }
  ];

  // Buscar dados
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Simulação de chamada à API
        await new Promise(resolve => setTimeout(resolve, 800));
        setPayments(mockPayments);
      } catch (error) {
        console.error('Erro ao buscar dados de pagamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Atualizar dados filtrados
  useEffect(() => {
    let filtered = [...payments];
    
    // Filtrar por mês e ano
    filtered = filtered.filter(p => 
      p.month === monthYear.month && p.year === monthYear.year
    );
    
    // Filtrar por status
    if (statusFilter !== 'todos') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }
    
    setFilteredPayments(filtered);
  }, [payments, monthYear, statusFilter]);

  // Manipulador para abrir modal de novo pagamento
  const handleAddPayment = () => {
    setCurrentPayment(null);
    setModalOpen(true);
  };

  // Manipulador para abrir modal de edição
  const handleEditPayment = (payment: PaymentData) => {
    setCurrentPayment(payment);
    setModalOpen(true);
  };

  // Manipulador para marcar como pago/pendente
  const handleToggleStatus = (id: string) => {
    setPayments(prevPayments =>
      prevPayments.map(payment =>
        payment.id === id
          ? { ...payment, status: payment.status === 'pago' ? 'pendente' : 'pago' }
          : payment
      )
    );
  };

  // Manipulador para salvar pagamento
  const handleSavePayment = (payment: PaymentData) => {
    if (currentPayment) {
      // Atualizar pagamento existente
      setPayments(prevPayments =>
        prevPayments.map(p => (p.id === payment.id ? payment : p))
      );
    } else {
      // Adicionar novo pagamento
      const newPayment = {
        ...payment,
        id: (payments.length + 1).toString(),
        month: monthYear.month,
        year: monthYear.year
      };
      setPayments(prevPayments => [...prevPayments, newPayment]);
    }
    setModalOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          <MoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {t('folhaPagamento')}
        </Typography>
      </Box>

      <PayrollFilter 
        monthYear={monthYear} 
        setMonthYear={setMonthYear} 
        statusFilter={statusFilter} 
        setStatusFilter={setStatusFilter} 
        onAddPayment={handleAddPayment}
      />

      <ExportButton payments={filteredPayments} monthYear={monthYear} />

      <PayrollTable 
        payments={filteredPayments} 
        loading={loading} 
        onEditPayment={handleEditPayment} 
        onToggleStatus={handleToggleStatus} 
      />

      <PayrollModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        payment={currentPayment} 
        onSave={handleSavePayment} 
      />
    </Box>
  );
};

export default PayrollPage; 