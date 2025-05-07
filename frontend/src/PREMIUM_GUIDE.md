# Guia de Design Premium Estrateo

Este documento descreve o sistema de design premium implementado no Estrateo, seguindo os padrões de design europeu de alta qualidade.

## 🎨 Paleta de Cores

### Cores Primárias
- **Azul Escuro** (#0A2540) - Cor primária da marca
- **Preto** (#000000) - Cor secundária
- **Branco** (#FFFFFF) - Cor de fundo principal
- **Cinza Claro** (#F5F5F5) - Cor neutra para elementos sutis

### Cores de Status
- **Verde Sutil** (#00B37E) - Sucesso, confirmação, positivo
- **Vermelho Discreto** (#F75A68) - Erro, alerta, negativo

### Variações
Cada cor principal possui variações light/dark para diferentes usos:
- **primary.light** (#1A3550)
- **primary.dark** (#041830)

## 📝 Tipografia

O sistema utiliza a fonte **Inter** como fonte principal, com fallbacks para Roboto, Helvetica e Arial.

### Hierarquia Tipográfica
- **H1**: 48px, bold - Títulos principais 
- **H2**: 32px, semibold - Subtítulos importantes
- **H3**: 24px, semibold - Títulos de seção
- **H4**: 20px, semibold - Subtítulos de seção
- **H5**: 18px, semibold - Títulos de card
- **H6**: 16px, semibold - Subtítulos de card
- **Body1**: 16px, regular - Texto principal
- **Body2**: 14px, regular - Texto secundário
- **Caption**: 12px, regular - Texto de legenda

## 📐 Espaçamento

O sistema de espaçamento é baseado em unidades de 8px:
- **Extra pequeno**: 8px
- **Pequeno**: 16px
- **Médio**: 24px
- **Grande**: 32px
- **Extra grande**: 40px

## 🧩 Componentes

### Cards (PremiumCard)
- Bordas arredondadas (16px)
- Sombra sutil (0 4px 6px rgba(0,0,0,0.1))
- Espaçamento interno de 24px
- Efeito de hover com elevação suave
- Variantes: default, outlined, contained

### Botões (ButtonWithAnimation)
- Bordas arredondadas (8px)
- Efeito de escala no hover (1.05)
- Efeito sutil de sombra no hover
- Transição suave de 0.2s

### Inputs/Formulários
- Labels flutuantes
- Bordas finas (1px)
- Bordas arredondadas (8px)
- Feedback visual para estados de erro/sucesso

## ✨ Animações

O sistema inclui várias animações sutis que respeitam a preferência do usuário por movimento reduzido:

### FadeIn
- Animação para entrada suave de elementos
- Suporte para diferentes direções (up, down, left, right)
- Configurável com delay e duração

### PageTransition
- Transição suave entre páginas
- Fade com leve deslocamento vertical
- Respeitando preferências de redução de movimento

### ButtonWithAnimation
- Efeito de escala e elevação no hover
- Feedback tátil em cliques

## 📱 Responsividade

O sistema utiliza breakpoints do Material UI:
- **xs**: 0px (mobile)
- **sm**: 600px (tablet)
- **md**: 960px (desktop pequeno)
- **lg**: 1280px (desktop médio)
- **xl**: 1920px (desktop grande)

## 🌓 Modo Escuro

O tema suporta alternância entre modo claro e escuro, com paletas específicas para cada modo:
- Modo claro: fundo branco, texto escuro
- Modo escuro: fundo escuro (#121212), texto claro

## 📋 Como usar os componentes

### PremiumCard
```jsx
<PremiumCard 
  title="Título do Card" 
  subheader="Subtítulo opcional"
  elevation={1}
  cardVariant="default" // ou "outlined" ou "contained"
  hoverEffect={true}
>
  Conteúdo do card
</PremiumCard>
```

### ButtonWithAnimation
```jsx
<ButtonWithAnimation 
  variant="contained" 
  color="primary"
>
  Botão com animação
</ButtonWithAnimation>
```

### FadeIn
```jsx
<FadeIn delay={0.2} duration={0.5} direction="up">
  <Typography>Conteúdo com fade in</Typography>
</FadeIn>
```

### PageTransition
```jsx
<PageTransition>
  <div>Conteúdo da página</div>
</PageTransition>
```

## 📊 Impostos – Visão Geral

A página de Impostos foi projetada para oferecer uma experiência visual premium e consistente com o restante da aplicação, apresentando cards de impostos informativos e dinamicamente atualizados.

### CardImposto
O componente `CardImposto` foi criado para exibir informações fiscais de forma clara e elegante:

```jsx
<CardImposto
  tipo="Umsatzsteuer"           // Nome/título do imposto
  valor={1234.56}               // Valor numérico do imposto
  icone={<EuroIcon />}          // Ícone representativo
  cor="primary"                 // Esquema de cores (primary, neutral, success, warning, error)
  legenda="Descrição detalhada" // Texto de tooltip opcional
/>
```

### Características Visuais
- **Cards Premium**: Bordas arredondadas, sombra sutil, cores temáticas por tipo de imposto
- **Animação Fade-In**: Transição suave ao carregar os cards (usando framer-motion)
- **Responsividade**: Layout se adapta a dispositivos móveis, tablets e desktop
- **Esquemas de Cor**: 
  - Umsatzsteuer (IVA) - Primary (Azul)
  - Gewerbesteuer (Imposto Comercial) - Neutral (Cinza)
  - Körperschaftsteuer (Imposto Corporativo) - Success (Verde)
  - Lohnsteuer (Folha de Pagamento) - Warning (Laranja)

### Tratamento de Estados
- **Carregamento**: Exibe Skeleton ao carregar dados
- **Erro de Rede**: Snackbar temporário com botão para tentar novamente
- **Valores Zerados**: Exibe formato "€ 0,00" em vez de traço
- **Valores Ausentes**: Exibe "Sem dados" (traduzido via i18n)
- **Seleção de Mês**: DatePicker para selecionar o período fiscal

### Layout do Grid
- Cards dispostos em grid de 4 colunas em desktop (xl, lg)
- 2 colunas em tablets (md, sm)
- 1 coluna empilhada em dispositivos móveis (xs)
- Espaçamento uniforme de 24px entre cards

### Internacionalização
A página suporta múltiplos idiomas através do sistema i18n:
- Nome dos impostos
- Mensagens de status
- Formatação de valores monetários (€)
- Textos de UI como "Sem dados", "Erro de conexão", etc.

### Boas Práticas Implementadas
- **Microinterações**: Hover nos cards com elevação sutil
- **Feedback Visual**: Estados claros de carregamento e erro
- **Acessibilidade**: Tooltips informativos, contraste adequado
- **Consistência**: Alinhamento com demais elementos da interface
- **Gerenciamento de Erros**: Tratamento elegante de falhas de rede

## 🚀 Boas Práticas

1. **Consistência**: Use sempre os componentes e tokens definidos neste guia
2. **Acessibilidade**: Garanta contraste adequado entre cores
3. **Responsividade**: Teste todos os componentes em diferentes tamanhos de tela
4. **Performance**: Evite animações pesadas que podem prejudicar a experiência
5. **Manutenção**: Atualize este guia quando novos componentes forem criados 