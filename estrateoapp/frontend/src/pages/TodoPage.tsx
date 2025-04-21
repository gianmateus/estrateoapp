import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import Todo from '../components/Todo';

const TodoPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Gerenciador de Tarefas
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Organize suas atividades com nosso gerenciador de tarefas simples
        </Typography>

        {/* Aqui o componente Todo é usado corretamente como JSX */}
        <Todo />
      </Box>
    </Container>
  );
};

export default TodoPage; 