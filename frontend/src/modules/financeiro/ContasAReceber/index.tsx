import React, { useState } from 'react';
import { Box, Button, Modal, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ListaContasAReceber from './ListaContasAReceber';
import FormularioContaAReceber from './FormularioContaAReceber';

const ContasAReceber: React.FC = () => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  
  // Abrir o modal para adicionar nova conta
  const handleOpenModal = () => {
    setModalOpen(true);
  };
  
  // Fechar o modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      {/* Botão para adicionar nova conta */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenModal}
        >
          {t('novaContaAReceber')}
        </Button>
      </Box>
      
      {/* Lista de contas a receber */}
      <ListaContasAReceber />
      
      {/* Modal para adicionar nova conta */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-conta-a-receber"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 800, maxHeight: '90vh', overflow: 'auto' }}>
          <FormularioContaAReceber onClose={handleCloseModal} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ContasAReceber; 