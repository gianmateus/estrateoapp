import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContactPhone as ContactIcon,
  Description as DescriptionIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '../../services/api';
import { Cliente, TipoCliente, StatusCliente } from '../../types/clienteTypes';
import ClienteForm from '../../components/clientes/ClienteForm';

interface ClientesResponse {
  data: Cliente[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

const ClientesListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Estados
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Filtros
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  
  // Carregar clientes
  const loadClientes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Adicionar parâmetros de paginação
      params.append('page', String(page + 1)); // +1 porque a API usa base 1 para paginação
      params.append('pageSize', String(rowsPerPage));
      
      // Adicionar filtros de pesquisa
      if (searchTerm) {
        params.append('nome', searchTerm);
      }
      
      if (filtroTipo) {
        params.append('tipo', filtroTipo);
      }
      
      if (filtroStatus) {
        params.append('status', filtroStatus);
      }
      
      const response = await api.get<ClientesResponse>(`/clientes/clientes?${params.toString()}`);
      
      setClientes(response.data.data);
      setTotalItems(response.data.pagination.total);
      
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadClientes();
  }, [page, rowsPerPage, filtroTipo, filtroStatus]);
  
  // Handlers
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Voltar para a primeira página
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  
  const handleSearch = () => {
    setPage(0); // Voltar para a primeira página ao pesquisar
    loadClientes();
  };
  
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleOpenNewDialog = () => {
    setSelectedCliente(null);
    setOpenDialog(true);
  };
  
  const handleEditCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const handleDialogSuccess = () => {
    setOpenDialog(false);
    loadClientes();
  };
  
  const handleDeleteClick = (cliente: Cliente) => {
    setClienteToDelete(cliente);
    setDeleteDialogOpen(true);
  };
  
  const handleConfirmDelete = async () => {
    if (clienteToDelete) {
      try {
        await api.delete(`/clientes/clientes/${clienteToDelete.id}`);
        loadClientes();
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    }
    setDeleteDialogOpen(false);
    setClienteToDelete(null);
  };
  
  const handleViewDetails = (cliente: Cliente) => {
    navigate(`/clientes/${cliente.id}`);
  };
  
  const handleToggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };
  
  const handleFilterChange = (filterName: string, value: string) => {
    if (filterName === 'tipo') {
      setFiltroTipo(value);
    } else if (filterName === 'status') {
      setFiltroStatus(value);
    }
    setPage(0); // Voltar para a primeira página
  };
  
  const handleClearFilters = () => {
    setFiltroTipo('');
    setFiltroStatus('');
    setSearchTerm('');
    setPage(0);
  };
  
  // Função para renderizar o status com cores
  const renderStatus = (status: StatusCliente) => {
    let color = 'default';
    
    switch (status) {
      case 'ativo':
        color = 'success';
        break;
      case 'inativo':
        color = 'error';
        break;
      case 'prospecto':
        color = 'info';
        break;
      case 'arquivado':
        color = 'warning';
        break;
    }
    
    return (
      <Chip
        label={t(`cliente.status.${status}`)}
        color={color as any}
        size="small"
      />
    );
  };
  
  // Função para formatar data relativa
  const formatDateRelative = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (error) {
      return dateStr;
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {t('cliente.listaClientes')}
            </Typography>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/dashboard">
                {t('dashboard.breadcrumb')}
              </Link>
              <Typography color="textPrimary">{t('cliente.clientes')}</Typography>
            </Breadcrumbs>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenNewDialog}
          >
            {t('cliente.adicionar')}
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('cliente.pesquisar')}
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
                InputProps={{
                  endAdornment: (
                    <IconButton size="small" onClick={handleSearch}>
                      <SearchIcon />
                    </IconButton>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={handleToggleFilters}
                sx={{ mr: 1 }}
              >
                {t('filtros')}
              </Button>
              
              {(filtroTipo || filtroStatus || searchTerm) && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleClearFilters}
                >
                  {t('limparFiltros')}
                </Button>
              )}
            </Grid>
            
            {filtersOpen && (
              <>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="tipo-label">{t('cliente.tipo')}</InputLabel>
                    <Select
                      labelId="tipo-label"
                      id="tipo-filter"
                      value={filtroTipo}
                      label={t('cliente.tipo')}
                      onChange={(e) => handleFilterChange('tipo', e.target.value)}
                    >
                      <MenuItem value="">{t('todos')}</MenuItem>
                      <MenuItem value="pessoa_fisica">{t('cliente.pessoaFisica')}</MenuItem>
                      <MenuItem value="pessoa_juridica">{t('cliente.pessoaJuridica')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="status-label">{t('cliente.status.titulo')}</InputLabel>
                    <Select
                      labelId="status-label"
                      id="status-filter"
                      value={filtroStatus}
                      label={t('cliente.status.titulo')}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <MenuItem value="">{t('todos')}</MenuItem>
                      <MenuItem value="ativo">{t('cliente.status.ativo')}</MenuItem>
                      <MenuItem value="inativo">{t('cliente.status.inativo')}</MenuItem>
                      <MenuItem value="prospecto">{t('cliente.status.prospecto')}</MenuItem>
                      <MenuItem value="arquivado">{t('cliente.status.arquivado')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('cliente.tipo')}</TableCell>
                  <TableCell>{t('cliente.nome')}</TableCell>
                  <TableCell>{t('cliente.contato')}</TableCell>
                  <TableCell>{t('cliente.status.titulo')}</TableCell>
                  <TableCell>{t('cliente.dataCadastro')}</TableCell>
                  <TableCell>{t('acoes')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : clientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1">
                        {t('cliente.semResultados')}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  clientes.map((cliente) => (
                    <TableRow 
                      key={cliente.id}
                      hover
                      onClick={() => handleViewDetails(cliente)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        {cliente.tipo === 'pessoa_fisica' ? (
                          <Chip icon={<PersonIcon />} label={t('cliente.pessoaFisica')} size="small" variant="outlined" />
                        ) : (
                          <Chip icon={<BusinessIcon />} label={t('cliente.pessoaJuridica')} size="small" variant="outlined" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {cliente.nome}
                        </Typography>
                        {cliente.empresa && (
                          <Typography variant="caption" color="textSecondary">
                            {cliente.empresa}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {cliente.email && (
                          <Typography variant="body2">
                            {cliente.email}
                          </Typography>
                        )}
                        {cliente.telefone && (
                          <Typography variant="caption" color="textSecondary">
                            {cliente.telefone}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{renderStatus(cliente.status)}</TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDateRelative(cliente.dataCadastro)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCliente(cliente);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(cliente);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            count={totalItems}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={t('itensPorPagina')}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelDisplayedRows={({ from, to, count }) => 
              `${from}-${to} ${t('de')} ${count !== -1 ? count : `${t('mais_que')} ${to}`}`
            }
          />
        </Paper>
      </Box>
      
      {/* Dialog para adicionar/editar cliente */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <ClienteForm
            cliente={selectedCliente || undefined}
            onSubmitSuccess={handleDialogSuccess}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
      
      {/* Dialog de confirmação de exclusão */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>{t('cliente.confirmarExclusao')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('cliente.confirmarExclusaoTexto', { nome: clienteToDelete?.nome })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            {t('cancelar')}
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            {t('excluir')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ClientesListPage; 