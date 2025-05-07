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

## Módulos da Aplicação

### Cadastro de Itens (Inventário)

O módulo de Inventário permite o cadastro e gerenciamento de itens de estoque e necessidades semanais através de modais intuitivos.

#### Modal de Novo Item

![Modal Novo Item](../assets/images/modal-novo-item.png)

O modal de cadastro de novos itens permite registrar produtos no estoque com as seguintes informações:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| Nome | Texto | Nome do item (obrigatório) |
| Quantidade | Número | Quantidade disponível (obrigatório, > 0) |
| Unidade | Seleção | Unidade de medida (kg, g, unidade, caixa, ml, litro) |
| Categoria | Seleção | Categorização do item (bebidas, legumes, carnes, etc.) |
| Quantidade Mínima | Número | Limiar para alertas de estoque baixo |
| Preço Unitário | Número | Valor monetário por unidade (€) |
| Data de Validade | Data | Data de vencimento do produto |
| Localização | Texto | Local físico onde o item está armazenado |

#### Modal de Necessidade Semanal

![Modal Necessidade Semanal](../assets/images/modal-necessidade-semanal.png)

O modal de necessidades semanais registra itens que são regularmente necessários, com campos simplificados:

| Campo | Tipo | Descrição |
|-------|------|-----------|
| Nome | Texto | Nome do item (obrigatório) |
| Quantidade | Número | Quantidade necessária (obrigatório, > 0) |
| Unidade | Seleção | Unidade de medida (kg, g, unidade, caixa, ml, litro) |
| Preço Unitário | Número | Valor monetário por unidade (€) |
| Observação | Texto | Informações adicionais ou especificações |

#### Fluxo de Gravação

1. O usuário preenche os campos do formulário
2. Ao clicar em "Salvar", o sistema valida os dados (campos obrigatórios e restrições)
3. O item é adicionado ao contexto via função `adicionarItem()`
4. O item é armazenado no localStorage e fica disponível nas tabelas correspondentes
5. Um Snackbar de confirmação é exibido ao usuário

#### Exemplos de Payload

**Novo Item:**
```json
{
  "nome": "Tomate Cereja",
  "quantidade": 20,
  "unidade": "kg",
  "categoria": "legumes",
  "quantidadeMinima": 5,
  "precoUnitario": 3.50,
  "dataValidade": "2024-03-25",
  "localizacao": "Geladeira 2"
}
```

**Necessidade Semanal:**
```json
{
  "nome": "Farinha de Trigo",
  "quantidade": 10,
  "unidade": "kg",
  "categoria": "necessidade_semanal",
  "precoUnitario": 1.20,
  "observacao": "Preferência por marca XYZ"
}
```

Estes dados são emitidos por meio do `InventarioContext`, que gerencia o estado global do inventário e atualiza as métricas e listas automaticamente.

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
t('dashboardObj.title') // em vez de t('dashboard')
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

## Navegação

A navegação lateral (Sidebar) é um componente fundamental do Estrateo que fornece acesso às principais funcionalidades da aplicação.

### Estrutura do Menu

Para adicionar ou modificar itens de menu na barra lateral, edite o array `menuItems` no arquivo `Navigation.tsx`. Cada item deve seguir esta estrutura:

```tsx
const menuItems: MenuItem[] = [
  { 
    text: t('dashboardObj.title'),       // Texto exibido (usando i18n)
    icon: <DashboardIcon />,          // Ícone do Menu
    path: '/dashboard',               // Caminho da rota
    permission: null                  // Permissão necessária (null = público)
  },
  // Outros itens...
];
```

### Chaves de Tradução

Todas as chaves de tradução para a navegação devem estar presentes em todos os arquivos de idioma:

```json
// Exemplo de estrutura de chaves nos arquivos translation.json
{
  "dashboard": {
    "title": "Dashboard"
  },
  "financeiro": "Financeiro",
  "inventario": "Inventário",
  "impostos": "Impostos",
  "pagamentos": "Pagamentos", 
  "calendario": "Calendário",
  "funcionarios": "Funcionários",
  "inteligenciaArtificial": "IA & Análises",
  "whatsapp": "WhatsApp",
  "contador": "Contador"
}
```

### Permissões de Acesso

Cada item do menu pode requerer permissões específicas para ser exibido. As permissões são verificadas usando a função `hasPermission()` do contexto de autenticação:

