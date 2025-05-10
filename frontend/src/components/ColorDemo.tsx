import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  AlertTitle,
  Chip,
  TextField,
  useTheme as useMuiTheme,
} from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';

// Cores padrão do sistema
const COLORS = {
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  BLUE_DARK: '#0A2540',
  GRAY_LIGHT: '#F5F5F7',
  GRAY_MEDIUM: '#86868B',
  GRAY_DARK: '#1D1D1F',
  GRAY_DARKEST: '#121212'
};

/**
 * Componente que demonstra a paleta de cores do sistema
 */
const ColorDemo = () => {
  const { mode, toggleTheme } = useTheme();
  const theme = useMuiTheme();

  // Função para converter cor RGB para HEX
  const rgbToHex = (color: string): string => {
    // Se já for HEX, retornar
    if (color.startsWith('#')) return color;
    
    // Se for rgb ou rgba
    const rgbaMatch = color.match(/rgba?\((\d+), (\d+), (\d+)(?:, [\d.]+)?\)/);
    if (rgbaMatch) {
      const r = parseInt(rgbaMatch[1]);
      const g = parseInt(rgbaMatch[2]);
      const b = parseInt(rgbaMatch[3]);
      return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }
    
    return color;
  };

  // Renderiza um quadrado de cor com informações
  const ColorSwatch = ({ color, name, description }: { color: string, name: string, description?: string }) => (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          width: '100%',
          height: 80,
          backgroundColor: color,
          borderRadius: 1,
          mb: 1,
          border: theme.palette.mode === 'light' && color === '#FFFFFF' 
            ? '1px solid #E0E0E0' 
            : 'none'
        }}
      />
      <Typography variant="subtitle2" fontWeight="bold">
        {name}
      </Typography>
      <Typography variant="caption" display="block">
        {color}
      </Typography>
      {description && (
        <Typography variant="caption" color="text.secondary" display="block">
          {description}
        </Typography>
      )}
    </Box>
  );

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h1" gutterBottom>
        Identidade Visual do Estrateo
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body1">
          Modo atual: <strong>{mode === 'light' ? 'Claro' : 'Escuro'}</strong>
        </Typography>
        <Button 
          variant="outlined" 
          onClick={toggleTheme}
          size="small"
        >
          Alternar Tema
        </Button>
      </Box>
      
      <Divider sx={{ my: 4 }} />
      
      {/* Paleta principal de cores */}
      <Typography variant="h2" gutterBottom>
        1. Paleta de Cores Oficial
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <ColorSwatch 
            color={COLORS.BLUE_DARK} 
            name="Azul Escuro (Primária)" 
            description="Utilizada para elementos de destaque e ação principal"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ColorSwatch 
            color={COLORS.BLACK} 
            name="Preto (Secundária)" 
            description="Utilizada para textos e elementos secundários"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ColorSwatch 
            color={COLORS.WHITE} 
            name="Branco" 
            description="Fundo principal e texto de alto contraste"
          />
        </Grid>
      </Grid>
      
      <Typography variant="h3" gutterBottom>
        Cores Auxiliares
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={6} md={3}>
          <ColorSwatch 
            color={COLORS.GRAY_LIGHT} 
            name="Cinza Claro" 
            description="Fundos secundários, cards"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <ColorSwatch 
            color={COLORS.GRAY_MEDIUM} 
            name="Cinza Médio" 
            description="Textos secundários, bordas"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <ColorSwatch 
            color={COLORS.GRAY_DARK} 
            name="Cinza Escuro" 
            description="Textos de ênfase, ícones"
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <ColorSwatch 
            color={COLORS.GRAY_DARKEST} 
            name="Cinza Muito Escuro" 
            description="Utilizado no modo escuro"
          />
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      {/* Aplicação em componentes */}
      <Typography variant="h2" gutterBottom>
        2. Aplicação em Componentes
      </Typography>
      
      <Grid container spacing={4}>
        {/* Botões */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              Botões
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <Button variant="contained" color="primary">
                Primário
              </Button>
              <Button variant="contained" color="secondary">
                Secundário
              </Button>
              <Button variant="outlined" color="primary">
                Contorno
              </Button>
              <Button variant="text" color="primary">
                Texto
              </Button>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Botão primário: {rgbToHex(theme.palette.primary.main)} com texto: {rgbToHex(theme.palette.primary.contrastText)}
                <br/>
                Botão secundário: {rgbToHex(theme.palette.secondary.main)} com texto: {rgbToHex(theme.palette.secondary.contrastText)}
              </Typography>
            </Box>
          </Paper>
          
          {/* Cards */}
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              Cards
            </Typography>
            
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Título do Card
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Este é um exemplo de conteúdo de card com a aplicação das cores do sistema.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Button variant="contained" size="small">
                    Ação
                  </Button>
                </Box>
              </CardContent>
            </Card>
            
            <Typography variant="caption" color="text.secondary">
              Background: {rgbToHex(theme.palette.background.paper)}
              <br/>
              Texto primário: {rgbToHex(theme.palette.text.primary)}
              <br/>
              Texto secundário: {rgbToHex(theme.palette.text.secondary)}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Tabelas e campos de formulário */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              Tabelas
            </Typography>
            
            <TableContainer sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell align="right">Valor</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Item 1</TableCell>
                    <TableCell align="right">R$ 1.000,00</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label="Ativo" 
                        color="primary" 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Item 2</TableCell>
                    <TableCell align="right">R$ 2.500,00</TableCell>
                    <TableCell align="right">
                      <Chip 
                        label="Pendente" 
                        color="secondary" 
                        size="small" 
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="caption" color="text.secondary">
              Cabeçalho: {rgbToHex(window.getComputedStyle(document.querySelector('.MuiTableHead-root .MuiTableCell-root') as Element).backgroundColor)}
              <br/>
              Linha: {rgbToHex(theme.palette.background.paper)}
              <br/>
              Chip primário: {rgbToHex(theme.palette.primary.main)}
            </Typography>
          </Paper>
          
          <Paper sx={{ p: 3 }}>
            <Typography variant="h3" gutterBottom>
              Formulários e Alertas
            </Typography>
            
            <TextField
              label="Campo de texto"
              fullWidth
              margin="normal"
              placeholder="Digite algo aqui"
              helperText="Campo com a cor do texto conforme tema"
            />
            
            <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
              <AlertTitle>Informação</AlertTitle>
              Este é um exemplo de alerta com as cores do sistema.
            </Alert>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Input label: {rgbToHex(theme.palette.mode === 'light' ? COLORS.GRAY_DARK : COLORS.GRAY_LIGHT)}
                <br/>
                Alerta: {rgbToHex(theme.palette.mode === 'light' ? 'rgba(10, 37, 64, 0.08)' : 'rgba(10, 37, 64, 0.3)')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 4 }} />
      
      <Typography variant="h2" gutterBottom>
        3. Regras de Aplicação e Referências
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h3" gutterBottom>
              Uso Apropriado das Cores
            </Typography>
            
            <Typography variant="body1" paragraph>
              • <strong>Cor primária (Azul Escuro #0A2540)</strong>: Use para botões de ação principal, links, elementos destacados e cabeçalhos importantes.
            </Typography>
            
            <Typography variant="body1" paragraph>
              • <strong>Cor secundária (Preto #000000)</strong>: Use para texto primário no modo claro, botões secundários e elementos que precisam de distinção mas não são o foco principal.
            </Typography>
            
            <Typography variant="body1" paragraph>
              • <strong>Branco (#FFFFFF)</strong>: Use como background principal no modo claro, e para texto no modo escuro.
            </Typography>
            
            <Typography variant="body1">
              • <strong>Cores de apoio (cinzas)</strong>: Use para criar hierarquia visual, separação de elementos e textos secundários.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h3" gutterBottom>
              Acessibilidade e Contraste
            </Typography>
            
            <Typography variant="body1" paragraph>
              Todas as combinações de cores foram testadas para garantir:
            </Typography>
            
            <Typography variant="body1" component="div">
              <ul>
                <li>Contraste WCAG AA (4.5:1) para texto normal</li>
                <li>Contraste WCAG AAA (7:1) para texto pequeno</li>
                <li>Distinção clara entre elementos interativos e estáticos</li>
                <li>Funcionamento adequado em ambos os modos (claro/escuro)</li>
              </ul>
            </Typography>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              Esta padronização visual está em fase de testes. Aguarde a aprovação final antes de enviar ao GitHub.
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ColorDemo; 