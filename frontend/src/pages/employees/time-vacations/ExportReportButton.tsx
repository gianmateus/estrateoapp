import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Box,
  CircularProgress
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as CsvIcon,
  Print as PrintIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { AttendanceData } from './TimeVacationsPage';

interface ExportReportButtonProps {
  data: AttendanceData[];
  monthYear: { month: number; year: number };
}

const ExportReportButton: React.FC<ExportReportButtonProps> = ({ 
  data, 
  monthYear 
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportType, setExportType] = useState<'monthly' | 'annual'>('monthly');
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf');

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportClick = (format: 'pdf' | 'csv') => {
    setExportFormat(format);
    setShowExportDialog(true);
    handleClose();
  };

  const closeExportDialog = () => {
    setShowExportDialog(false);
  };

  const exportData = async () => {
    setExportLoading(true);
    try {
      // Simulação de exportação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aqui seria implementada a lógica real de exportação
      console.log('Exportando dados:', {
        data,
        monthYear,
        type: exportType,
        format: exportFormat
      });
      
      // Feedback visual (em produção, seria um download real)
      alert(t('relatorioExportadoComSucesso'));
      
      closeExportDialog();
    } catch (error) {
      console.error('Erro ao exportar relatório:', error);
      alert(t('erroAoExportarRelatorio'));
    } finally {
      setExportLoading(false);
    }
  };

  // Gerar nome do mês
  const getMonthName = (month: number) => {
    const date = new Date();
    date.setMonth(month - 1);
    return date.toLocaleString('pt-BR', { month: 'long' });
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          endIcon={<ArrowDownIcon />}
          onClick={handleClick}
          size="small"
        >
          {t('exportarRelatorio')}
        </Button>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleExportClick('pdf')}>
          <ListItemIcon>
            <PdfIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('exportarPDF')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExportClick('csv')}>
          <ListItemIcon>
            <CsvIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('exportarCSV')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t('imprimir')}</ListItemText>
        </MenuItem>
      </Menu>

      <Dialog open={showExportDialog} onClose={closeExportDialog}>
        <DialogTitle>{t('exportarRelatorio')}</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="report-type-label">{t('tipoDeRelatorio')}</InputLabel>
            <Select
              labelId="report-type-label"
              value={exportType}
              label={t('tipoDeRelatorio')}
              onChange={(e) => setExportType(e.target.value as 'monthly' | 'annual')}
            >
              <MenuItem value="monthly">
                {t('relatorioMensal')} - {getMonthName(monthYear.month)} {monthYear.year}
              </MenuItem>
              <MenuItem value="annual">
                {t('relatorioAnual')} - {monthYear.year}
              </MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeExportDialog}>
            {t('cancelar')}
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={exportData}
            disabled={exportLoading}
            startIcon={exportLoading ? <CircularProgress size={20} /> : (
              exportFormat === 'pdf' ? <PdfIcon /> : <CsvIcon />
            )}
          >
            {exportLoading ? t('exportando') : t('exportar')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExportReportButton; 