```tsx
// Exemplo de permissões no array menuItems
{ 
  text: t('financeiro'), 
  icon: <FinanceiroIcon />, 
  path: '/dashboard/financeiro',
  permission: 'financeiro.visualizar'  // Usuário precisará desta permissão
}
```

No AuthContext.tsx, certifique-se de que o usuário tem as permissões necessárias:

```tsx
const demoUser = {
  // ...outras propriedades...
  permissoes: [
    'admin', 
    'financeiro.visualizar',
    'inventario.visualizar',
    'impostos.visualizar',
    'pagamentos.visualizar',
    'calendario.visualizar',
    'funcionarios.visualizar',
    'ia.visualizar'
  ]
};
```

### Submenu

Para adicionar submenus a um item de navegação, use a propriedade `subItems`:

```tsx
{ 
  text: t('funcionarios'), 
  icon: <PeopleIcon />, 
  path: '/dashboard/funcionarios',
  permission: 'funcionarios.visualizar',
  subItems: [
    {
      text: t('visaoGeral'),
      icon: <PersonIcon />,
      path: '/dashboard/funcionarios',
      permission: 'funcionarios.visualizar',
    },
    // outros subitens...
  ]
}
```

### Acessibilidade

Todos os itens de navegação devem:
- Ter contrast ratio adequado (4.5:1)
- Ter ícones acompanhados por texto
- Ser navegáveis por teclado (Tab)
- Ter focus visual claro

## Conclusão

Este Design System Premium foi criado para elevar a experiência visual do Estrateo, mantendo consistência, acessibilidade e facilidade de uso em toda a plataforma. Seguindo este guia, garantimos que novos desenvolvimentos mantenham o mesmo padrão de qualidade visual e experiência do usuário.

Para perguntas ou esclarecimentos, consulte a equipe de design.

## Dashboard Premium 2.0

O Dashboard foi completamente remodelado para seguir um padrão de design premium semelhante a produtos como Notion e Linear, focando em espaçamento, hierarquia e consistência visual.

### MetricCard Aprimorado

O componente `MetricCard` foi redesenhado para ter uma aparência mais moderna:

```tsx
const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon, 
  iconBg,
  color 
}) => {
  const theme = useTheme();
  
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      sx={{
        minHeight: 180,
        borderRadius: 2,
        boxShadow: theme.shadows[2],
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ 
        p: 3, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'space-between' 
      }}>
        <Typography 
          variant="h5" 
          component="h3" 
          color="text.secondary" 
          fontWeight={500}
          sx={{ pr: 5 }}
        >
          {title}
        </Typography>
        
        <Avatar
          sx={{
            position: 'absolute',
            top: 24,
            right: 24,
            bgcolor: iconBg || 'rgba(0, 0, 0, 0.04)',
            width: 42,
            height: 42
          }}
        >
          {React.cloneElement(icon as React.ReactElement, { 
            sx: { fontSize: 22, color } 
          })}
        </Avatar>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexGrow: 1 
        }}>
          <Typography 
            variant="h3" 
            component="div" 
            color="text.primary" 
            fontWeight="bold" 
            align="center"
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
```

### Grid Responsivo

O layout do dashboard agora usa um grid totalmente responsivo:

```tsx
{/* Grid de métricas */}
<Grid container spacing={4}>
  {metrics.map(metric => (
    <Grid item xs={12} md={6} lg={4} key={metric.id}>
      <MetricCard
        title={metric.title}
        value={metric.value}
        icon={metric.icon}
        iconBg={metric.iconBg}
        color={metric.color}
      />
    </Grid>
  ))}
</Grid>
```

### Barra de Topo Fixa

O botão "Gerar Relatório" agora aparece em uma barra de topo fixa que permanece visível durante a rolagem:

```tsx
{/* Header fixo com botão de gerar relatório */}
<Box
  sx={{
    position: 'sticky',
    top: 0,
    zIndex: 10,
    py: 2,
    px: 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.palette.background.default,
    backdropFilter: 'blur(8px)',
    borderBottom: `1px solid ${theme.palette.divider}`,
    mb: 4
  }}
>
  <Typography variant="h4" fontWeight="bold" color="text.primary">
    {t('dashboardObj.title')}
  </Typography>
  
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
  >
    <Button
      variant="contained"
      color="primary"
      startIcon={<PdfIcon />}
      onClick={handleGenerateReport}
      sx={{
        width: { xs: '100%', sm: 180 },
        height: 40,
        borderRadius: 2
      }}
    >
      {t('gerarRelatorio')}
    </Button>
  </motion.div>
</Box>
```

