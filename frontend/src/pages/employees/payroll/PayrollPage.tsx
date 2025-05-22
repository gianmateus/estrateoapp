import React, { useState, useEffect } from 'react';
import { Box, Typography, Tab, Tabs, Alert, Snackbar } from '@mui/material';
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
  status: 'pago' | 'pendente' | 'atrasado';
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
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'error' | 'warning' | 'info' | 'success'>('error');
  
  // Filtros
  const [monthYear, setMonthYear] = useState<{month: number, year: number}>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  });
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pago' | 'pendente' | 'atrasado'>('todos');

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
      status: 'atrasado',
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
        setAlertMessage('Erro ao carregar dados');
        setAlertSeverity('error');
        setAlertOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [t]);

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

  // Manipulador para marcar como pago/pendente/atrasado
  const handleToggleStatus = (id: string) => {
    setPayments(prevPayments =>
      prevPayments.map(payment => {
        if (payment.id === id) {
          // Ciclo entre os estados: pendente -> pago -> atrasado -> pendente
          let newStatus: 'pago' | 'pendente' | 'atrasado';
          
          if (payment.status === 'pendente') {
            newStatus = 'pago';
          } else if (payment.status === 'pago') {
            newStatus = 'atrasado';
          } else {
            newStatus = 'pendente';
          }
          
          return { ...payment, status: newStatus };
        }
        return payment;
      })
    );
  };

  // Verificar se já existe pagamento para o funcionário no mesmo mês/ano
  const checkExistingPayment = (employeeId: string, month: number, year: number, currentId?: string): boolean => {
    return payments.some(p => 
      p.employeeId === employeeId && 
      p.month === month && 
      p.year === year && 
      p.id !== currentId
    );
  };

  // Manipulador para salvar pagamento
  const handleSavePayment = (payment: PaymentData) => {
    const isEditing = !!currentPayment;
    const currentId = isEditing ? currentPayment.id : undefined;
    
    // Verificar pagamento duplicado
    if (checkExistingPayment(payment.employeeId, monthYear.month, monthYear.year, currentId)) {
      setAlertMessage('Pagamento duplicado para este funcionário no mesmo período');
      setAlertSeverity('error');
      setAlertOpen(true);
      return;
    }
    
    if (isEditing) {
      // Atualizar pagamento existente
      setPayments(prevPayments =>
        prevPayments.map(p => (p.id === payment.id ? payment : p))
      );
      setAlertMessage('Pagamento atualizado com sucesso');
      setAlertSeverity('success');
    } else {
      // Adicionar novo pagamento
      const newPayment = {
        ...payment,
        id: Date.now().toString(), // Gerar ID único baseado em timestamp
        month: monthYear.month,
        year: monthYear.year
      };
      setPayments(prevPayments => [...prevPayments, newPayment]);
      setAlertMessage('Pagamento adicionado com sucesso');
      setAlertSeverity('success');
    }
    
    setModalOpen(false);
    setAlertOpen(true);
  };

  // Fechar o alerta
  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <MoneyIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
          <Typography variant="h5" component="h1" color="primary" fontWeight="bold">
            Folha de Pagamento
          </Typography>
        </Box>
        <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 4 }}>
          Funcionários
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
      
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PayrollPage; 