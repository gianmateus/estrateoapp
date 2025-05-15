import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider
} from '@mui/material';
import { 
  Print as PrintIcon,
  Download as DownloadIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ItemInventario, calcularNecessidadeSemanal, calcularSugestaoCompra } from '../../contexts/InventarioContext';

interface SugestaoDeCompraProps {
  itens: ItemInventario[];
  open: boolean;
  onClose: () => void;
}

interface ItemSugestao {
  id: string;
  nome: string;
  quantidadeAtual: number;
  quantidadeNecessaria: number;
  diferenca: number;
  unidadeMedida: string;
  periodicidade: string;
}

const SugestaoDeCompra: React.FC<SugestaoDeCompraProps> = ({
  itens,
  open,
  onClose
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // Filtrar itens que precisam de compra e preparar dados para exibição
  const itensSugestao = useMemo(() => {
    return itens
      .filter(item => {
        if (!item.nivelMinimoEstoque) return false;
        
        const sugestaoCompra = calcularSugestaoCompra(
          item.quantidade,
          item.nivelMinimoEstoque,
          item.periodicidadeNecessidade || 'semanal'
        );
        
        return sugestaoCompra > 0;
      })
      .map(item => {
        const necessidadeSemanal = calcularNecessidadeSemanal(
          item.nivelMinimoEstoque || 0,
          item.periodicidadeNecessidade || 'semanal'
        );
        
        const sugestaoCompra = calcularSugestaoCompra(
          item.quantidade,
          item.nivelMinimoEstoque || 0,
          item.periodicidadeNecessidade || 'semanal'
        );
        
        return {
          id: item.id,
          nome: item.nome,
          quantidadeAtual: item.quantidade,
          quantidadeNecessaria: necessidadeSemanal,
          diferenca: sugestaoCompra,
          unidadeMedida: item.unidadeMedida,
          periodicidade: item.periodicidadeNecessidade || 'semanal'
        } as ItemSugestao;
      })
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }, [itens]);

  // Função para formatar a periodicidade em texto legível
  const formatarPeriodicidade = (periodicidade: string): string => {
    switch (periodicidade) {
      case 'diario': return t('inventario.diario');
      case 'semanal': return t('inventario.semanal');
      case 'mensal': return t('inventario.mensal');
      case 'trimestral': return t('inventario.trimestral');
      default: return t('inventario.semanal');
    }
  };

  // Gerar PDF
  const gerarPDF = () => {
    setLoading(true);
    
    try {
      const doc = new jsPDF();
      
      // Título
      doc.setFontSize(16);
      doc.text(t('inventario.sugestaoCompraTitle') || 'Sugestão de Compra', 105, 15, { align: 'center' });
      
      // Data de geração
      doc.setFontSize(10);
      doc.text(
        `${t('inventario.geradoEm') || 'Gerado em'}: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        105, 22, { align: 'center' }
      );
      
      // Total de itens
      doc.setFontSize(12);
      doc.text(
        `${t('inventario.totalItens') || 'Total de itens'}: ${itensSugestao.length}`,
        14, 30
      );
      
      // Tabela
      const tableColumn = [
        t('inventario.produto') || 'Produto',
        t('inventario.quantidadeAtual') || 'Quantidade Atual',
        t('inventario.quantidadeNecessaria') || 'Quantidade Necessária',
        t('inventario.diferenca') || 'Diferença',
        t('inventario.unidade') || 'Unidade'
      ];
      
      const tableRows = itensSugestao.map(item => [
        item.nome,
        item.quantidadeAtual.toString(),
        item.quantidadeNecessaria.toFixed(1),
        item.diferenca.toFixed(1),
        item.unidadeMedida
      ]);
      
      (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3
        },
        headStyles: {
          fillColor: [66, 66, 66],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240]
        }
      });
      
      // Rodapé
      const finalY = (doc as any).lastAutoTable.finalY || 35;
      doc.setFontSize(10);
      doc.text(
        `${t('inventario.observacao') || 'Observação'}: ${t('inventario.basedDefinicaoNecessidade') || 'Baseado na definição de necessidade periódica'}`,
        14, finalY + 10
      );
      
      // Salvar o PDF
      doc.save('sugestao-compra.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <ShoppingCartIcon sx={{ mr: 1 }} />
          {t('inventario.sugestaoCompraTitle')}
        </Box>
      </DialogTitle>
      
      <DialogContent>
        {itensSugestao.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
            {t('inventario.nenhumItemNecessita')}
          </Typography>
        ) : (
          <>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('inventario.totalItensNecessitamCompra', { total: itensSugestao.length })}
              </Typography>
            </Box>
            
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('inventario.produto')}</TableCell>
                    <TableCell align="right">{t('inventario.quantidadeAtual')}</TableCell>
                    <TableCell align="right">{t('inventario.quantidadeNecessaria')}</TableCell>
                    <TableCell align="right">{t('inventario.diferenca')}</TableCell>
                    <TableCell align="center">{t('inventario.periodicidade')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {itensSugestao.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row">
                        {item.nome}
                      </TableCell>
                      <TableCell align="right">
                        {item.quantidadeAtual} {item.unidadeMedida}
                      </TableCell>
                      <TableCell align="right">
                        {item.quantidadeNecessaria.toFixed(1)} {item.unidadeMedida}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          size="small"
                          color="warning"
                          label={`${item.diferenca.toFixed(1)} ${item.unidadeMedida}`}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          size="small"
                          color="primary"
                          variant="outlined"
                          label={formatarPeriodicidade(item.periodicidade)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" color="text.secondary">
              {t('inventario.geradoEm')}: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </Typography>
          </>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={onClose}
          color="inherit"
        >
          {t('comum.fechar')}
        </Button>
        
        {itensSugestao.length > 0 && (
          <Button
            startIcon={<PrintIcon />}
            variant="contained"
            color="primary"
            onClick={gerarPDF}
            disabled={loading}
          >
            {loading ? t('comum.gerando') : t('comum.exportarPDF')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SugestaoDeCompra; 