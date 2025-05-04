# Estrateo Design System Premium

Este guia documenta o sistema de design premium usado no Estrateo, fornecendo diretrizes para manter consistência visual e de experiência em toda a aplicação.

## Índice

- [Paleta de Cores](#paleta-de-cores)
- [Tipografia](#tipografia)
- [Espaçamento](#espaçamento)
- [Componentes](#componentes)
- [Responsividade](#responsividade)
- [Acessibilidade](#acessibilidade)
- [Como Implementar](#como-implementar)

## Paleta de Cores

Nossa paleta foi cuidadosamente selecionada para transmitir profissionalismo, confiança e clareza.

### Cores Primárias

| Cor | Hex | Uso Recomendado |
|-----|-----|-----------------|
| ![Primary](https://via.placeholder.com/15/0A2540/000000?text=+) Primary | `#0A2540` | Elementos principais, cabeçalhos, botões primários |
| ![Secondary](https://via.placeholder.com/15/000000/000000?text=+) Secondary | `#000000` | Texto importante, botões secundários |

### Cores de Estado

| Cor | Hex | Uso Recomendado |
|-----|-----|-----------------|
| ![Success](https://via.placeholder.com/15/00B37E/000000?text=+) Success | `#00B37E` | Confirmações, ações positivas |
| ![Error](https://via.placeholder.com/15/F75A68/000000?text=+) Error | `#F75A68` | Erros, alertas críticos |

### Tons de Cinza

| Cor | Hex | Uso Recomendado |
|-----|-----|-----------------|
| ![Grey 100](https://via.placeholder.com/15/F5F5F5/000000?text=+) Grey 100 | `#F5F5F5` | Backgrounds alternativos, áreas de destaque suave |
| ![Grey 500](https://via.placeholder.com/15/9E9E9E/000000?text=+) Grey 500 | `#9E9E9E` | Textos secundários, bordas, separadores |

## Tipografia

Usamos a fonte **Inter** como fonte principal, com Roboto como fallback para garantir consistência em todos os dispositivos.

### Hierarquia Tipográfica

| Estilo | Tamanho/Altura | Peso | Uso Recomendado |
|--------|----------------|------|-----------------|
| H1     | 48/56px        | 600  | Títulos principais de página |
| H2     | 32/40px        | 600  | Títulos de seção |
| H3     | 24/32px        | 600  | Subtítulos |
| Body1  | 16/24px        | 400  | Texto principal, parágrafos |
| Body2  | 14/20px        | 400  | Texto secundário, legendas |
| Caption| 12/16px        | 400  | Informações auxiliares, notas |

### Exemplo

```tsx
<Typography variant="h1">Título Principal (48px)</Typography>
<Typography variant="h2">Título de Seção (32px)</Typography>
<Typography variant="h3">Subtítulo (24px)</Typography>
<Typography variant="body1">Texto principal para conteúdo.</Typography>
<Typography variant="body2">Texto secundário menor.</Typography>
<Typography variant="caption">Texto para notas e legendas.</Typography>
```

## Espaçamento

Nosso sistema de espaçamento é baseado em uma escala de 4px para manter consistência e alinhamento.

| Token | Valor | Uso Recomendado |
|-------|-------|-----------------|
| 1     | 4px   | Espaçamento mínimo, margens pequenas |
| 2     | 8px   | Espaçamento entre itens relacionados |
| 4     | 16px  | Espaçamento padrão entre elementos |
| 6     | 24px  | Espaçamento entre seções, padding de cards |
| 8     | 32px  | Espaçamento entre blocos maiores |

### Uso no MUI

```tsx
// Usando o tema
<Box sx={{ mt: 4, p: 6 }}>
  {/* 4 = 16px de margin-top, 6 = 24px de padding */}
</Box>
```

### Uso com CSS Variables

```css
.my-element {
  margin-top: var(--spacing-4);
  padding: var(--spacing-6);
}
```

## Componentes

### Cartões (Cards)

Cards são usados para agrupar informações relacionadas. Características:
- Borda arredondada: 16px
- Sombra: 0 4px 6px rgba(0,0,0,0.1)
- Padding interno: 24px

### Botões (Buttons)

Os botões seguem uma hierarquia visual clara:
- **Primary (Contido)**: Fundo azul (#0A2540), texto branco
- **Secondary (Contido)**: Fundo preto, texto branco
- **Outlined**: Borda da cor primária, sem fundo
- **Text**: Apenas texto da cor primária

Todos os botões têm:
- Borda arredondada: 8px
- Sem transformação de texto (mantém maiúsculas/minúsculas)
- Peso da fonte: 600 (semibold)

### Campos de Texto (TextField)

- Borda arredondada: 8px
- Labels flutuantes
- Cor do label: cinza.600
- Cor de foco: primary.main

### Tabelas (Tables)

- Cabeçalho fixo com fundo primary.main (#0A2540) e texto branco
- Bordas arredondadas: 8px
- Espaçamento interno de célula: 16px

## Responsividade

O sistema de design é totalmente responsivo, adaptando-se a diferentes tamanhos de tela:

| Breakpoint | Largura | Grid | Uso |
|------------|---------|------|-----|
| xs         | < 768px | 1 coluna | Dispositivos móveis |
| md         | ≥ 768px | 2 colunas | Tablets |
| lg         | ≥ 1280px | 3 colunas | Desktop |

### Uso no Código

```tsx
<Box
  sx={{
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      md: 'repeat(2, 1fr)',
      lg: 'repeat(3, 1fr)'
    },
    gap: 3
  }}
>
  {/* Conteúdo responsivo */}
</Box>
```

## Acessibilidade

Nosso design system segue as diretrizes WCAG para garantir acessibilidade:

- **Contraste**: Todas as combinações texto/fundo atendem à relação de contraste mínima de 4.5:1
- **Navegação por teclado**: Todos os componentes interativos são acessíveis via teclado
- **Reduced Motion**: Animações respeitam a preferência `prefers-reduced-motion`
- **Textos alternativos**: Imagens e ícones possuem textos alternativos adequados

## Como Implementar

### Usando Componentes Prontos

```tsx
import { Button, TextField, Card } from '@mui/material';
import MotionButton from '../components/common/MotionButton';

// Botão com animação
<MotionButton variant="contained" color="primary">
  Salvar Alterações
</MotionButton>

// TextField estilizado
<TextField 
  label="Nome Completo" 
  fullWidth 
/>

// Card no padrão do sistema
<Card>
  <CardContent>
    <Typography variant="h3">Título do Card</Typography>
    <Typography variant="body1">Conteúdo do card...</Typography>
  </CardContent>
</Card>
```

### Criando Novos Componentes

Ao criar novos componentes, siga estas diretrizes:

1. **Use o tema**: Acesse cores, espaçamentos e tipografia via `useTheme()`
2. **Evite valores fixos**: Use tokens do tema como `theme.spacing(4)` ou `theme.palette.primary.main`
3. **Considere acessibilidade**: Adicione atributos `aria-*` adequados
4. **Siga convenções de código**: Mantenha estrutura e nomenclatura consistentes

### Exemplo de Novo Componente

```tsx
import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const NovoBadge = ({ label, variant = 'default' }) => {
  const theme = useTheme();
  
  const getColor = () => {
    switch (variant) {
      case 'success': return theme.palette.success.main;
      case 'error': return theme.palette.error.main;
      default: return theme.palette.primary.main;
    }
  };
  
  return (
    <Box
      sx={{
        borderRadius: 1,
        px: 2,
        py: 0.5,
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: alpha(getColor(), 0.1),
        border: `1px solid ${getColor()}`,
      }}
    >
      <Typography
        variant="caption"
        sx={{ color: getColor(), fontWeight: 600 }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default NovoBadge;
```

---

## Dashboard Premium

O Dashboard é a principal área de visualização de dados do Estrateo e aplica todos os princípios do Design System Premium para criar uma experiência visual consistente e de alta qualidade.

### Layout e Grid

O Dashboard utiliza um sistema de grid responsivo com o componente `ResponsiveGrid` que se adapta automaticamente a diferentes tamanhos de tela:

- **Desktop (≥1280px)**: Grid de 3 colunas - layout 3+2+1 para 6 métricas
- **Tablet (768-1279px)**: Grid de 2 colunas - layout 2+2+2 para 6 métricas
- **Mobile (<768px)**: Grid de 1 coluna

```tsx
// Implementação usando o componente ResponsiveGrid com espaçamento correto
<ResponsiveGrid spacing={4}>
  <MetricCard title="Saldo Atual" value="€25.430,00" icon={<AttachMoneyIcon />} />
  <MetricCard title="Receita Hoje" value="€1.250,00" icon={<TrendingUpIcon />} />
  <MetricCard title="Despesas Hoje" value="€680,00" icon={<TrendingDownIcon />} />
  <MetricCard title="Itens em Estoque" value="342" icon={<InventoryIcon />} />
  <MetricCard title="Usuários Ativos" value="28" icon={<PersonIcon />} />
  <MetricCard title="Funcionários em Férias" value="3" icon={<BeachAccessIcon />} />
</ResponsiveGrid>
```

### Cards de Métricas

Os cards de métricas seguem um padrão visual consistente:

- Título h3 (24px semibold) na cor text.secondary, alinhado à esquerda
- Valor principal h1 (48px bold) na cor text.primary, centralizado
- Ícones de 36px com 60% de opacidade, alinhados à direita
- Texto secundário centralizado e em tamanho menor (body2)
- Altura mínima consistente para todos os cards
- Animação de fade-in usando framer-motion

```tsx
// Componente MetricCard atualizado com posicionamento correto
const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  color = 'primary.main', 
  loading = false, 
  secondary = '',
  minHeight = 160
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeIn}
  >
    <Card sx={{ minHeight }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
          <Typography variant="h3" color="text.secondary">
            {title}
          </Typography>
          <Box sx={{ 
            color, 
            opacity: 0.6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 36 } })}
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress size={32} color="primary" />
          </Box>
        ) : (
          <>
            <Typography variant="h1" fontWeight="bold" color="text.primary" align="center">
              {value}
            </Typography>
            
            {secondary && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} align="center">
                {secondary}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  </motion.div>
);
```

### Gráficos

Os gráficos foram atualizados para usar as cores do Design System Premium:

- Cores primárias do tema para série principal
- Cores de success/error para valores positivos/negativos
- Tooltip com bordas arredondadas (8px) e sombra do tema
- Fundo transparente sem bordas duras

```tsx
// Exemplo de gráfico de barras com estilo premium
<BarChart data={chartData}>
  <CartesianGrid 
    strokeDasharray="3 3" 
    stroke="rgba(0,0,0,0.05)" 
  />
  <XAxis
    dataKey="date"
    axisLine={false}
    tickLine={false}
  />
  <YAxis
    axisLine={false}
    tickLine={false}
    tickFormatter={(value) => `${value}€`}
  />
  <ChartTooltip
    contentStyle={{
      backgroundColor: theme.palette.background.paper,
      borderRadius: 8,
      boxShadow: theme.shadows[3],
      border: 'none'
    }}
    formatter={(value) => [`${value}€`, '']}
  />
  <Legend />
  <Bar
    name={t('receitas')}
    dataKey="income"
    fill={theme.palette.primary.main}
    radius={[4, 4, 0, 0]}
  />
  <Bar
    name={t('despesas')}
    dataKey="expenses"
    fill={theme.palette.error.main}
    radius={[4, 4, 0, 0]}
  />
</BarChart>
```

### Tabelas e Listas

As tabelas e listas no Dashboard seguem o padrão de design premium:

- Cabeçalho sticky com fundo primary.main e texto branco
- Linhas zebradas usando theme.palette.grey[50] e [100] para contraste adequado
- Hover em cinza muito claro (grey.50)

```tsx
// Exemplo de lista com linhas zebradas
<List>
  {items.map((item, index) => (
    <ListItem
      key={item.id}
      sx={{
        borderBottom: index < items.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
        py: 1.5,
        bgcolor: index % 2 === 1 ? theme.palette.grey[50] : 'transparent',
        '&:hover': {
          bgcolor: theme.palette.grey[100]
        }
      }}
    >
      <ListItemText primary={item.name} secondary={item.description} />
    </ListItem>
  ))}
</List>
```

### Estados de Loading e Vazio

Para melhorar a experiência do usuário, foram implementados estados de loading e placeholder:

- Loading: CircularProgress discreto (32px) na cor primary
- Estado vazio: Componente EmptyState com SVG e mensagem personalizada

```tsx
// Componente EmptyState para quando não há dados
const EmptyState: React.FC<{ message?: string }> = ({ message = t('semDadosNoPeriodo') }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}
  >
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60 10C32.4 10 10 32.4 10 60C10 87.6 32.4 110 60 110C87.6 110 110 87.6 110 60C110 32.4 87.6 10 60 10ZM65 85H55V75H65V85ZM65 65H55V35H65V65Z"
        fill="#CDD0D4"
      />
    </svg>
    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
      {message}
    </Typography>
  </Box>
);

// Uso em um componente
{chartData.length > 0 ? (
  <Box sx={{ height: 300, mt: 3 }}>
    <ResponsiveContainer width="100%" height="100%">
      {/* Chart content */}
    </ResponsiveContainer>
  </Box>
) : (
  <EmptyState />
)}
```

### Botões e Interações

O botão "Gerar Relatório" e outras interações seguem o padrão premium:

- MotionButton com margens adequadas (mt: 2, mr: 2)
- Animação sutil de escala (0.98 → 1) no hover
- Ícone integrado com o botão

```tsx
<Box sx={{ mt: 2, mr: 2 }}>
  <MotionButton
    variant="contained"
    color="primary"
    startIcon={<PdfIcon />}
    onClick={handleGenerateReport}
  >
    {t('gerarRelatorio')}
  </MotionButton>
</Box>
```

### Tradução e Internacionalização

Para evitar erros de tradução, as chaves i18n devem ser estruturadas hierarquicamente:

```json
// Estrutura correta no arquivo de tradução
{
  "dashboard": {
    "title": "Dashboard",
    "resumo": "Resumo Financeiro"
  }
}

// Uso correto no código
t('dashboard.title') // em vez de t('dashboard')
```

### Antes e Depois

#### Antes
![Dashboard Antes](https://via.placeholder.com/800x400/cccccc/666666?text=Dashboard+Anterior)

#### Depois
![Dashboard Depois](https://via.placeholder.com/800x400/f5f5f5/333333?text=Dashboard+Premium)

*Nota: Substitua estas imagens por capturas de tela reais do seu sistema*

---

## Dashboard v2

O Dashboard foi modernizado seguindo os princípios do Design System Premium para criar uma experiência visual mais refinada e coesa.

### Antes/Depois

![Dashboard Antes](screenshots/dashboard_v2.png)

![Dashboard Depois](screenshots/dashboard_v2_premium.png)

### MetricCard Component

Foi criado um componente reutilizável para exibir métricas no Dashboard com uma aparência mais premium:

```tsx
import { Card, Typography, Avatar, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg?: string;
}

export default function MetricCard({ title, value, icon, iconBg = '#E6EBF1' }: Props) {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .4 }}
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        minHeight: 160,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Typography variant="h3" color="text.secondary">{title}</Typography>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h1">{value}</Typography>
        <Avatar 
          sx={{ bgcolor: iconBg, width: 48, height: 48 }}
          aria-label={`${title} icon`}
        >
          {icon}
        </Avatar>
      </Box>
    </Card>
  );
}
```

### Layout Responsivo com Masonry

O Dashboard utiliza agora um layout Masonry que se adapta melhor a diferentes tamanhos de tela:

```tsx
<Masonry columns={{ xs: 1, md: 2, lg: 3 }} spacing={4}>
  {metrics.map(m => (
    <MetricCard 
      key={m.id} 
      title={m.title} 
      value={m.value} 
      icon={m.icon} 
      iconBg={m.iconBg} 
    />
  ))}
</Masonry>
```

### Melhorias de Acessibilidade

- Adição de `aria-label` em todos os ícones
- Contraste de cores verificado para estar em conformidade com WCAG (≥ 4.5:1)
- Ordem de tabulação lógica: menu → filtros → cards → gráficos
- Tamanhos de fonte adequados para facilitar a leitura

### Estados Vazios (Empty States)

Criamos um componente EmptyState para mostrar uma visualização elegante quando não há dados:

```tsx
<EmptyState message="Nenhum dado para o período selecionado" />
```

### Tooltips Aprimoradas

Tooltips dos gráficos financeiros receberam estilos premium:

```tsx
<ChartTooltip
  contentStyle={{
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
    boxShadow: theme.shadows[3],
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.text.primary,
    padding: 16
  }}
  formatter={(value) => [formatCurrency(Number(value)), '']}
  labelStyle={{ 
    color: theme.palette.text.secondary, 
    fontWeight: 500 
  }}
/>
```

## Conclusão

Este Design System Premium foi criado para elevar a experiência visual do Estrateo, mantendo consistência, acessibilidade e facilidade de uso em toda a plataforma. Seguindo este guia, garantimos que novos desenvolvimentos mantenham o mesmo padrão de qualidade visual e experiência do usuário.

Para perguntas ou esclarecimentos, consulte a equipe de design. 