### Seção de Gráficos

Os gráficos agora são apresentados em cards elegantes com título interno:

```tsx
<Grid container spacing={4} sx={{ mt: 1 }}>
  <Grid item xs={12} md={6}>
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: theme.shadows[3],
        p: 3,
        height: '100%'
      }}
    >
      <Typography
        variant="h3"
        sx={{ mb: 3, fontWeight: 500 }}
      >
        {t('finance_charts_monthlyIncome')}
      </Typography>
      
      <Box
        sx={{ height: 300 }}
        aria-labelledby="receitas-despesas-chart-title"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            {/* Chart configuration */}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  </Grid>
  
  {/* Second chart */}
</Grid>
```

### Parcelamentos e Recebíveis

A nova seção de parcelamentos usa um layout flexível com cards interativos:

```tsx
<Card sx={{ borderRadius: 4, boxShadow: theme.shadows[3], p: 3, mt: 2 }}>
  <Stack 
    direction={{ xs: 'column', md: 'row' }} 
    spacing={4}
  >
    <Box component={motion.div} 
      whileHover={{ 
        boxShadow: theme.shadows[3], 
        translateY: prefersReducedMotion ? 0 : -2
      }}
      flex={1}
      sx={{ 
        p: 3, 
        borderRadius: 3, 
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: theme.shadows[1]
      }}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Recebíveis Futuros
      </Typography>
      
      {/* List of items */}
    </Box>
    
    {/* Second card */}
  </Stack>
</Card>
```

### Hierarquia Tipográfica e Espaçamento

O dashboard agora segue uma clara hierarquia tipográfica com espaçamento consistente:

```tsx
{/* Seção de título */}
<Typography variant="h2" sx={{ mt: 6, mb: 2, fontWeight: 600 }}>
  {t('graficos')}
</Typography>

{/* Título dentro de card */}
<Typography variant="h5" sx={{ mb: 2 }}>
  Recebíveis Futuros
</Typography>

{/* Espaçamento entre seções */}
<Box sx={{ mt: 6 }}>
  {/* Conteúdo da seção */}
</Box>
```

### Acessibilidade

Foram implementadas melhorias de acessibilidade:

1. Suporte a `prefers-reduced-motion` para usuários que preferem menos animações
2. Atributos `aria-labelledby` para gráficos
3. Foco visual claro em elementos interativos
4. Contraste adequado para todos os elementos de texto

### Responsividade

O dashboard é totalmente responsivo:
- Desktop (≥1280px): Grid de 3 colunas
- Tablet (768-1279px): Grid de 2 colunas
- Mobile (<768px): Grid de 1 coluna com espaçamento reduzido

### Antes e Depois

![Dashboard Antes](screenshots/dashboard_before.png)

![Dashboard Premium](screenshots/dashboard_final.png)

*Nota: Acrescente capturas de tela atualizadas do dashboard nas versões antes e depois.*

## Inventário Premium

A nova tela de Inventário foi redesenhada para oferecer uma experiência premium, focada na usabilidade e estética alinhada ao Design System.

### Principais melhorias

- **Layout Responsivo**: Adapta-se automaticamente para desktop, tablet e mobile
- **Métricas Rápidas**: Visualização imediata de valor total, itens críticos e próximos do vencimento
- **Filtros Inteligentes**: Busca em tempo real, filtro por categoria e toggle para itens críticos
- **Tabelas Premium**: Linhas zebradas, status visual por cores e menu de contexto 
- **Exportação**: Download de dados em CSV diretamente de cada tabela

### Design System v2 - Micro-ajustes

A versão 2.0 do Inventário inclui refinamentos visuais importantes:

#### 1. Scroll e Usabilidade
- Cards com altura máxima (380px) e scroll interno personalizado
- Barra de rolagem fina e estilizada para não interferir no layout
- Exportação CSV com notificação via Snackbar

#### 2. Chip "Mostrar críticos"
O componente de filtro rápido recebeu melhorias visuais e de acessibilidade:

