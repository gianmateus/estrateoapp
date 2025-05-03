# Guia de Tipografia - Estrateo

Este documento apresenta o sistema tipográfico padronizado do Estrateo, estabelecendo uma hierarquia visual clara e consistente para toda a plataforma.

## Família de Fonte

A plataforma Estrateo utiliza a fonte **Inter** como fonte principal, com fallbacks apropriados para garantir a consistência visual em diferentes sistemas:

```css
font-family: 'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif;
```

### Sobre a fonte Inter

Inter é uma família tipográfica desenhada especificamente para alta legibilidade em telas. Suas características incluem:

- Altura-x otimizada para legibilidade
- Formas claras e distintas para cada caractere
- Espaçamento cuidadoso para melhor leitura
- Suporte a vários idiomas e sistemas de escrita
- Excelente legibilidade em tamanhos pequenos

## Hierarquia Tipográfica

### Headings (Títulos)

| Elemento | Tamanho | Peso | Line-height | Letter-spacing | Uso |
|----------|---------|------|-------------|----------------|-----|
| **h1** | 2.5rem (40px) | 700 (Bold) | 1.2 | -0.015em | Títulos principais de página |
| **h2** | 2rem (32px) | 600 (Semibold) | 1.3 | -0.01em | Subtítulos de seções |
| **h3** | 1.5rem (24px) | 600 (Semibold) | 1.4 | -0.005em | Cabeçalhos de cards e painéis |
| **h4** | 1.25rem (20px) | 500 (Medium) | 1.4 | 0 | Subtítulos secundários |
| **h5** | 1.125rem (18px) | 500 (Medium) | 1.5 | 0 | Títulos de pequenos componentes |
| **h6** | 1rem (16px) | 500 (Medium) | 1.5 | 0 | Títulos de itens em listas |

### Body Text (Texto Corrido)

| Elemento | Tamanho | Peso | Line-height | Letter-spacing | Uso |
|----------|---------|------|-------------|----------------|-----|
| **body1** | 1rem (16px) | 400 (Regular) | 1.5 | 0 | Texto principal |
| **body2** | 0.875rem (14px) | 400 (Regular) | 1.5 | 0 | Texto secundário |
| **subtitle1** | 1rem (16px) | 500 (Medium) | 1.5 | 0 | Subtítulos com destaque |
| **subtitle2** | 0.875rem (14px) | 500 (Medium) | 1.5 | 0 | Subtítulos menores |

### Utilitários

| Elemento | Tamanho | Peso | Line-height | Letter-spacing | Uso |
|----------|---------|------|-------------|----------------|-----|
| **button** | 0.875rem (14px) | 600 (Semibold) | 1.5 | 0 | Texto de botões |
| **caption** | 0.75rem (12px) | 400 (Regular) | 1.5 | 0.03em | Legendas, notas, rótulos |
| **overline** | 0.75rem (12px) | 600 (Semibold) | 1.5 | 0.08em | Etiquetas, rótulos com destaque |

## Exemplos de Uso

### Títulos

```jsx
// Título principal da página
<Typography variant="h1">Dashboard Financeiro</Typography>

// Subtítulo de seção
<Typography variant="h2">Relatório Mensal</Typography>

// Título de card ou painel
<Typography variant="h3">Transações Recentes</Typography>

// Subtítulo secundário
<Typography variant="h4">Filtros Avançados</Typography>
```

### Texto de Conteúdo

```jsx
// Texto principal para parágrafos
<Typography variant="body1">
  Este relatório apresenta uma análise completa das transações financeiras 
  realizadas no período selecionado, destacando tendências e áreas de atenção.
</Typography>

// Texto secundário (menor)
<Typography variant="body2">
  Os valores apresentados consideram impostos e taxas aplicáveis.
</Typography>

// Subtítulo com destaque
<Typography variant="subtitle1">Período de Análise</Typography>

// Título de grupo em uma lista
<Typography variant="subtitle2">Transações por Categoria</Typography>
```

### Elementos de Interface

```jsx
// Botão
<Button variant="contained">Confirmar Pagamento</Button>

// Legenda ou nota
<Typography variant="caption">
  * Valores sujeitos a alteração conforme a taxa de câmbio.
</Typography>

// Etiqueta destacada (todas em maiúsculas)
<Typography variant="overline">Novo Recurso</Typography>
```

## Componentes com Tipografia Padronizada

A configuração do tema garante que a tipografia seja aplicada consistentemente em todos os componentes:

### Tabelas

```jsx
<TableHead>
  <TableRow>
    <TableCell>Descrição</TableCell>
    <TableCell align="right">Valor</TableCell>
    <TableCell align="right">Data</TableCell>
  </TableRow>
</TableHead>
```

### Formulários

```jsx
<TextField 
  label="Nome do Cliente" 
  fullWidth 
  margin="normal"
/>
```

### Cards e Painéis

```jsx
<Card>
  <CardHeader title="Resumo Financeiro" />
  <CardContent>
    <Typography variant="body1">
      Conteúdo do card com a tipografia padronizada.
    </Typography>
  </CardContent>
</Card>
```

## Boas Práticas

1. **Consistência**: Use sempre as variantes tipográficas definidas no tema.
2. **Contraste**: Garanta contraste adequado entre texto e background (4.5:1 mínimo).
3. **Hierarquia**: Mantenha a hierarquia visual clara usando os tamanhos apropriados.
4. **Responsividade**: Em telas muito pequenas, considere reduzir h1 e h2 em 10-15%.
5. **Idiomas**: Teste o layout com idiomas que possuem palavras longas (como alemão).

## Referências

- [Site oficial da fonte Inter](https://rsms.me/inter/)
- [Inter no Google Fonts](https://fonts.google.com/specimen/Inter)
- [Material UI Typography](https://mui.com/material-ui/react-typography/)

## Implementação Técnica

A configuração da tipografia está definida no tema global da aplicação:

```typescript
// frontend/src/contexts/ThemeContext.tsx
typography: {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontWeight: 700,
    fontSize: '2.5rem',
    letterSpacing: '-0.015em',
    lineHeight: 1.2,
    marginBottom: '0.5em',
  },
  // ... demais configurações
}
``` 