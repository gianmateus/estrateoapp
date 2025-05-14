import React, { useState } from 'react';
import { Box, Button, Modal, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ListaContasAPagar from './ListaContasAPagar';
import FormularioContaAPagar from './FormularioContaAPagar';

const ContasAPagar: React.FC = () => {
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
          {t('novaContaAPagar')}
        </Button>
      </Box>
      
      {/* Lista de contas a pagar */}
      <ListaContasAPagar />
      
      {/* Modal para adicionar nova conta */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-conta-a-pagar"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 800, maxHeight: '90vh', overflow: 'auto' }}>
          <FormularioContaAPagar onClose={handleCloseModal} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ContasAPagar; 