import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  Paper,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Checkbox,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
  Divider,
  FormHelperText,
  Switch
} from '@mui/material';
import { 
  Add as AddIcon, 
  BarChart as ChartIcon, 
  Delete as DeleteIcon,
  Edit as EditIcon,
  EventNote as EventIcon,
  Info as InfoIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { format, parseISO, isToday, addDays, isSameDay } from 'date-fns';
import { ptBR, enUS, de } from 'date-fns/locale';
import { useTheme } from '@mui/material/styles';
// Importando jsPDF de forma simples
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Interface para representar um pagamento no sistema
interface Pagamento {
  id: string;
  nome: string;
  valor: number;
  categoria: string;
  vencimento: string; // formato ISO 8601
  notaFiscal?: string;
  descricao?: string;
  recorrencia: 'nenhuma' | 'semanal' | 'quinzenal' | 'mensal' | 'trimestral';
  pago: boolean;
  createdAt: string; // formato ISO 8601
}

// Categorias de pagamento multilíngue
const getCategorias = (lang: string) => {
  switch(lang) {
    case 'de':
      return [
        { value: 'alimentacao', label: 'Essen' },
        { value: 'internet', label: 'Internet' },
        { value: 'agua', label: 'Wasser' },
        { value: 'fornecedor', label: 'Lieferant' },
        { value: 'financiamento', label: 'Finanzierung' },
        { value: 'outros', label: 'Sonstige' }
      ];
    case 'en':
      return [
        { value: 'alimentacao', label: 'Food' },
        { value: 'internet', label: 'Internet' },
        { value: 'agua', label: 'Water' },
        { value: 'fornecedor', label: 'Supplier' },
        { value: 'financiamento', label: 'Financing' },
        { value: 'outros', label: 'Other' }
      ];
    default: // pt-BR
      return [
        { value: 'alimentacao', label: 'Alimentação' },
        { value: 'internet', label: 'Internet' },
        { value: 'agua', label: 'Água' },
        { value: 'fornecedor', label: 'Fornecedor' },
        { value: 'financiamento', label: 'Financiamento' },
        { value: 'outros', label: 'Outros' }
      ];
  }
};

// Função para obter localização de data com base no idioma
const getDateLocale = (lang: string) => {
  switch(lang) {
    case 'de': return de;
    case 'en': return enUS;
    default: return ptBR;
  }
};

// Componente principal da página de Pagamentos
const Pagamentos = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  
  // Estados
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openRelatorio, setOpenRelatorio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [pagamentoEmEdicao, setPagamentoEmEdicao] = useState<Pagamento | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    valor: '',
    categoria: 'outros',
    vencimento: format(new Date(), 'yyyy-MM-dd'),
    notaFiscal: '',
    descricao: '',
    recorrencia: 'nenhuma' as 'nenhuma' | 'semanal' | 'quinzenal' | 'mensal' | 'trimestral',
    pago: false
  });
  const [formErrors, setFormErrors] = useState({
    nome: '',
    valor: '',
    categoria: '',
    vencimento: ''
  });
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; id: string }>({
    open: false,
    id: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Estados para filtros de ano e mês
  const anoAtual = new Date().getFullYear();
  const mesAtual = new Date().getMonth();
  
  const [filtroAno, setFiltroAno] = useState(anoAtual);
  const [filtroMes, setFiltroMes] = useState(mesAtual);
  
  // Após as declarações de estado
  const [ordenacaoCrescente, setOrdenacaoCrescente] = useState(true);
  const [mostrarAnteriores, setMostrarAnteriores] = useState(true);

  // Função para calcular próxima data com base na recorrência
  const calcularProximaData = (data: Date, recorrencia: string): Date => {
    const novaData = new Date(data);
    switch (recorrencia) {
      case 'semanal':
        novaData.setDate(novaData.getDate() + 7);
        break;
      case 'quinzenal':
        novaData.setDate(novaData.getDate() + 15);
        break;
      case 'mensal':
        novaData.setMonth(novaData.getMonth() + 1);
        break;
      case 'trimestral':
        novaData.setMonth(novaData.getMonth() + 3);
        break;
    }
    return novaData;
  };

  // Função para calcular anos futuros baseado na recorrência
  const calcularAnosFuturos = (pagamento: Pagamento): number[] => {
    const anos = new Set<number>();
    const dataInicial = new Date(pagamento.vencimento);
    const anoInicial = dataInicial.getFullYear();
    
    // Adiciona o ano inicial
    anos.add(anoInicial);
    
    // Para recorrências, projeta 5 anos para frente
    if (pagamento.recorrencia !== 'nenhuma') {
      const anoLimite = anoInicial + 5;
      let dataAtual = dataInicial;
      
      while (dataAtual.getFullYear() <= anoLimite) {
        dataAtual = calcularProximaData(dataAtual, pagamento.recorrencia);
        anos.add(dataAtual.getFullYear());
      }
    }
    
    return Array.from(anos);
  };
  
  // Anos disponíveis para filtro (dinâmico baseado nos dados)
  const anosDisponiveis = useMemo(() => {
    const anos = new Set<number>();
    // Adiciona o ano atual
    anos.add(anoAtual);
    
    // Adiciona anos dos pagamentos
    pagamentos.forEach(pagamento => {
      const ano = new Date(pagamento.vencimento).getFullYear();
      anos.add(ano);
      
      // Para pagamentos recorrentes, adiciona anos futuros
      if (pagamento.recorrencia !== 'nenhuma') {
        const anosFuturos = calcularAnosFuturos(pagamento);
        anosFuturos.forEach(a => anos.add(a));
      }
    });
    
    return Array.from(anos).sort((a, b) => a - b);
  }, [pagamentos, anoAtual]);
  
  // Nomes dos meses para o seletor
  const getNomesMeses = useMemo(() => {
    const locale = getDateLocale(i18n.language);
    return Array.from({ length: 12 }, (_, i) => 
      format(new Date(2021, i, 1), 'MMMM', { locale })
    );
  }, [i18n.language]);

  // Mock de dados para desenvolvimento local
  const mockPagamentos: Pagamento[] = [
    {
      id: '1',
      nome: 'Aluguel Restaurante',
      valor: 2500,
      categoria: 'financiamento',
      vencimento: '2023-05-05T12:00:00Z',
      notaFiscal: 'RG78945612',
      descricao: 'Aluguel mensal',
      recorrencia: 'mensal',
      pago: true,
      createdAt: '2023-04-28T15:30:00Z'
    },
    {
      id: '2',
      nome: 'Fornecedor de Verduras',
      valor: 870.50,
      categoria: 'fornecedor',
      vencimento: new Date().toISOString(),
      notaFiscal: 'NF9865478',
      recorrencia: 'semanal',
      pago: false,
      createdAt: '2023-04-29T09:15:00Z'
    },
    {
      id: '3',
      nome: 'Internet',
      valor: 130,
      categoria: 'internet',
      vencimento: addDays(new Date(), 1).toISOString(),
      recorrencia: 'mensal',
      pago: false,
      createdAt: '2023-04-30T10:20:00Z'
    },
    {
      id: '4',
      nome: 'Conta de Água',
      valor: 275.80,
      categoria: 'agua',
      vencimento: addDays(new Date(), 2).toISOString(),
      notaFiscal: 'WR456789',
      descricao: 'Consumo de abril',
      recorrencia: 'mensal',
      pago: false,
      createdAt: '2023-04-30T14:45:00Z'
    }
  ];

  // Buscar dados da API
  useEffect(() => {
    fetchPagamentos();
  }, []);

  const fetchPagamentos = async () => {
    setLoading(true);
    try {
      // Simulação de uma chamada de API com dados mockados
      await new Promise(resolve => setTimeout(resolve, 500));
      setPagamentos(mockPagamentos);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      setSnackbar({
        open: true,
        message: t('erroAoBuscarPagamentos'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (pagamento?: Pagamento) => {
    if (pagamento) {
      // Modo edição
      setEditando(true);
      setPagamentoEmEdicao(pagamento);
      setFormData({
        nome: pagamento.nome,
        valor: pagamento.valor.toString(),
        categoria: pagamento.categoria,
        vencimento: pagamento.vencimento.split('T')[0], // Remover parte de tempo
        notaFiscal: pagamento.notaFiscal || '',
        descricao: pagamento.descricao || '',
        recorrencia: pagamento.recorrencia,
        pago: pagamento.pago
      });
    } else {
      // Modo criação
      setEditando(false);
      setPagamentoEmEdicao(null);
      setFormData({
        nome: '',
        valor: '',
        categoria: 'outros',
        vencimento: format(new Date(), 'yyyy-MM-dd'),
        notaFiscal: '',
        descricao: '',
        recorrencia: 'nenhuma',
        pago: false
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormErrors({
      nome: '',
      valor: '',
      categoria: '',
      vencimento: ''
    });
  };

  const validateForm = (): boolean => {
    const errors = {
      nome: '',
      valor: '',
      categoria: '',
      vencimento: ''
    };
    
    let isValid = true;
    
    // Validar nome
    if (!formData.nome.trim()) {
      errors.nome = t('campoObrigatorio');
      isValid = false;
    }
    
    // Validar valor
    if (!formData.valor || parseFloat(formData.valor) <= 0) {
      errors.valor = t('valorDeveSerPositivo');
      isValid = false;
    }
    
    // Validar categoria
    if (!formData.categoria) {
      errors.categoria = t('campoObrigatorio');
      isValid = false;
    }
    
    // Validar vencimento
    if (!formData.vencimento) {
      errors.vencimento = t('campoObrigatorio');
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Simulação da chamada à API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (editando && pagamentoEmEdicao) {
        // Atualizar pagamento existente
        const updatedPagamentos = pagamentos.map(p => 
          p.id === pagamentoEmEdicao.id 
            ? {
                ...p,
                nome: formData.nome,
                valor: parseFloat(formData.valor),
                categoria: formData.categoria,
                vencimento: new Date(formData.vencimento).toISOString(),
                notaFiscal: formData.notaFiscal,
                descricao: formData.descricao,
                recorrencia: formData.recorrencia,
                pago: formData.pago
              } 
            : p
        );
        setPagamentos(updatedPagamentos);
        setSnackbar({
          open: true,
          message: t('pagamentoAtualizadoComSucesso'),
          severity: 'success'
        });
      } else {
        // Criar novo pagamento
        const novoPagamento: Pagamento = {
          id: Math.random().toString(36).substr(2, 9),
          nome: formData.nome,
          valor: parseFloat(formData.valor),
          categoria: formData.categoria,
          vencimento: new Date(formData.vencimento).toISOString(),
          notaFiscal: formData.notaFiscal,
          descricao: formData.descricao,
          recorrencia: formData.recorrencia,
          pago: formData.pago,
          createdAt: new Date().toISOString()
        };
        setPagamentos([...pagamentos, novoPagamento]);
        setSnackbar({
          open: true,
          message: t('pagamentoCriadoComSucesso'),
          severity: 'success'
        });
      }
      
      handleCloseDialog();
    } catch (error) {
      console.error('Erro ao salvar pagamento:', error);
      setSnackbar({
        open: true,
        message: t('erroAoSalvarPagamento'),
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  // Marcar pagamento como pago ou não pago
  const togglePagamentoPago = async (pagamento: Pagamento) => {
    try {
      // Simulação da chamada à API
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Atualizar lista local
      setPagamentos(pagamentos.map(p => 
        p.id === pagamento.id ? {...p, pago: !p.pago} : p
      ));
      
      setSnackbar({
        open: true,
        message: pagamento.pago ? t('pagamentoMarcadoComoPendente') : t('pagamentoMarcadoComoPago'),
        severity: 'success'
      });
    } catch (error) {
      console.error('Erro ao atualizar status do pagamento:', error);
      setSnackbar({
        open: true,
        message: t('erroAoAtualizarStatusPagamento'),
        severity: 'error'
      });
    }
  };

  // Excluir pagamento
  const handleDeletePagamento = async (id: string) => {
    try {
      // Simulação da chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPagamentos(pagamentos.filter(p => p.id !== id));
      
      setSnackbar({
        open: true,
        message: t('pagamentoExcluidoComSucesso'),
        severity: 'success'
      });
      
      handleCloseConfirmDelete();
    } catch (error) {
      console.error('Erro ao excluir pagamento:', error);
      setSnackbar({
        open: true,
        message: t('erroAoExcluirPagamento'),
        severity: 'error'
      });
    }
  };

  // Abrir modal de confirmação de exclusão
  const handleOpenConfirmDelete = (id: string) => {
    setConfirmDelete({ open: true, id });
  };

  // Fechar modal de confirmação de exclusão
  const handleCloseConfirmDelete = () => {
    setConfirmDelete({ open: false, id: '' });
  };

  // Formatar valor para moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  // Formatar data completa
  const formatFullDate = (dateString: string) => {
    const date = parseISO(dateString);
    const locale = getDateLocale(i18n.language);
    
    // Formato: "sexta-feira, 25 abril 2025"
    return format(date, 'EEEE, dd MMMM yyyy', { locale });
  };

  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Gerar relatório de pagamentos
  const handleGerarRelatorio = () => {
    setOpenRelatorio(true);
    
    try {
      // Obtém os pagamentos filtrados do mês atual
      const pagamentosFiltrados = Object.values(pagamentosAgrupados())
        .flat()
        .sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime());
      
      // Verificar se há pagamentos para gerar o relatório
      if (pagamentosFiltrados.length === 0) {
        setTimeout(() => {
          setOpenRelatorio(false);
          setSnackbar({
            open: true,
            message: t('nenhumPagamentoRegistrado'),
            severity: 'info'
          });
        }, 1000);
        return;
      }
      
      setTimeout(() => {
        try {
          // Criar novo documento PDF
          const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
          });
          
          // Configurar título
          const mesAtual = getNomesMeses[filtroMes];
          const titulo = `${t('relatorioGastos')} - ${mesAtual} ${filtroAno}`;
          doc.setFontSize(18);
          doc.text(titulo, 105, 15, { align: 'center' });
          
          // Data de geração
          doc.setFontSize(12);
          const dataGerado = new Intl.DateTimeFormat(i18n.language, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
          }).format(new Date());
          doc.text(`${t('data')}: ${dataGerado}`, 105, 25, { align: 'center' });
          
          // Definir cabeçalhos da tabela
          const headers = [[
            t('nomePagamento'),
            t('valor'),
            t('dataVencimento'),
            t('categoria'),
            t('recorrencia'),
            t('pago'),
            t('notaFiscal'),
            t('descricao')
          ]];
          
          // Preparar dados para a tabela
          const data = pagamentosFiltrados.map(pagamento => {
            const categoria = getCategorias(i18n.language).find(c => c.value === pagamento.categoria)?.label || '';
            const recorrenciaLabel = (() => {
              switch(pagamento.recorrencia) {
                case 'nenhuma': return t('recorrencia_nenhuma');
                case 'semanal': return t('recorrencia_semanal');
                case 'quinzenal': return t('recorrencia_quinzenal');
                case 'mensal': return t('recorrencia_mensal');
                case 'trimestral': return t('recorrencia_trimestral');
                default: return '';
              }
            })();
            
            // Formatar valor com símbolo de Euro
            const valorFormatado = new Intl.NumberFormat(i18n.language, {
              style: 'currency',
              currency: 'EUR'
            }).format(pagamento.valor);
            
            // Formatar data
            const dataFormatada = new Date(pagamento.vencimento).toLocaleDateString(i18n.language);
            
            return [
              pagamento.nome || '-',
              valorFormatado || '€0',
              dataFormatada || '-',
              categoria || '-',
              recorrenciaLabel || '-',
              pagamento.pago ? t('pago') : t('pendente'),
              pagamento.notaFiscal || '-',
              pagamento.descricao || '-'
            ];
          });
          
          try {
            // Verificar se o método autoTable está disponível
            // @ts-ignore - Adicionando autoTable (extensão de jsPDF)
            if (typeof doc.autoTable === 'function') {
              // Gerar tabela
              // @ts-ignore - Adicionando autoTable (extensão de jsPDF)
              doc.autoTable({
                head: headers,
                body: data,
                startY: 35,
                margin: { top: 30 },
                styles: { overflow: 'linebreak', fontSize: 8 },
                headStyles: { fillColor: [41, 128, 185], textColor: 255 },
                alternateRowStyles: { fillColor: [240, 240, 240] }
              });
            } else {
              // Método alternativo: desenhar uma tabela simples
              console.warn('autoTable não está disponível, usando método alternativo');
              
              const startY = 35;
              const rowHeight = 8;
              const colWidth = 30;
              
              // Desenhar cabeçalho
              doc.setFillColor(41, 128, 185);
              doc.setTextColor(255, 255, 255);
              doc.rect(10, startY, colWidth * headers[0].length, rowHeight, 'F');
              
              headers[0].forEach((header, index) => {
                doc.text(header, 10 + colWidth * index + 5, startY + 5);
              });
              
              // Desenhar linhas de dados
              doc.setTextColor(0, 0, 0);
              data.forEach((row, rowIndex) => {
                const y = startY + (rowIndex + 1) * rowHeight;
                
                // Alternar cores de fundo
                if (rowIndex % 2 === 0) {
                  doc.setFillColor(240, 240, 240);
                  doc.rect(10, y, colWidth * row.length, rowHeight, 'F');
                }
                
                row.forEach((cell, cellIndex) => {
                  doc.text(cell.toString(), 10 + colWidth * cellIndex + 5, y + 5);
                });
              });
            }
          } catch (tableError) {
            console.error('Erro ao gerar tabela:', tableError);
            // Ainda podemos salvar um PDF básico com apenas o título
            doc.text('Erro ao gerar tabela de dados', 105, 50, { align: 'center' });
          }
          
          // Adicionar resumo no final
          const totalPagamentos = pagamentosFiltrados.length;
          const totalValor = pagamentosFiltrados.reduce((acc, p) => acc + p.valor, 0);
          const totalPagos = pagamentosFiltrados.filter(p => p.pago).length;
          const totalPendentes = totalPagamentos - totalPagos;
          
          // Posição Y após a tabela
          // @ts-ignore - Propriedade adicionada pela extensão autoTable
          const finalY = doc.lastAutoTable?.finalY || 220;
          
          doc.setFontSize(12);
          doc.setTextColor(0, 0, 0);
          
          try {
            doc.text(`${t('total')}: ${totalPagamentos} ${t('pagamentosTexto')}`, 14, finalY + 15);
            doc.text(`${t('pagos')}: ${totalPagos}`, 14, finalY + 25);
            doc.text(`${t('pendentes')}: ${totalPendentes}`, 14, finalY + 35);
            doc.text(`${t('valor_total')}: ${new Intl.NumberFormat(i18n.language, {
              style: 'currency',
              currency: 'EUR'
            }).format(totalValor)}`, 14, finalY + 45);
          } catch (summaryError) {
            console.error('Erro ao adicionar resumo:', summaryError);
          }
          
          // Salvar o PDF
          try {
            const nomeArquivo = `relatorio-pagamentos-${mesAtual.toLowerCase()}-${filtroAno}.pdf`;
            doc.save(nomeArquivo);
            
            // Fechar modal e mostrar mensagem de sucesso
            setOpenRelatorio(false);
            setSnackbar({
              open: true,
              message: t('relatorioGeradoComSucesso'),
              severity: 'success'
            });
          } catch (saveError) {
            console.error('Erro ao salvar PDF:', saveError);
            throw saveError;
          }
        } catch (pdfError) {
          console.error('Erro ao gerar PDF:', pdfError);
          
          // Verificar se é um erro de jsPDF não definido
          if (typeof pdfError === 'object' && pdfError !== null) {
            const errorStr = String(pdfError);
            if (errorStr.includes('undefined') || errorStr.includes('not a function')) {
              console.error('Possível erro de importação ou inicialização do jsPDF');
            }
          }
          
          // FALLBACK: Gerar CSV como alternativa
          try {
            console.log('Tentando gerar CSV como alternativa...');
            const mesAtual = getNomesMeses[filtroMes];
            
            // Preparar dados para CSV
            const headers = [
              t('nomePagamento'),
              t('valor'),
              t('dataVencimento'),
              t('categoria'),
              t('recorrencia'),
              t('pago'),
              t('notaFiscal'),
              t('descricao')
            ].join(',');
            
            const rows = pagamentosFiltrados.map(pagamento => {
              const categoria = getCategorias(i18n.language).find(c => c.value === pagamento.categoria)?.label || '';
              const recorrenciaLabel = (() => {
                switch(pagamento.recorrencia) {
                  case 'nenhuma': return t('recorrencia_nenhuma');
                  case 'semanal': return t('recorrencia_semanal');
                  case 'quinzenal': return t('recorrencia_quinzenal');
                  case 'mensal': return t('recorrencia_mensal');
                  case 'trimestral': return t('recorrencia_trimestral');
                  default: return '';
                }
              })();
              
              // Formatar valor 
              const valor = pagamento.valor.toString().replace('.', ',');
              
              // Formatar data
              const data = new Date(pagamento.vencimento).toLocaleDateString(i18n.language);
              
              // Preparar valores, escapando vírgulas para não quebrar o CSV
              const valores = [
                `"${pagamento.nome || '-'}"`,
                `"€${valor}"`,
                `"${data}"`,
                `"${categoria}"`,
                `"${recorrenciaLabel}"`,
                `"${pagamento.pago ? t('pago') : t('pendente')}"`,
                `"${pagamento.notaFiscal || '-'}"`,
                `"${pagamento.descricao || '-'}"`
              ];
              
              return valores.join(',');
            }).join('\n');
            
            // Montar CSV
            const csv = `${headers}\n${rows}`;
            
            // Gerar um link para download
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `relatorio-pagamentos-${mesAtual.toLowerCase()}-${filtroAno}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setOpenRelatorio(false);
            setSnackbar({
              open: true,
              message: t('relatorioGeradoComSucesso'),
              severity: 'success'
            });
          } catch (csvError) {
            console.error('Erro ao gerar CSV:', csvError);
            setOpenRelatorio(false);
            setSnackbar({
              open: true,
              message: t('erroAoGerarRelatorio'),
              severity: 'error'
            });
          }
        }
      }, 1000); // Delay para mostrar o modal de carregamento
      
    } catch (error) {
      console.error('Erro ao processar dados para relatório:', error);
      setOpenRelatorio(false);
      setSnackbar({
        open: true,
        message: t('erroAoGerarRelatorio'),
        severity: 'error'
      });
    }
  };

  // Função para expandir pagamentos recorrentes
  const expandirPagamentosRecorrentes = useMemo(() => {
    const pagamentosExpandidos: Pagamento[] = [];
    
    pagamentos.forEach(pagamento => {
      // Adiciona o pagamento original
      pagamentosExpandidos.push({...pagamento});
      
      // Se for recorrente, adiciona ocorrências futuras
      if (pagamento.recorrencia !== 'nenhuma') {
        let dataAtual = new Date(pagamento.vencimento);
        const anoLimite = filtroAno + 1; // Expande até 1 ano além do filtro atual
        
        // Loop até atingir limite de repetições ou limite de ano
        let contador = 0;
        const maxRepeticoes = pagamento.recorrencia === 'semanal' ? 52 : 
                             pagamento.recorrencia === 'quinzenal' ? 24 : 
                             pagamento.recorrencia === 'mensal' ? 12 : 4;
        
        while (contador < maxRepeticoes && dataAtual.getFullYear() <= anoLimite) {
          dataAtual = calcularProximaData(dataAtual, pagamento.recorrencia);
          
          // Cria uma nova instância do pagamento recorrente
          const novoPagamento: Pagamento = {
            ...pagamento,
            id: `${pagamento.id}-recorrencia-${contador}`,
            vencimento: dataAtual.toISOString(),
            pago: false // Ocorrências futuras sempre como não pagas
          };
          
          pagamentosExpandidos.push(novoPagamento);
          contador++;
        }
      }
    });
    
    return pagamentosExpandidos;
  }, [pagamentos, filtroAno]);

  // Agrupar pagamentos por data de vencimento
  const pagamentosAgrupados = () => {
    // Filtrar pagamentos por ano e mês selecionados
    const pagamentosFiltrados = expandirPagamentosRecorrentes.filter(pagamento => {
      const data = new Date(pagamento.vencimento);
      return data.getFullYear() === filtroAno && data.getMonth() === filtroMes;
    });
    
    // Filtrar pagamentos anteriores se a opção não estiver ativada
    const pagamentosParaExibir = mostrarAnteriores 
      ? pagamentosFiltrados 
      : pagamentosFiltrados.filter((pagamento: Pagamento) => {
          const dataVencimento = new Date(pagamento.vencimento);
          const hoje = new Date();
          return dataVencimento >= new Date(hoje.setHours(0, 0, 0, 0));
        });
    
    // Ordenar cronologicamente (crescente ou decrescente conforme configuração)
    const pagamentosOrdenados = [...pagamentosParaExibir].sort(
      (a, b) => {
        const timeA = new Date(a.vencimento).getTime();
        const timeB = new Date(b.vencimento).getTime();
        return ordenacaoCrescente ? timeA - timeB : timeB - timeA;
      }
    );
    
    // Agrupar por data
    const grupos: Record<string, Pagamento[]> = {};
    
    pagamentosOrdenados.forEach(pagamento => {
      const data = pagamento.vencimento.split('T')[0];
      if (!grupos[data]) {
        grupos[data] = [];
      }
      grupos[data].push(pagamento);
    });
    
    return grupos;
  };

  // Componente que exibe um item de pagamento agrupado por data
  const PagamentoCard = ({ pagamento, onToggle, onEdit, onDelete, language }: {
    pagamento: Pagamento,
    onToggle: (p: Pagamento) => void,
    onEdit: (p: Pagamento) => void,
    onDelete: (id: string) => void,
    language: string
  }) => {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat(language, {
        style: 'currency',
        currency: 'EUR'
      }).format(value);
    };
    
    const getRecorrenciaLabel = (recorrencia: string) => {
      switch(recorrencia) {
        case 'nenhuma': return t('recorrencia_nenhuma');
        case 'semanal': return t('recorrencia_semanal');
        case 'quinzenal': return t('recorrencia_quinzenal');
        case 'mensal': return t('recorrencia_mensal');
        case 'trimestral': return t('recorrencia_trimestral');
        default: return t('recorrencia_nenhuma');
      }
    };
    
    const recorrenciaLabel = getRecorrenciaLabel(pagamento.recorrencia);

    return (
      <Card 
        sx={{ 
          backgroundColor: pagamento.pago ? 'rgba(76, 175, 80, 0.08)' : 'background.paper',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 3
          }
        }}
      >
        <CardContent>
          <Grid container alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1" fontWeight="bold">
                {pagamento.nome}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {getCategorias(language).find((c) => c.value === pagamento.categoria)?.label}
                </Typography>
                {recorrenciaLabel && (
                  <Chip 
                    label={recorrenciaLabel}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3} md={2}>
              <Typography 
                variant="subtitle1" 
                fontWeight="medium"
                color={pagamento.pago ? 'success.main' : 'error.main'}
              >
                {formatCurrency(pagamento.valor)}
              </Typography>
            </Grid>
            
            <Grid item xs={6} sm={3} md={3}>
              {pagamento.notaFiscal && (
                <Tooltip title="Número da Nota Fiscal">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon fontSize="small" color="action" />
                    <Typography variant="body2">
                      {pagamento.notaFiscal}
                    </Typography>
                  </Box>
                </Tooltip>
              )}
              {pagamento.descricao && (
                <Typography variant="body2" color="text.secondary" noWrap>
                  {pagamento.descricao}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12} sm={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
              <Chip 
                label={pagamento.pago ? t('pago') : t('pendente')}
                color={pagamento.pago ? 'success' : 'error'}
                size="small"
                onClick={() => onToggle(pagamento)}
                sx={{ cursor: 'pointer' }}
              />
              
              <IconButton 
                size="small" 
                onClick={() => onEdit(pagamento)}
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              
              <IconButton 
                size="small" 
                onClick={() => onDelete(pagamento.id)}
                color="error"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  // Componente de UI
  return (
    <Box sx={{ p: 3 }}>
      {/* Cabeçalho com botões */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          alignItems: 'center',
          mb: 4 
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            bgcolor: theme.palette.success.dark,
            '&:hover': {
              bgcolor: theme.palette.success.main,
            },
            mr: 2
          }}
        >
          + {t('novoPagamento')}
        </Button>
        
        <Button
          variant="contained"
          startIcon={<PdfIcon />}
          onClick={handleGerarRelatorio}
          sx={{
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            }
          }}
        >
          {t('relatorioGastos')}
        </Button>
      </Box>

      {/* Título da seção */}
      <Typography variant="h6" gutterBottom>
        {t('pagamentosCadastrados')}
      </Typography>

      {/* Seletor de Ano */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2, 
        overflow: 'auto',
        p: 1,
        mb: 1,
        borderRadius: 1,
        bgcolor: 'background.paper',
        boxShadow: 1
      }}>
        {anosDisponiveis.map(ano => (
          <Button
            key={ano}
            variant={filtroAno === ano ? "contained" : "outlined"}
            onClick={() => setFiltroAno(ano)}
            sx={{ 
              minWidth: '80px',
              px: 2
            }}
          >
            {ano}
          </Button>
        ))}
      </Box>
      
      {/* Seletor de Mês */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 1,
        p: 1,
        mb: 2,
        borderRadius: 1,
        bgcolor: 'background.paper',
        boxShadow: 1
      }}>
        {getNomesMeses.map((mes, index) => (
          <Button
            key={index}
            variant={filtroMes === index ? "contained" : "text"}
            onClick={() => setFiltroMes(index)}
            sx={{ 
              flex: { xs: '1 0 30%', sm: '1 0 15%', md: '1 0 8%' },
              textTransform: 'capitalize',
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' }
            }}
          >
            {mes}
          </Button>
        ))}
      </Box>

      {/* Controles de visualização e ordenação */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        gap: 2
      }}>
        <FormControlLabel
          control={
            <Switch
              checked={mostrarAnteriores}
              onChange={(e) => setMostrarAnteriores(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {mostrarAnteriores ? '🔼' : '🔽'} {t('mostrarPagamentosAnteriores')}
              </Typography>
            </Box>
          }
        />
        <FormControlLabel
          control={
            <Switch
              checked={ordenacaoCrescente}
              onChange={(e) => setOrdenacaoCrescente(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {ordenacaoCrescente ? '↑' : '↓'} {ordenacaoCrescente ? t('maisAntigosPrimeiro') : t('maisRecentesPrimeiro')}
              </Typography>
            </Box>
          }
        />
      </Box>

      {/* Listagem de pagamentos agrupados por data */}
      <Box sx={{ mt: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : Object.keys(pagamentosAgrupados()).length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              {t('nenhumPagamento')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {getNomesMeses[filtroMes]} {filtroAno}
            </Typography>
          </Paper>
        ) : (
          Object.entries(pagamentosAgrupados()).map(([data, items]) => {
            const dataParsed = parseISO(data);
            const isHoje = isToday(dataParsed);
            
            return (
              <Box key={data} sx={{ mb: 4 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    textAlign: 'center', 
                    mb: 2,
                    color: isHoje ? 'primary.main' : 'text.primary',
                    fontWeight: isHoje ? 'bold' : 'medium',
                    padding: '8px',
                    borderRadius: '4px',
                    bgcolor: isHoje ? 'rgba(25, 118, 210, 0.08)' : 'rgba(0, 0, 0, 0.03)',
                    textTransform: 'capitalize'
                  }}
                >
                  {formatFullDate(data)}
                  {isHoje && (
                    <Chip 
                      label={t('hoje')} 
                      color="primary" 
                      size="small" 
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
                
                <Grid container spacing={2}>
                  {items.map(pagamento => (
                    <Grid item xs={12} key={pagamento.id}>
                      <PagamentoCard 
                        pagamento={pagamento}
                        onToggle={togglePagamentoPago}
                        onEdit={handleOpenDialog}
                        onDelete={handleOpenConfirmDelete}
                        language={i18n.language}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })
        )}
      </Box>

      {/* Modal de Novo Pagamento/Editar Pagamento */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editando ? t('editarPagamento') : t('novoPagamento')}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label={t('nomePagamento')}
              fullWidth
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              error={!!formErrors.nome}
              helperText={formErrors.nome}
              required
            />
            
            <TextField
              label={t('valor')}
              type="number"
              fullWidth
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              error={!!formErrors.valor}
              helperText={formErrors.valor}
              InputProps={{
                startAdornment: <Typography variant="body1" sx={{ mr: 1 }}>€</Typography>,
              }}
              required
            />
            
            <TextField
              label={t('dataVencimento')}
              type="date"
              fullWidth
              value={formData.vencimento}
              onChange={(e) => setFormData({ ...formData, vencimento: e.target.value })}
              error={!!formErrors.vencimento}
              helperText={formErrors.vencimento}
              required
              InputLabelProps={{ shrink: true }}
            />
            
            <FormControl fullWidth>
              <InputLabel id="categoria-label">{t('categoria')}</InputLabel>
              <Select
                labelId="categoria-label"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                label={t('categoria')}
                required
              >
                {getCategorias(i18n.language).map((categoria) => (
                  <MenuItem key={categoria.value} value={categoria.value}>
                    {categoria.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel id="recorrencia-label">{t('recorrencia')}</InputLabel>
              <Select
                labelId="recorrencia-label"
                value={formData.recorrencia}
                onChange={(e) => setFormData({ ...formData, recorrencia: e.target.value as any })}
                label={t('recorrencia')}
              >
                <MenuItem value="nenhuma">{t('recorrencia_nenhuma')}</MenuItem>
                <MenuItem value="semanal">{t('recorrencia_semanal')}</MenuItem>
                <MenuItem value="quinzenal">{t('recorrencia_quinzenal')}</MenuItem>
                <MenuItem value="mensal">{t('recorrencia_mensal')}</MenuItem>
                <MenuItem value="trimestral">{t('recorrencia_trimestral')}</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label={t('notaFiscal')}
              fullWidth
              value={formData.notaFiscal}
              onChange={(e) => setFormData({ ...formData, notaFiscal: e.target.value })}
              helperText={t('campoOpcional')}
            />
            
            <TextField
              label={t('descricao')}
              fullWidth
              multiline
              rows={2}
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              helperText={t('campoOpcional')}
            />
            
            <FormControlLabel
              control={
                <Checkbox 
                  checked={formData.pago} 
                  onChange={(e) => setFormData({ ...formData, pago: e.target.checked })}
                />
              }
              label={t('pago')}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>
            {t('cancelar')}
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : editando ? (
              t('atualizar')
            ) : (
              t('adicionar')
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog
        open={confirmDelete.open}
        onClose={handleCloseConfirmDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>{t('confirmarExclusao')}</DialogTitle>
        <DialogContent>
          <Typography>
            {t('confirmarExclusaoPagamento')}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDelete}>
            {t('cancelar')}
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => handleDeletePagamento(confirmDelete.id)}
          >
            {t('excluir')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal do Relatório */}
      <Dialog
        open={openRelatorio}
        maxWidth="xs"
        fullWidth
      >
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, py: 2 }}>
            <CircularProgress />
            <Typography>{t('gerandoRelatorio')}</Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbar para notificações */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Pagamentos; 