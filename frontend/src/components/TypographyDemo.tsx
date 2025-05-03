import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Button, 
  Card, 
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Chip
} from '@mui/material';

/**
 * Componente de demonstração da tipografia do sistema
 * Mostra todos os elementos tipográficos configurados no tema
 */
const TypographyDemo = () => {
  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h1" gutterBottom>
        Demonstração de Tipografia
      </Typography>
      
      <Typography variant="body1" paragraph>
        Esta página mostra todos os elementos tipográficos padronizados do sistema Estrateo, utilizando a fonte <strong>Inter</strong> como fonte principal.
      </Typography>
      
      <Divider sx={{ my: 4 }} />
      
      {/* Seção de títulos */}
      <Typography variant="h2" gutterBottom>
        1. Hierarquia de Títulos
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h1" gutterBottom>
              Título h1 (2.5rem)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Font-weight: 700 (Bold) | Line-height: 1.2 | Letter-spacing: -0.015em
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h2" gutterBottom>
              Título h2 (2rem)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Font-weight: 600 (Semibold) | Line-height: 1.3 | Letter-spacing: -0.01em
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h3" gutterBottom>
              Título h3 (1.5rem)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Font-weight: 600 (Semibold) | Line-height: 1.4 | Letter-spacing: -0.005em
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h4" gutterBottom>
              Título h4 (1.25rem)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Font-weight: 500 (Medium) | Line-height: 1.4 | Letter-spacing: 0
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h5" gutterBottom>
              Título h5 (1.125rem)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Font-weight: 500 (Medium) | Line-height: 1.5 | Letter-spacing: 0
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Título h6 (1rem)
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Font-weight: 500 (Medium) | Line-height: 1.5 | Letter-spacing: 0
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      {/* Seção de texto corrido */}
      <Typography variant="h2" gutterBottom>
        2. Texto Corrido
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Subtitle1 (1rem - Medium)
            </Typography>
            <Typography variant="body1" paragraph>
              Body1 (1rem - Regular): Este é um exemplo de texto principal usado para conteúdo. A fonte Inter foi escolhida pela sua excelente legibilidade em telas de diferentes tamanhos e resoluções. Este texto demonstra como parágrafos longos são apresentados.
            </Typography>
            <Typography variant="body1">
              Este é outro parágrafo com o mesmo estilo body1, mostrando como funciona o espaçamento entre parágrafos consecutivos para garantir boa leitura e organização visual.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Subtitle2 (0.875rem - Medium)
            </Typography>
            <Typography variant="body2" paragraph>
              Body2 (0.875rem - Regular): Este é um exemplo de texto secundário, usado para conteúdo menos destacado ou informações complementares. O tamanho é menor do que o texto principal, proporcionando hierarquia visual.
            </Typography>
            <Typography variant="caption" display="block" paragraph>
              Caption (0.75rem - Regular): Texto de legenda usado para informações auxiliares, notas de rodapé ou explicações curtas que não precisam de tanto destaque visual.
            </Typography>
            <Typography variant="overline" display="block">
              OVERLINE (0.75REM - SEMIBOLD)
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      {/* Seção de aplicação em componentes */}
      <Typography variant="h2" gutterBottom>
        3. Aplicação em Componentes
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Card com Tipografia
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Este é um exemplo de card utilizando os estilos tipográficos padronizados. Os cards tipicamente usam h5 para títulos e body2 para conteúdo.
              </Typography>
              <Button variant="contained">Botão Padrão</Button>
            </CardContent>
          </Card>
          
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Botões e Chips
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              <Button variant="contained">Primário</Button>
              <Button variant="outlined">Secundário</Button>
              <Button variant="text">Texto</Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <Chip label="Chip Padrão" />
              <Chip label="Chip Clicável" onClick={() => {}} />
              <Chip label="Chip Deletável" onDelete={() => {}} />
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Formulários
            </Typography>
            <TextField 
              label="Campo de texto padrão" 
              fullWidth 
              margin="normal"
              helperText="Texto de ajuda com estilo caption"
            />
            <TextField 
              label="Campo com erro" 
              fullWidth 
              margin="normal"
              error
              helperText="Mensagem de erro com estilo caption"
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Tabelas
            </Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Descrição</TableCell>
                  <TableCell align="right">Valor</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Item 1</TableCell>
                  <TableCell align="right">R$ 100,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Item 2</TableCell>
                  <TableCell align="right">R$ 200,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Item 3</TableCell>
                  <TableCell align="right">R$ 300,00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Tabela com tipografia padronizada
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="body2" color="text.secondary" align="center">
        Demonstração da tipografia padronizada do Sistema Estrateo.
      </Typography>
    </Box>
  );
};

export default TypographyDemo; 