import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Autocomplete,
  Grid,
  Paper,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  IconButton,
  Snackbar,
  Alert,
  Chip,
  Menu,
  ListItemIcon,
  ListItemText,
  Tabs,
  Tab,
  useMediaQuery,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  Divider,
  Stack,
  Avatar,
  SelectChangeEvent,
  OutlinedInput,
  InputAdornment,
  FormHelperText,
  TextField,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  Add as AddIcon,
  Remove as RemoveIcon,
  PictureAsPdf as PdfIcon,
  InfoOutlined as InfoIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Inventory,
  ShoppingCartCheckout as ShoppingCartCheckoutIcon,
} from '@mui/icons-material';
// Importação dos ícones do Lucide React
import { 
  Plus, 
  FileDown, 
  Download, 
  Search, 
  Trash2, 
  Copy, 
  AlertCircle,
  AlertTriangle,
  Filter
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { debounce } from 'lodash';
import { useInventario } from '../contexts/InventarioContext';
import MotionButton from '../components/ui/MotionButton';
import MetricCard from '../components/ui/MetricCard';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import FormularioProduto from '../components/inventario/FormularioProduto';
import RelatorioSugestaoCompra from '../components/inventario/RelatorioSugestaoCompra';
import SugestaoDeCompra from '../components/inventario/SugestaoDeCompra';
import { convertToItemInventario } from '../utils/inventarioAdapters';

// Função para formatar valor monetário
const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', { 
    style: 'currency', 
    currency: 'EUR' 
  });
};

// Interface para os itens do inventário
interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
  category?: string;
  minQuantity?: number;
  expirationDate?: string;
  unitCost?: number;
}

// Interface para os itens do relatório de compras
interface PurchaseItem {
  name: string;
  currentStock: number;
  weeklyNeed: number;
  toBuy: number;
  unit: string;
}

// Unidades disponíveis conforme a interface ItemInventario
const unitOptions = [
  { value: 'kg', label: 'quilograma' },
  { value: 'g', label: 'gramas' },
  { value: 'caixa', label: 'caixa' },
  { value: 'unidade', label: 'unidade' },
  { value: 'ml', label: 'mililitro' },
  { value: 'litro', label: 'litro' },
];

// Chip de Status para quantidades
const StatusChip = styled(Chip)<{ status: 'success' | 'warning' | 'error' }>(({ theme, status }) => {
  const colors = {
    success: {
      color: '#00B37E',
      backgroundColor: 'rgba(0, 179, 126, 0.1)',
    },
    warning: {
      color: '#FDD835',
      backgroundColor: 'rgba(253, 216, 53, 0.1)',
    },
    error: {
      color: '#F75A68',
      backgroundColor: 'rgba(247, 90, 104, 0.1)',
    },
  };
  
  return {
    color: colors[status].color,
    backgroundColor: colors[status].backgroundColor,
    borderRadius: '16px',
    fontWeight: 600,
    '& .MuiChip-label': {
      padding: '0 12px',
    },
  };
});

// Toggle para mostrar itens críticos
const ChipToggle = styled(Chip)<{ isActive: boolean }>(({ theme, isActive }) => ({
  borderRadius: '16px',
  fontWeight: 600,
  cursor: 'pointer',
  backgroundColor: isActive ? theme.palette.primary.main : theme.palette.grey[100],
  color: isActive ? theme.palette.common.white : theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: isActive ? theme.palette.primary.dark : theme.palette.grey[200],
  },
}));

// Interface para registro de estoque atual com cálculo automático
interface EstoqueAtualData {
  produtoId: string;
  nome: string;
  quantidadeAtual: number;
  unidadeMedida: string;
  necessidadeSemanal?: number;
  quantidadeComprar?: number; // Calculada automaticamente
}

