import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import apiClient from '../../services/api';
import { generatePDF } from '../../utils/pdfGenerator';

type ReportType = 'daily' | 'weekly' | 'monthly';

interface RelatorioModalDashboardProps {
  open: boolean;
  onClose: () => void;
}

const reportLabels: Record<ReportType, string> = {
  daily: 'Relatório Diário',
  weekly: 'Relatório Semanal',
  monthly: 'Relatório Mensal',
};

export const RelatorioModalDashboard: React.FC<RelatorioModalDashboardProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState<ReportType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (type: ReportType) => {
    setLoading(type);
    setError(null);
    try {
      const response = await apiClient.get(`/reports?type=${type}`);
      await generatePDF(response.data, type);
      onClose();
    } catch (err) {
      setError('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>Escolha o tipo de relatório</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={2}>
            {(['daily', 'weekly', 'monthly'] as ReportType[]).map((type) => (
              <Button
                key={type}
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleGenerate(type)}
                disabled={!!loading}
                startIcon={loading === type ? <CircularProgress size={18} /> : null}
              >
                {reportLabels[type]}
              </Button>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={!!loading}>Cancelar</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
}; 