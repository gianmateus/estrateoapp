import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Checkbox, 
  TextField, 
  Button, 
  IconButton, 
  Paper 
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  Add as AddIcon 
} from '@mui/icons-material';

// Interface para a estrutura de dados de uma tarefa
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoText, setNewTodoText] = useState('');

  // Adicionar nova tarefa
  const addTodo = () => {
    if (newTodoText.trim() !== '') {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false
      };
      setTodos([...todos, newTodo]);
      setNewTodoText('');
    }
  };

  // Alternar o estado de conclusão da tarefa
  const toggleTodo = (id: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Remover uma tarefa
  const removeTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Renderização correta de um componente React
  const renderTodoList = () => {
    return (
      <List>
        {todos.map(todo => (
          <ListItem key={todo.id} divider>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
            </ListItemIcon>
            <ListItemText
              primary={todo.text}
              sx={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                color: todo.completed ? 'text.secondary' : 'text.primary'
              }}
            />
            <IconButton edge="end" onClick={() => removeTodo(todo.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Lista de Tarefas
      </Typography>
      
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Nova tarefa..."
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              addTodo();
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={addTodo}
          sx={{ ml: 1 }}
        >
          Adicionar
        </Button>
      </Box>
      
      {/* Aqui estamos usando a função de renderização, NÃO o objeto React diretamente */}
      {renderTodoList()}
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          {todos.filter(todo => todo.completed).length} de {todos.length} tarefas concluídas
        </Typography>
      </Box>
    </Paper>
  );
};

export default Todo; 