const Inventario = () => {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  // Context do inventário
  const { 
    itens, 
    resumo, 
    adicionarItem, 
    atualizarItem, 
    removerItem,
    carregarDados
  } = useInventario();
  
  // Estado para os itens do inventário
  const [currentStockItems, setCurrentStockItems] = useState<InventoryItem[]>([]);
  const [weeklyNeedItems, setWeeklyNeedItems] = useState<InventoryItem[]>([]);
  
  // Estados de filtro
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  
  // Estado para abas mobile
  const [tabValue, setTabValue] = useState(0);
  
  // Estados para menu de contexto
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    item: InventoryItem | null;
    type: 'stock' | 'need' | null;
  } | null>(null);
  
  // Estado de loading
  const [loading, setLoading] = useState(false);
  
  // Estados para controlar os modais
  const [openCurrentStockModal, setOpenCurrentStockModal] = useState(false);
  const [openWeeklyNeedModal, setOpenWeeklyNeedModal] = useState(false);
  
  // Estados do formulário com tipagem correta
  const [currentStockForm, setCurrentStockForm] = useState({
    nome: '',
    quantidade: 1,
    unidade: 'unidade' as 'kg' | 'unidade' | 'caixa' | 'g' | 'ml' | 'litro',
    categoria: '',
    quantidadeMinima: 0,
    precoUnitario: 0,
    dataValidade: '',
    localizacao: '',
  });
  
  const [weeklyNeedForm, setWeeklyNeedForm] = useState({
    nome: '',
    quantidade: 1,
    unidade: 'unidade' as 'kg' | 'unidade' | 'caixa' | 'g' | 'ml' | 'litro',
    precoUnitario: 0,
    observacao: '',
  });
  
  // Estados de validação e submissão
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para o Snackbar de exportação
  const [exportSnackbar, setExportSnackbar] = useState(false);
  
  // Novo estado para o Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Novo estado para verificar se é um dispositivo XSmall
  const isXSmall = useMediaQuery(theme.breakpoints.down(480));
  
  // Estado para o modal do FormularioProduto
  const [openFormularioProduto, setOpenFormularioProduto] = useState(false);
  const [produtoIdParaEditar, setProdutoIdParaEditar] = useState<string | undefined>(undefined);
  
  // Estado para o modal de Estoque Atual
  const [openEstoqueAtualModal, setOpenEstoqueAtualModal] = useState(false);
  const [estoqueAtualData, setEstoqueAtualData] = useState<EstoqueAtualData>({
    produtoId: '',
    nome: '',
    quantidadeAtual: 0,
    unidadeMedida: 'unidade',
    necessidadeSemanal: 0,
    quantidadeComprar: 0
  });
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<{id: string, nome: string}[]>([]);
  
  // Novo estado para mostrar o relatório de sugestão de compra
  const [showSugestaoCompra, setShowSugestaoCompra] = useState(false);
  
  // Novo estado para o modal de sugestão de compra
  const [openSugestaoCompra, setOpenSugestaoCompra] = useState(false);
  
  // Calcular o valor total do estoque
  const calculateTotalStockValue = () => {
    if (currentStockItems.length === 0) return formatCurrency(0);
    
    const total = currentStockItems.reduce((sum, item) => {
      const unitCost = item.unitCost || 0;
      return sum + (unitCost * item.quantity);
    }, 0);
    
    return formatCurrency(total);
  };
  
  // Efeito para carregar dados e popular as listas
  useEffect(() => {
    setLoading(true);
    carregarDados();
    
    // Mapear itens do contexto para o formato da interface
    const stockItems = itens
      .filter(item => !item.categoria?.includes('necessidade_semanal'))
      .map(item => ({
        id: item.id,
        name: item.nome,
        quantity: item.quantidade,
        unit: item.unidadeMedida,
        notes: item.localizacaoArmazem,
        category: item.categoria,
        minQuantity: item.nivelMinimoEstoque,
        expirationDate: item.dataValidade ? 
          (item.dataValidade instanceof Date ? 
            item.dataValidade.toISOString().split('T')[0] : 
            String(item.dataValidade)) : 
          undefined,
        unitCost: item.precoCompra || 0
      }));
    
    const needItems = itens
      .filter(item => item.categoria?.includes('necessidade_semanal'))
      .map(item => ({
        id: item.id,
        name: item.nome,
        quantity: item.quantidade,
        unit: item.unidadeMedida,
        notes: item.localizacaoArmazem,
        category: item.categoria,
        minQuantity: item.nivelMinimoEstoque,
        expirationDate: item.dataValidade ? 
          (item.dataValidade instanceof Date ? 
            item.dataValidade.toISOString().split('T')[0] : 
            String(item.dataValidade)) : 
          undefined
      }));
    
    setCurrentStockItems(stockItems);
    setWeeklyNeedItems(needItems);
    setLoading(false);
  }, [itens, carregarDados]);
  
  // Handler para debounce da busca
  const handleSearchChange = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
    }, 300), 
    []
  );
  
  // Filtrar os itens com base nos filtros
  const filteredCurrentStock = currentStockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesCritical = !showCriticalOnly || 
      (item.minQuantity !== undefined && item.quantity < item.minQuantity);
    
    return matchesSearch && matchesCategory && matchesCritical;
  });
  
  const filteredWeeklyNeed = weeklyNeedItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesCritical = !showCriticalOnly || 
      (item.minQuantity !== undefined && item.quantity < item.minQuantity);
    
    return matchesSearch && matchesCategory && matchesCritical;
  });
  
  // Toggle para mostrar apenas itens críticos
  const toggleCritical = () => {
    setShowCriticalOnly(!showCriticalOnly);
  };
  
  // Alternar visibilidade do relatório de sugestão de compra
  const toggleSugestaoCompra = () => {
    setShowSugestaoCompra(prev => !prev);
  };
  
  // Definições das colunas da tabela de estoque atual
  const currentStockColumns: GridColDef[] = [
    { field: 'name', headerName: "Nome", flex: 2, minWidth: 150 },
    { field: 'category', headerName: "Categoria", flex: 1, minWidth: 120 },
    { 
      field: 'quantity', 
      headerName: "Quantidade", 
      flex: 1, 
      minWidth: 120,
      renderCell: (params: any) => {
        const item = params.row as InventoryItem;
        let status: 'success' | 'warning' | 'error' = 'success';
        
        if (item.minQuantity !== undefined) {
          if (item.quantity < item.minQuantity) {
            status = 'error';
          } else if (item.quantity === item.minQuantity) {
            status = 'warning';
          }
        }
        
        return (
          <StatusChip 
            label={`${item.quantity} ${item.unit}`} 
            status={status} 
          />
        );
      }
    },
    { field: 'unit', headerName: "Unidade", flex: 1, minWidth: 100 },
    { 
      field: 'actions', 
      headerName: "Ações", 
      flex: 1, 
      minWidth: 120,
      sortable: false,
      renderCell: (params: any) => {
        const item = params.row as InventoryItem;
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Editar">
              <IconButton 
                onClick={() => handleEditCurrentStock(item)}
                size="small"
                aria-label={`Editar ${item.name}`}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Excluir">
              <IconButton 
                onClick={() => handleOpenDeleteModal(item, 'stock')}
                size="small"
                color="error"
                aria-label={`Excluir ${item.name}`}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      }
    }
  ];
  
  // Definições das colunas da tabela de necessidade semanal
  const weeklyNeedColumns: GridColDef[] = [
    { field: 'name', headerName: "Nome", flex: 2, minWidth: 150 },
    { field: 'category', headerName: "Categoria", flex: 1, minWidth: 120 },
    { 
      field: 'quantity', 
      headerName: "Quantidade", 
      flex: 1, 
      minWidth: 120,
      renderCell: (params: any) => {
        const item = params.row as InventoryItem;
        let status: 'success' | 'warning' | 'error' = 'success';
        
        if (item.minQuantity !== undefined) {
          if (item.quantity < item.minQuantity) {
            status = 'error';
          } else if (item.quantity === item.minQuantity) {
            status = 'warning';
          }
        }
        
        return (
          <StatusChip 
            label={`${item.quantity} ${item.unit}`} 
            status={status} 
          />
        );
      }
    },
    { field: 'unit', headerName: "Unidade", flex: 1, minWidth: 100 },
    { 
      field: 'actions', 
      headerName: "Ações", 
      flex: 1, 
      minWidth: 120,
      sortable: false,
      renderCell: (params: any) => {
        const item = params.row as InventoryItem;
        return (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Editar">
              <IconButton 
                onClick={() => handleEditWeeklyNeed(item)}
                size="small"
                aria-label={`Editar ${item.name}`}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Excluir">
              <IconButton 
                onClick={() => handleOpenDeleteModal(item, 'need')}
                size="small"
                color="error"
                aria-label={`Excluir ${item.name}`}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      }
    }
  ];
  
  // Menu de contexto
  const handleContextMenu = (item: InventoryItem, type: 'stock' | 'need') => {
    // Posicionar o menu no centro da tela
    setContextMenu({
      mouseX: window.innerWidth / 2,
      mouseY: window.innerHeight / 2,
      item,
      type
    });
  };
  
  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };
  
  // Funções de abertura de modais
  const handleOpenCurrentStockModal = () => {
    setCurrentStockForm({
      nome: '',
      quantidade: 1,
      unidade: 'unidade' as 'kg' | 'unidade' | 'caixa' | 'g' | 'ml' | 'litro',
      categoria: '',
      quantidadeMinima: 0,
      precoUnitario: 0,
      dataValidade: '',
      localizacao: '',
    });
    setFormErrors({});
    setOpenCurrentStockModal(true);
  };
  
  const handleOpenWeeklyNeedModal = () => {
    setWeeklyNeedForm({
      nome: '',
      quantidade: 1,
      unidade: 'unidade' as 'kg' | 'unidade' | 'caixa' | 'g' | 'ml' | 'litro',
      precoUnitario: 0,
      observacao: '',
    });
    setFormErrors({});
    setOpenWeeklyNeedModal(true);
  };
  
  // Função para abrir o modal de Estoque Atual
  const handleOpenEstoqueAtualModal = () => {
    // Carregar lista de produtos disponíveis
    const produtos = itens.map(item => ({
      id: item.id,
      nome: item.nome
    }));
    setProdutosDisponiveis(produtos);
    
    // Resetar o formulário
    setEstoqueAtualData({
      produtoId: '',
      nome: '',
      quantidadeAtual: 0,
      unidadeMedida: 'unidade',
      necessidadeSemanal: 0,
      quantidadeComprar: 0
    });
    
    setOpenEstoqueAtualModal(true);
  };
  
  // Handler para alterações no formulário de Estoque Atual
  const handleEstoqueAtualChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    
    if (name) {
      setEstoqueAtualData(prev => {
        const newData = {
          ...prev,
          [name]: value
        };
        
        // Calcular automaticamente a quantidade a comprar
        if (name === 'quantidadeAtual' || name === 'necessidadeSemanal') {
          const atual = name === 'quantidadeAtual' ? Number(value) : prev.quantidadeAtual;
          const necessidade = name === 'necessidadeSemanal' ? Number(value) : prev.necessidadeSemanal || 0;
          
          // Se a quantidade atual for menor que a necessidade semanal, calcular diferença
          const quantComprar = atual < necessidade ? necessidade - atual : 0;
          newData.quantidadeComprar = quantComprar;
        }
        
        return newData;
      });
    }
  };

  // Quando um produto é selecionado, preencher dados automaticamente
  const handleProdutoSelection = (produtoId: string) => {
    const produto = itens.find(item => item.id === produtoId);
    
    if (produto) {
      setEstoqueAtualData({
        produtoId: produto.id,
        nome: produto.nome,
        quantidadeAtual: 0, // Inicial zero para ser preenchido pelo usuário
        unidadeMedida: produto.unidadeMedida,
        // Buscar necessidade semanal se já existir
        necessidadeSemanal: produto.categoria === 'necessidade_semanal' ? produto.quantidade : 0,
        quantidadeComprar: 0
      });
    }
  };

  // Salvar o registro de estoque atual
  const handleSalvarEstoqueAtual = async () => {
    setIsSubmitting(true);
    
    try {
      // Atualizar o item selecionado com a quantidade atual
      if (estoqueAtualData.produtoId) {
        await atualizarItem(estoqueAtualData.produtoId, {
          quantidade: Number(estoqueAtualData.quantidadeAtual)
        });
        
        // Se tiver necessidade semanal, criar ou atualizar um item para isso
        if (estoqueAtualData.necessidadeSemanal && estoqueAtualData.necessidadeSemanal > 0) {
          // Verificar se já existe item de necessidade
          const necessidadeExistente = itens.find(
            item => item.nome === `Necessidade: ${estoqueAtualData.nome}` && 
                  item.categoria === 'necessidade_semanal'
          );
          
          if (necessidadeExistente) {
            await atualizarItem(necessidadeExistente.id, {
              quantidade: Number(estoqueAtualData.necessidadeSemanal)
            });
          } else {
            // Criar novo item de necessidade
            await adicionarItem({
              nome: `Necessidade: ${estoqueAtualData.nome}`,
              quantidade: Number(estoqueAtualData.necessidadeSemanal),
              unidadeMedida: estoqueAtualData.unidadeMedida,
              categoria: 'necessidade_semanal',
              preco: 0
            });
          }
        }
        
        // Fechar modal e atualizar dados
        setOpenEstoqueAtualModal(false);
        await carregarDados();
        
        // Mostrar mensagem de sucesso
        setSnackbarMessage("Estoque atual registrado com sucesso!");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Erro ao registrar estoque atual:", error);
      setSnackbarMessage("Erro ao registrar estoque atual");
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handlers para o formulário
  const handleCurrentStockChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setCurrentStockForm((prev) => ({
      ...prev,
      [name as string]: value
    }));
    
    // Limpar erro quando campo é preenchido
    if (formErrors[name as string]) {
      setFormErrors((prev) => ({
        ...prev,
        [name as string]: ''
      }));
    }
  };
  
  const handleWeeklyNeedChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setWeeklyNeedForm((prev) => ({
      ...prev,
      [name as string]: value
    }));
    
    // Limpar erro quando campo é preenchido
    if (formErrors[name as string]) {
      setFormErrors((prev) => ({
        ...prev,
        [name as string]: ''
      }));
    }
  };
  
  // Validação de formulários
  const validateCurrentStockForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!currentStockForm.nome.trim()) {
      errors.nome = "Nome é obrigatório";
    }
    
    if (currentStockForm.quantidade <= 0) {
      errors.quantidade = "Quantidade deve ser maior que zero";
    }
    
    if (currentStockForm.precoUnitario < 0) {
      errors.precoUnitario = "Preço unitário não pode ser negativo";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validateWeeklyNeedForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!weeklyNeedForm.nome.trim()) {
      errors.nome = "Nome é obrigatório";
    }
    
    if (weeklyNeedForm.quantidade <= 0) {
      errors.quantidade = "Quantidade deve ser maior que zero";
    }
    
    if (weeklyNeedForm.precoUnitario < 0) {
      errors.precoUnitario = "Preço unitário não pode ser negativo";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Submissão de formulários
  const handleSubmitCurrentStock = async () => {
    if (!validateCurrentStockForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Criar objeto para adicionar ao context
      const newItem = {
        nome: currentStockForm.nome,
        quantidade: Number(currentStockForm.quantidade),
        unidadeMedida: currentStockForm.unidade,
        categoria: currentStockForm.categoria || "outros",
        nivelMinimoEstoque: Number(currentStockForm.quantidadeMinima),
        preco: Number(currentStockForm.precoUnitario),
        dataValidade: currentStockForm.dataValidade,
        localizacaoArmazem: currentStockForm.localizacao,
      };
      
      // Adicionar ao contexto
      await adicionarItem(newItem);
      
      // Fechar modal e mostrar feedback
      setOpenCurrentStockModal(false);
      setSnackbarMessage(t('inventory.addSuccess', "Item adicionado com sucesso!") as string);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      setSnackbarMessage(t('inventory.error', "Ocorreu um erro. Tente novamente.") as string);
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSubmitWeeklyNeed = async () => {
    if (!validateWeeklyNeedForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Criar objeto para adicionar ao context
      const newItem = {
        nome: weeklyNeedForm.nome,
        quantidade: Number(weeklyNeedForm.quantidade),
        unidadeMedida: weeklyNeedForm.unidade,
        categoria: "necessidade_semanal",
        preco: Number(weeklyNeedForm.precoUnitario),
        descricao: weeklyNeedForm.observacao,
      };
      
      // Adicionar ao contexto
      await adicionarItem(newItem);
      
      // Fechar modal e mostrar feedback
      setOpenWeeklyNeedModal(false);
      setSnackbarMessage(t('inventory.addWeeklySuccess', "Necessidade semanal registrada com sucesso!") as string);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Erro ao adicionar necessidade semanal:", error);
      setSnackbarMessage(t('inventory.error', "Erro ao registrar necessidade semanal. Tente novamente.") as string);
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Função que substitui handleEditCurrentStock para abrir o FormularioProduto
  const handleEditCurrentStock = (item: InventoryItem) => {
    setProdutoIdParaEditar(item.id);
    setOpenFormularioProduto(true);
  };
  
  // Função para abrir o formulário para adicionar um novo produto
  const handleAddNewProduct = () => {
    setProdutoIdParaEditar(undefined); // Nenhum ID significa novo produto
    setOpenFormularioProduto(true);
  };
  
  // Função chamada quando o formulário é salvo com sucesso
  const handleFormularioSalvo = () => {
    setOpenFormularioProduto(false);
    carregarDados(); // Recarregar dados do inventário
    setSnackbarMessage(produtoIdParaEditar ? 
      "Produto atualizado com sucesso" : 
      "Produto adicionado com sucesso");
    setSnackbarOpen(true);
  };
  
  const handleEditWeeklyNeed = (item: InventoryItem) => {
    // Implementar lógica de edição (manter compatibilidade)
    console.log('Editar item necessidade:', item);
  };
  
  const handleOpenDeleteModal = (item: InventoryItem, type: 'stock' | 'need') => {
    // Implementar lógica de deleção (manter compatibilidade)
    console.log('Excluir item:', item, type);
  };
  
  // Função para exportar dados
  const handleExport = (type: 'stock' | 'need') => {
    const data = type === 'stock' ? filteredCurrentStock : filteredWeeklyNeed;
    const filename = type === 'stock' ? 'estoque_atual.csv' : 'necessidade_semanal.csv';
    
    // Criar CSV
    const headers = ['Nome', 'Categoria', 'Quantidade', 'Unidade'];
    const csvContent = [
      headers.join(','),
      ...data.map(item => [
        item.name,
        item.category || '',
        item.quantity,
        item.unit
      ].join(','))
    ].join('\n');
    
    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Após exportar, mostrar snackbar
    setSnackbarMessage("Arquivo CSV exportado com sucesso");
    setSnackbarOpen(true);
  };
  
  // Renderizar métricas rápidas
  const renderMetrics = () => (
    <Grid container spacing={4} sx={{ mb: 4 }}>
      <Grid item xs={12} md={4}>
        <MetricCard
          title="Valor em Estoque"
          value={calculateTotalStockValue()}
          icon={<FileDown size={22} />}
          color="primary.main"
          iconBg="rgba(0, 0, 0, 0.04)"
          minHeight={140}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <MetricCard
          title="Itens Críticos"
          value={resumo.itensCriticos?.toString() || "0"}
          icon={<AlertCircle size={22} />}
          color="error.main"
          iconBg="rgba(0, 0, 0, 0.04)"
          minHeight={140}
        />
      </Grid>
      
      <Grid item xs={12} md={4}>
        <MetricCard
          title="Próximos do Vencimento"
          value={resumo.itensValidadeProxima?.toString() || "0"}
          icon={<AlertCircle size={22} />}
          color="warning.dark"
          iconBg="warning.light"
          minHeight={140}
        />
      </Grid>
    </Grid>
  );
  
  // Renderizar filtros rápidos
  const renderFilters = () => (
    <Stack 
      direction={{ xs: 'column', md: 'row' }}
      spacing={2}
      alignItems="center"
      sx={{ mb: 2 }}
    >
      <FormControl sx={{ flexGrow: 1 }}>
        <OutlinedInput
          placeholder="Buscar item..."
          size="small"
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
          startAdornment={
            <InputAdornment position="start">
              <Search size={20} />
            </InputAdornment>
          }
        />
      </FormControl>
      
      <FormControl sx={{ minWidth: 160 }}>
        <Select
          size="small"
          value={categoryFilter}
          onChange={(e: SelectChangeEvent) => setCategoryFilter(e.target.value)}
          displayEmpty
          aria-label="Filtrar categoria"
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Filter size={16} />
              <span>
                {selected === 'all' 
                  ? "Todas Categorias" 
                  : selected}
              </span>
            </Box>
          )}
        >
          <MenuItem value="all">Todas Categorias</MenuItem>
          <MenuItem value="beverages">Bebidas</MenuItem>
          <MenuItem value="legumes">Legumes</MenuItem>
          <MenuItem value="carnes">Carnes</MenuItem>
          <MenuItem value="massas">Massas</MenuItem>
          <MenuItem value="outros">Outros</MenuItem>
        </Select>
      </FormControl>
      
      <Box flexGrow={1} />
      
      <Chip
        label={showCriticalOnly ? t('inventario.statusCritico') : t('common.showCritical')}
        icon={<AlertTriangle size={16} color={showCriticalOnly ? "white" : undefined} />}
        variant={showCriticalOnly ? "filled" : "outlined"}
        color="error"
        onClick={toggleCritical}
        aria-pressed={showCriticalOnly}
        sx={{ 
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px'
          }
        }}
      />
    </Stack>
  );
  
  // Estilo comum para cards com scroll
  const cardScrollStyle = {
    maxHeight: 380,
    overflow: 'auto',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': { width: '4px' },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'grey.300',
      borderRadius: 3
    }
  };
  
  // Renderizar tabela de estoque atual
  const renderCurrentStockTable = () => (
    <Box
      sx={{ 
        height: 400,
        width: '100%',
        '& .MuiDataGrid-columnHeaders': {
          bgcolor: 'grey.50',
          fontWeight: 600,
          color: 'text.secondary',
        },
        '& .MuiDataGrid-row:nth-of-type(odd)': {
          backgroundColor: theme.palette.grey[50],
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: theme.palette.grey[100],
        },
      }}
    >
      <DataGrid
        rows={filteredCurrentStock}
        columns={currentStockColumns}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        disableRowSelectionOnClick
        onRowClick={(params) => handleContextMenu(params.row as InventoryItem, 'stock')}
        localeText={{
          noRowsLabel: "Nenhum item encontrado",
        }}
      />
    </Box>
  );
  
  // Renderizar tabela de necessidade semanal
  const renderWeeklyNeedTable = () => (
    <Box
      sx={{ 
        height: 400,
        width: '100%',
        '& .MuiDataGrid-columnHeaders': {
          bgcolor: 'grey.50',
          fontWeight: 600,
          color: 'text.secondary',
        },
        '& .MuiDataGrid-row:nth-of-type(odd)': {
          backgroundColor: theme.palette.grey[50],
        },
        '& .MuiDataGrid-row:hover': {
          backgroundColor: theme.palette.grey[100],
        },
      }}
    >
      <DataGrid
        rows={filteredWeeklyNeed}
        columns={weeklyNeedColumns}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        disableRowSelectionOnClick
        onRowClick={(params) => handleContextMenu(params.row as InventoryItem, 'need')}
        localeText={{
          noRowsLabel: "Nenhum item encontrado",
        }}
      />
    </Box>
  );
  
  // Layout principal responsivo
  return (
    <Box sx={{ padding: theme.spacing(4) }}>
      {/* Métricas rápidas */}
      {isXSmall ? (
        <Stack direction="row" spacing={2} overflow="auto" pb={1} sx={{ scrollSnapType: 'x mandatory' }}>
          {renderMetrics()}
        </Stack>
      ) : (
        renderMetrics()
      )}
      
      {/* Botões de ação */}
      <Stack 
        direction={{ xs: 'column', sm: 'row' }} 
        spacing={2} 
        mb={3} 
        alignItems={{ xs: 'stretch', sm: 'center' }}
      >
        <MotionButton
          variant="contained"
          color="primary"
          onClick={handleAddNewProduct}
          aria-label="Adicionar novo item"
          sx={{ 
            height: 48, 
            borderRadius: 2,
            '&:hover': {
              transform: prefersReducedMotion ? 'none' : 'scale(1.05)'
            },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px'
            }
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 28, height: 28 }}>
              <Plus size={16} />
            </Avatar>
            <span>{t('inventory.newItem')}</span>
          </Stack>
        </MotionButton>
        
        <MotionButton
          variant="outlined"
          color="primary"
          onClick={handleOpenEstoqueAtualModal}
          aria-label="Registrar estoque atual"
          sx={{ 
            height: 48, 
            borderRadius: 2,
            '&:hover': {
              transform: prefersReducedMotion ? 'none' : 'scale(1.05)'
            },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: 'primary.main',
              outlineOffset: '2px'
            }
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ bgcolor: 'transparent', color: 'primary.main', width: 28, height: 28 }}>
              <Inventory fontSize="small" />
            </Avatar>
            <span>{t('inventario.estoqueAtual')}</span>
          </Stack>
        </MotionButton>
      </Stack>
      
      {/* Filtros */}
      {renderFilters()}
      
      {/* Conteúdo principal - responsivo */}
      {/* Mobile View */}
      {isMobile && (
        <>
          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="fullWidth"
            sx={{ mb: 2 }}
          >
            <Tab label="Estoque Atual" />
            <Tab label="Necessidade Semanal" />
          </Tabs>
          
          {tabValue === 0 && (
            <Paper 
              elevation={0}
              sx={{ 
                p: 2,
                borderRadius: 4,
                position: 'relative',
                mb: 4,
                ...cardScrollStyle
              }}
            >
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Tooltip title={t('common.exportCsv')}>
                  <IconButton 
                    onClick={() => handleExport('stock')}
                    aria-label="Exportar estoque atual em CSV"
                  >
                    <Download size={20} />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                Estoque Atual
              </Typography>
              {renderCurrentStockTable()}
            </Paper>
          )}
          
          {tabValue === 1 && (
            <Paper 
              elevation={0}
              sx={{ 
                p: 2,
                borderRadius: 4,
                position: 'relative',
                ...cardScrollStyle
              }}
            >
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Tooltip title={t('common.exportCsv')}>
                  <IconButton 
                    onClick={() => handleExport('need')}
                    aria-label="Exportar necessidade semanal em CSV"
                  >
                    <Download size={20} />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                Necessidade Semanal
              </Typography>
              {renderWeeklyNeedTable()}
            </Paper>
          )}
        </>
      )}
      
      {/* Tablet/Desktop View */}
      {!isMobile && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={isDesktop ? 6 : 12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2,
                borderRadius: 4,
                position: 'relative',
                height: '100%',
                ...cardScrollStyle
              }}
            >
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Tooltip title={t('common.exportCsv')}>
                  <IconButton 
                    onClick={() => handleExport('stock')}
                    aria-label="Exportar estoque atual em CSV"
                  >
                    <Download size={20} />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                Estoque Atual
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                renderCurrentStockTable()
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={isDesktop ? 6 : 12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 2,
                borderRadius: 4,
                position: 'relative',
                height: '100%',
                ...cardScrollStyle
              }}
            >
              <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                <Tooltip title={t('common.exportCsv')}>
                  <IconButton 
                    onClick={() => handleExport('need')}
                    aria-label="Exportar necessidade semanal em CSV"
                  >
                    <Download size={20} />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Typography variant="h6" sx={{ mb: 2 }}>
                Necessidade Semanal
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                renderWeeklyNeedTable()
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Menu de contexto */}
      <Menu
        open={contextMenu !== null}
        onClose={handleCloseContextMenu}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => {
          if (contextMenu?.type === 'stock' && contextMenu.item) {
            handleEditCurrentStock(contextMenu.item);
          } else if (contextMenu?.type === 'need' && contextMenu.item) {
            handleEditWeeklyNeed(contextMenu.item);
          }
          handleCloseContextMenu();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Editar</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => {
          // Lógica para duplicar item
          handleCloseContextMenu();
        }}>
          <ListItemIcon>
            <Copy size={18} />
          </ListItemIcon>
          <ListItemText>Duplicar</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => {
          if (contextMenu?.item && contextMenu?.type) {
            handleOpenDeleteModal(contextMenu.item, contextMenu.type);
          }
          handleCloseContextMenu();
        }}>
          <ListItemIcon>
            <Trash2 size={18} />
          </ListItemIcon>
          <ListItemText>Excluir</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Modal para adicionar novo item */}
      <Dialog
        open={openCurrentStockModal}
        onClose={() => setOpenCurrentStockModal(false)}
        aria-labelledby="new-item-modal-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: { xs: '100%', sm: '440px' }
          }
        }}
      >
        <DialogTitle id="new-item-modal-title">
          {t('inventory.form.titleNew', "Adicionar novo item")}
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth error={!!formErrors.nome}>
              <InputLabel htmlFor="nome-item">Nome</InputLabel>
              <OutlinedInput
                id="nome-item"
                name="nome"
                value={currentStockForm.nome}
                onChange={handleCurrentStockChange}
                label="Nome"
                autoFocus
                fullWidth
              />
              {formErrors.nome && (
                <FormHelperText>{formErrors.nome}</FormHelperText>
              )}
            </FormControl>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth error={!!formErrors.quantidade}>
                  <InputLabel htmlFor="quantidade-item">Quantidade</InputLabel>
                  <OutlinedInput
                    id="quantidade-item"
                    name="quantidade"
                    type="number"
                    value={currentStockForm.quantidade}
                    onChange={handleCurrentStockChange}
                    label="Quantidade"
                  />
                  {formErrors.quantidade && (
                    <FormHelperText>{formErrors.quantidade}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="unidade-label">Unidade</InputLabel>
                  <Select
                    labelId="unidade-label"
                    id="unidade-select"
                    name="unidade"
                    value={currentStockForm.unidade}
                    onChange={handleCurrentStockChange as any}
                    label="Unidade"
                  >
                    {unitOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <FormControl fullWidth>
              <InputLabel id="categoria-label">Categoria</InputLabel>
              <Select
                labelId="categoria-label"
                id="categoria-select"
                name="categoria"
                value={currentStockForm.categoria}
                onChange={handleCurrentStockChange as any}
                label="Categoria"
              >
                <MenuItem value="bebidas">Bebidas</MenuItem>
                <MenuItem value="legumes">Legumes</MenuItem>
                <MenuItem value="carnes">Carnes</MenuItem>
                <MenuItem value="massas">Massas</MenuItem>
                <MenuItem value="outros">Outros</MenuItem>
              </Select>
            </FormControl>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="quant-minima">Quantidade Mínima</InputLabel>
                  <OutlinedInput
                    id="quant-minima"
                    name="quantidadeMinima"
                    type="number"
                    value={currentStockForm.quantidadeMinima}
                    onChange={handleCurrentStockChange}
                    label="Quantidade Mínima"
                  />
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth error={!!formErrors.precoUnitario}>
                  <InputLabel htmlFor="preco-unitario">Preço Unitário (€)</InputLabel>
                  <OutlinedInput
                    id="preco-unitario"
                    name="precoUnitario"
                    type="number"
                    value={currentStockForm.precoUnitario}
                    onChange={handleCurrentStockChange}
                    label="Preço Unitário (€)"
                    startAdornment={
                      <InputAdornment position="start">€</InputAdornment>
                    }
                  />
                  {formErrors.precoUnitario && (
                    <FormHelperText>{formErrors.precoUnitario}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            
            <FormControl fullWidth>
              <InputLabel htmlFor="data-validade" shrink>
                Data de Validade
              </InputLabel>
              <OutlinedInput
                id="data-validade"
                name="dataValidade"
                type="date"
                value={currentStockForm.dataValidade}
                onChange={handleCurrentStockChange}
                label="Data de Validade"
                notched
              />
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel htmlFor="localizacao">Localização</InputLabel>
              <OutlinedInput
                id="localizacao"
                name="localizacao"
                value={currentStockForm.localizacao}
                onChange={handleCurrentStockChange}
                label="Localização"
                placeholder="Exemplo: Prateleira 3, Geladeira 2"
              />
            </FormControl>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setOpenCurrentStockModal(false)}
            color="inherit"
          >
            {t('inventory.form.cancel', "Cancelar")}
          </Button>
          <Button 
            onClick={handleSubmitCurrentStock}
            variant="contained"
            color="primary"
            disableElevation
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
          >
            {t('inventory.form.save', "Salvar")}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal para adicionar necessidade semanal */}
      <Dialog
        open={openWeeklyNeedModal}
        onClose={() => setOpenWeeklyNeedModal(false)}
        aria-labelledby="weekly-need-modal-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: { xs: '100%', sm: '440px' }
          }
        }}
      >
        <DialogTitle id="weekly-need-modal-title">
          {t('inventory.form.titleWeekly', "Registrar necessidade semanal")}
        </DialogTitle>
        
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <FormControl fullWidth error={!!formErrors.nome}>
              <InputLabel htmlFor="nome-necessidade">Nome</InputLabel>
              <OutlinedInput
                id="nome-necessidade"
                name="nome"
                value={weeklyNeedForm.nome}
                onChange={handleWeeklyNeedChange}
                label="Nome"
                autoFocus
                fullWidth
              />
              {formErrors.nome && (
                <FormHelperText>{formErrors.nome}</FormHelperText>
              )}
            </FormControl>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth error={!!formErrors.quantidade}>
                  <InputLabel htmlFor="quantidade-necessidade">Quantidade</InputLabel>
                  <OutlinedInput
                    id="quantidade-necessidade"
                    name="quantidade"
                    type="number"
                    value={weeklyNeedForm.quantidade}
                    onChange={handleWeeklyNeedChange}
                    label="Quantidade"
                  />
                  {formErrors.quantidade && (
                    <FormHelperText>{formErrors.quantidade}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="unidade-necessidade-label">Unidade</InputLabel>
                  <Select
                    labelId="unidade-necessidade-label"
                    id="unidade-necessidade-select"
                    name="unidade"
                    value={weeklyNeedForm.unidade}
                    onChange={handleWeeklyNeedChange as any}
                    label="Unidade"
                  >
                    {unitOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <FormControl fullWidth error={!!formErrors.precoUnitario}>
              <InputLabel htmlFor="preco-unitario-necessidade">Preço Unitário (€)</InputLabel>
              <OutlinedInput
                id="preco-unitario-necessidade"
                name="precoUnitario"
                type="number"
                value={weeklyNeedForm.precoUnitario}
                onChange={handleWeeklyNeedChange}
                label="Preço Unitário (€)"
                startAdornment={
                  <InputAdornment position="start">€</InputAdornment>
                }
              />
              {formErrors.precoUnitario && (
                <FormHelperText>{formErrors.precoUnitario}</FormHelperText>
              )}
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel htmlFor="observacao">Observação</InputLabel>
              <OutlinedInput
                id="observacao"
                name="observacao"
                value={weeklyNeedForm.observacao}
                onChange={handleWeeklyNeedChange}
                label="Observação"
                multiline
                rows={3}
                placeholder="Detalhes adicionais sobre esta necessidade semanal"
              />
            </FormControl>
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setOpenWeeklyNeedModal(false)}
            color="inherit"
          >
            {t('inventory.form.cancel', "Cancelar")}
          </Button>
          <Button 
            onClick={handleSubmitWeeklyNeed}
            variant="contained"
            color="primary"
            disableElevation
            disabled={isSubmitting}
            startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
          >
            {t('inventory.form.save', "Salvar")}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Modal do FormularioProduto */}
      <Dialog 
        open={openFormularioProduto} 
        onClose={() => setOpenFormularioProduto(false)}
        fullWidth
        maxWidth="md"
        disableEscapeKeyDown
        PaperProps={{
          sx: { 
            overflowY: 'visible',
            borderRadius: 2
          }
        }}
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'center',
            justifyContent: 'center',
          }
        }}
      >
        <Box sx={{ overflowY: 'auto', position: 'relative' }}>
          <FormularioProduto 
            produtoId={produtoIdParaEditar}
            onSave={handleFormularioSalvo}
            onCancel={() => setOpenFormularioProduto(false)}
          />
        </Box>
      </Dialog>
      
      {/* Modal de Estoque Atual */}
      <Dialog
        open={openEstoqueAtualModal}
        onClose={() => setOpenEstoqueAtualModal(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t('inventario.estoqueAtual')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t('inventario.instrucaoRegistroEstoque')}
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="produto-label">{t('inventario.produto')}</InputLabel>
              <Select
                labelId="produto-label"
                value={estoqueAtualData.produtoId}
                onChange={(e) => {
                  handleProdutoSelection(e.target.value as string);
                }}
                label={t('inventario.produto')}
              >
                {produtosDisponiveis.map(produto => (
                  <MenuItem key={produto.id} value={produto.id}>
                    {produto.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {estoqueAtualData.produtoId && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label={t('inventario.quantidadeAtual')}
                      name="quantidadeAtual"
                      value={estoqueAtualData.quantidadeAtual}
                      onChange={handleEstoqueAtualChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {estoqueAtualData.unidadeMedida}
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label={t('inventario.necessidadeSemanal')}
                      name="necessidadeSemanal"
                      value={estoqueAtualData.necessidadeSemanal}
                      onChange={handleEstoqueAtualChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {estoqueAtualData.unidadeMedida}
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {t('inventario.calculoAutomatico')}
                  </Typography>
                  
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={5}>
                      <Typography variant="body2" color="text.secondary">
                        {t('inventario.quantidadeComprar')}
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {estoqueAtualData.quantidadeComprar} {estoqueAtualData.unidadeMedida}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEstoqueAtualModal(false)}>
            {t('comum.cancelar')}
          </Button>
          <Button 
            variant="contained"
            onClick={handleSalvarEstoqueAtual}
            disabled={!estoqueAtualData.produtoId || isSubmitting}
          >
            {isSubmitting ? t('comum.salvando') : t('comum.salvar')}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para feedback de exportação */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          severity="success" 
          onClose={() => setSnackbarOpen(false)}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      {/* Botões de ação na barra de títulos */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {t('Inventário')}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 0.5 }}>
            {t('Gerenciamento de estoque e produtos')}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Button
            color="primary"
            variant={showSugestaoCompra ? "contained" : "outlined"}
            startIcon={<ShoppingCartCheckoutIcon />}
            onClick={toggleSugestaoCompra}
            sx={{ ml: 1 }}
          >
            {t('inventario.sugestaoCompra')}
          </Button>
        </Grid>
      </Grid>
      
      {/* Relatório de Sugestão de Compra */}
      {showSugestaoCompra && (
        <RelatorioSugestaoCompra 
          itens={convertToItemInventario(filteredCurrentStock)} 
          onPrint={() => window.print()}
          onExport={() => handleExport('stock')}
        />
      )}
      
      {/* Adicionar o diálogo de sugestão de compra */}
      <SugestaoDeCompra 
        itens={itens}
        open={openSugestaoCompra}
        onClose={() => setOpenSugestaoCompra(false)}
      />
    </Box>
  );
};

export default Inventario;