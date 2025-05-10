# Guia de Animações - Estrateo

## Visão Geral

Este documento descreve as diretrizes e componentes de animação utilizados no sistema Estrateo. As animações foram implementadas com o Framer Motion para criar uma experiência de usuário mais fluida e sofisticada.

## Princípios de Animação

- **Suavidade**: Todas as animações têm transições suaves
- **Minimalismo**: Animações são sutis e não distraem o usuário
- **Consistência**: Padrões consistentes em toda a aplicação
- **Performance**: Otimizadas para dispositivos móveis e desktops
- **Acessibilidade**: Respeitam as preferências do usuário de redução de movimento

## Componentes Animados

### AnimatedCard

Card com animação de fade-in ao aparecer na tela e transições suaves.

```tsx
import { AnimatedCard } from '../components/animations';

// Uso básico
<AnimatedCard>
  {/* Conteúdo do card */}
</AnimatedCard>

// Com índice para animação sequencial
<AnimatedCard index={2}>
  {/* Aparecerá após uma pequena pausa */}
</AnimatedCard>

// Card clicável
<AnimatedCard clickable onClick={handleClick}>
  {/* Card clicável com efeito hover */}
</AnimatedCard>
```

### AnimatedButton

Botão com efeitos de escala ao passar o mouse e ao clicar.

```tsx
import { AnimatedButton } from '../components/animations';

// Uso básico
<AnimatedButton variant="contained" color="primary">
  Botão Animado
</AnimatedButton>

// Customizando a escala
<AnimatedButton 
  scaleOnHover={1.08} 
  scaleOnTap={0.92}
  variant="outlined"
>
  Botão com Escala Personalizada
</AnimatedButton>
```

### AnimatedModal

Modal com transições suaves de entrada e saída.

```tsx
import { AnimatedModal } from '../components/animations';

// Uso básico com slide-up
<AnimatedModal open={isOpen} onClose={handleClose}>
  {/* Conteúdo do modal */}
</AnimatedModal>

// Com animação de zoom
<AnimatedModal 
  open={isOpen} 
  onClose={handleClose}
  animation="zoom"
>
  {/* Conteúdo do modal */}
</AnimatedModal>
```

### AnimatedList

Lista com animação sequencial de itens (stagger animation).

```tsx
import { AnimatedList } from '../components/animations';

// Uso básico
<AnimatedList>
  <ListItem>Item 1</ListItem>
  <ListItem>Item 2</ListItem>
  <ListItem>Item 3</ListItem>
</AnimatedList>

// Personalizando os tempos de delay
<AnimatedList 
  staggerDuration={0.15} 
  itemDelay={0.3}
  animation="slide-left"
>
  {/* Itens da lista */}
</AnimatedList>
```

### PageTransition

Aplica transições ao navegar entre páginas ou views.

```tsx
import { PageTransition } from '../components/animations';

// Uso básico
<PageTransition>
  {/* Conteúdo da página */}
</PageTransition>

// Com animação personalizada
<PageTransition animation="slide-left">
  {/* Conteúdo da página */}
</PageTransition>
```

### MotionContainer

Container de motion para animações personalizadas.

```tsx
import { MotionContainer } from '../components/animations';

// Uso básico
<MotionContainer animation="fade">
  {/* Conteúdo a ser animado */}
</MotionContainer>

// Com duração e delay personalizados
<MotionContainer 
  animation="slide-up" 
  duration={0.5}
  delay={0.2}
>
  {/* Conteúdo a ser animado */}
</MotionContainer>
```

## Tipos de Animação Disponíveis

Todos os componentes animados suportam os seguintes tipos de animação:

- `fade`: Fade in/out simples
- `slide-up`: Desliza para cima ao aparecer
- `slide-down`: Desliza para baixo ao aparecer
- `slide-left`: Desliza da direita para a esquerda
- `slide-right`: Desliza da esquerda para a direita
- `zoom`: Efeito de zoom ao aparecer/desaparecer

## Considerações de Performance

- **Throttling e Debouncing**: Implementados para evitar sobrecarga
- **Hardware Acceleration**: Animações usam propriedades otimizadas (transform, opacity)
- **Lazy Loading**: Animações são carregadas apenas quando necessárias
- **Batching**: Múltiplas animações são agrupadas para melhor performance

## Acessibilidade

Para respeitar preferências de redução de movimento, adicione este código ao seu componente:

```tsx
// Hook para detectar preferência de redução de movimento
const prefersReducedMotion = usePrefersReducedMotion();

// Use em componentes animados
<AnimatedCard animate={!prefersReducedMotion}>
  {/* Conteúdo do card */}
</AnimatedCard>
```

## Próximos Passos

- Implementar animações específicas para o módulo financeiro
- Adicionar feedback haptico em dispositivos móveis
- Criar transições para gráficos e visualizações de dados 