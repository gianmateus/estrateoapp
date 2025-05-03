# Guia de Cores - Estrateo

Este documento apresenta a identidade visual de cores padronizada do Estrateo, estabelecendo diretrizes claras para aplicação consistente em todos os componentes e módulos do sistema.

## Paleta Oficial

### Cores Principais

| Cor | Código Hexadecimal | Uso |
|-----|-------------------|-----|
| **Azul Escuro** | `#0A2540` | Cor primária do sistema. Usada em elementos de destaque, botões principais, links e elementos interativos. |
| **Preto** | `#000000` | Cor secundária. Usada para texto principal no modo claro e elementos secundários. |
| **Branco** | `#FFFFFF` | Usada como background principal no modo claro e para texto no modo escuro. |

### Cores Auxiliares

| Cor | Código Hexadecimal | Uso |
|-----|-------------------|-----|
| **Cinza Claro** | `#F5F5F7` | Background de cards e elementos secundários no modo claro. |
| **Cinza Médio** | `#86868B` | Textos secundários, bordas e elementos com menor destaque. |
| **Cinza Escuro** | `#1D1D1F` | Textos com destaque no modo escuro, borders com mais contraste. |
| **Cinza Muito Escuro** | `#121212` | Background de cards e painéis no modo escuro. |

## Aplicação no Sistema

### Modo Claro

- **Background principal**: Branco (`#FFFFFF`)
- **Background de cards**: Cinza Claro (`#F5F5F7`)
- **Texto principal**: Preto (`#000000`)
- **Texto secundário**: Cinza Médio (`#86868B`)
- **Elementos de destaque**: Azul Escuro (`#0A2540`)
- **Botões principais**: Azul Escuro com texto branco
- **Botões secundários**: Preto com texto branco
- **Bordas e separadores**: Tons de cinza claro

### Modo Escuro

- **Background principal**: Preto (`#000000`)
- **Background de cards**: Cinza Muito Escuro (`#121212`)
- **Texto principal**: Branco (`#FFFFFF`)
- **Texto secundário**: Cinza claro
- **Elementos de destaque**: Azul Escuro (`#0A2540`)
- **Botões principais**: Azul Escuro com texto branco
- **Botões secundários**: Branco com texto preto
- **Bordas e separadores**: Tons de cinza escuro

## Diretrizes de Aplicação

### Hierarquia e Ênfase

1. **Elementos principais de interação**: Utilize a cor primária (Azul Escuro) para botões de ação principal, links e elementos que precisam de destaque.

2. **Elementos secundários**: Utilize a cor secundária (Preto/Branco, dependendo do modo) para botões menos importantes ou ações alternativas.

3. **Elementos de informação**: Use as cores auxiliares para textos informativos, rótulos ou elementos de menor relevância na hierarquia.

### Componentes Específicos

#### Botões

- **Primário**: Azul Escuro (`#0A2540`) com texto branco
- **Secundário**: Preto/Branco (conforme o modo) com texto contrastante
- **Outline**: Contorno na cor primária com texto da mesma cor
- **Texto**: Azul Escuro para o texto, sem background

#### Cards e Painéis

- **Background**: Branco no modo claro, Cinza Muito Escuro no modo escuro
- **Títulos**: Texto preto/branco conforme o modo
- **Conteúdo**: Texto em Cinza Médio para informações secundárias
- **Bordas**: Tons suaves de cinza para criar separação visual

#### Tabelas

- **Cabeçalho**: Cinza Claro no modo claro, Cinza Muito Escuro no modo escuro
- **Linhas**: Alternância sutil para melhorar a legibilidade
- **Células de destaque**: Utilizar a cor primária com moderação

#### Gráficos e Visualizações

- **Elementos principais**: Azul Escuro
- **Elementos secundários**: Preto/Cinzas
- **Background**: Branco/Preto conforme o modo
- **Destaques**: Usar cores de alerta apenas para informações críticas

### Acessibilidade

Todas as combinações de cores foram projetadas para atender ou exceder os padrões WCAG 2.1:

- **Texto normal**: Contraste mínimo de 4.5:1 (AA)
- **Texto grande ou elementos de UI**: Contraste mínimo de 3:1 (AA)
- **Garantia de distinção**: Elementos interativos são claramente distinguíveis

## Implementação Técnica

A implementação das cores está centralizada no arquivo de tema do sistema:

```typescript
// frontend/src/contexts/ThemeContext.tsx
// Cores oficiais do sistema
const COLORS = {
  BLACK: '#000000',
  WHITE: '#FFFFFF',
  BLUE_DARK: '#0A2540',
  GRAY_LIGHT: '#F5F5F7',
  GRAY_MEDIUM: '#86868B',
  GRAY_DARK: '#1D1D1F',
  GRAY_DARKEST: '#121212'
};

// Paleta para modo claro
const lightPalette = {
  primary: { main: COLORS.BLUE_DARK, ... },
  secondary: { main: COLORS.BLACK, ... },
  background: { default: COLORS.WHITE, ... },
  // ...
};

// Paleta para modo escuro
const darkPalette = {
  primary: { main: COLORS.BLUE_DARK, ... },
  secondary: { main: COLORS.WHITE, ... },
  background: { default: COLORS.BLACK, ... },
  // ...
};
```

## Testes e Validação

Ao implementar novos componentes ou módulos, verifique:

1. **Consistência visual**: As cores aplicadas devem seguir estritamente este guia
2. **Contraste adequado**: Texto e elementos interativos devem manter alta legibilidade
3. **Funcionamento em ambos os modos**: Teste tanto no modo claro quanto no escuro
4. **Adaptação responsiva**: As cores devem funcionar bem em diferentes tamanhos de tela

## Demonstração Visual

Para visualizar a paleta de cores aplicada aos componentes do sistema, utilize o componente de demonstração:

```tsx
import ColorDemo from '../components/ColorDemo';

// Renderiza a demonstração completa
<ColorDemo />
```

---

## Referências

- [Material Design Color System](https://material.io/design/color/the-color-system.html)
- [WCAG 2.1 Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Color Accessibility](https://web.dev/learn/accessibility/color-contrast/) 