```tsx
<Chip
  label={t('inventory.filters.showCritical')}
  icon={<AlertTriangle size={16} color={showCriticalOnly ? "white" : undefined} />}
  variant={showCriticalOnly ? "filled" : "outlined"}
  color="error"
  onClick={toggleCritical}
  aria-pressed={showCriticalOnly}
  sx={{ 
    cursor: 'pointer',
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: '2px'
    }
  }}
/>
```

#### 3. Responsividade Mobile
Em telas pequenas (<480px), os MetricCards agora aparecem em um scroll horizontal com snap:

![Visão Mobile do Inventário](screenshots/inventory_mobile.png)

#### 4. Acessibilidade
- Botões e ações com aria-label adequados
- Indicadores visuais de foco para navegação por teclado
- Suporte a prefers-reduced-motion para usuários que preferem animações reduzidas

### Componentes Detalhados

#### MetricCard
Os cards de métricas agora têm altura fixa (140px) e conteúdo centralizado verticalmente para melhor visualização.

#### Botões de Ação
Botões com altura padronizada (48px), ícones consistentes e efeitos de hover suaves.

#### DataGrid
Cabeçalhos com estilo personalizado (fundo cinza claro, texto em cor secundária) e células com foco aprimorado.

### Screenshots

![Inventário Desktop](screenshots/inventory_final.png)

### Tradução e Internacionalização

O módulo de Inventário está completamente traduzido para os seguintes idiomas:
- Português (Brasil)
- Inglês
- Alemão
- Italiano

Todas as strings são acessadas via namespace `inventory` e componentes comuns via `common`.

### Próximos Passos

- Implementação de gráficos de tendência
- Dashboard consolidado de métricas de estoque
- Exportação avançada (PDF, Excel)

### Dúvidas Frequentes

1. **Como adicionar um novo idioma?**
   Adicione um novo arquivo na pasta `locales` seguindo a estrutura do namespace `inventory`.

2. **Como personalizar o tema dos cards?**
   Utilize o objeto `sx` para sobreescrever estilos e adequar ao tema da empresa.

## Conclusão

Este Design System Premium foi criado para elevar a experiência visual do Estrateo, mantendo consistência, acessibilidade e facilidade de uso em toda a plataforma. Seguindo este guia, garantimos que novos desenvolvimentos mantenham o mesmo padrão de qualidade visual e experiência do usuário.

Para perguntas ou esclarecimentos, consulte a equipe de design.

## Impostos – Forecast automático

### Visão Geral

O módulo TaxEngine fornece uma previsão automática dos principais impostos aplicáveis a empresas na Alemanha. O sistema calcula estimativas para:

1. **Umsatzsteuer (VAT)** - Imposto sobre valor agregado, equivalente ao IVA europeu, com alíquota padrão de 19%
2. **Gewerbesteuer (Trade Tax)** - Imposto comercial aplicado sobre o lucro empresarial, com multiplicador variável por município
3. **Körperschaftsteuer (Corporate Tax)** - Imposto sobre o lucro de pessoas jurídicas, com alíquota base de 15% + taxa de solidariedade
4. **Lohnsteuer (Payroll Tax)** - Impostos e contribuições sobre a folha de pagamento

### API de Previsão Fiscal

O endpoint `/api/taxes/forecast` retorna previsões fiscais para o mês especificado:

```json
// GET /api/taxes/forecast?mes=2023-05
{
  "mes": "2023-05",
  "vatPayable": 1900.00,
  "tradeTax": 350.00,
  "corpTax": 1582.50,
  "payrollTax": 2000.00
}
```

### Cálculo Fiscal

A previsão é calculada automaticamente com base em:

- Receitas e despesas registradas no mês (para VAT, Trade Tax e Corporate Tax)
- Folha de pagamento do mês (para Payroll Tax)

O sistema aplica as alíquotas configuradas em `taxConfig.ts`, que definem os parâmetros fiscais alemães (taxas, multiplicadores, etc.).

### Job Automático

A previsão é atualizada diariamente por um job agendado (usando node-cron) que recalcula os valores para todas as empresas cadastradas.

### Documentação Técnica

Para mais detalhes sobre o mecanismo de cálculo, consulte:

- [TaxEngine Service](../backend/src/services/TaxEngine.ts) - Implementação do motor de cálculo
- [Tax Forecast Job](../backend/src/jobs/taxForecastJob.ts) - Job automático de atualização 