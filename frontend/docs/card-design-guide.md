# Guia de Design de Cards - Estrateo

Este documento apresenta a padronização visual dos cards do sistema Estrateo, estabelecendo diretrizes claras para garantir a consistência visual e reforçar a identidade premium da marca.

## Especificações Visuais

### Bordas e Cantos

| Propriedade | Valor | Descrição |
|-------------|-------|-----------|
| **Border Radius** | `16px` (1rem) | Bordas arredondadas uniformes em todos os cards para um visual moderno e elegante. |
| **Overflow** | `hidden` | Garante que o conteúdo respeita as bordas arredondadas. |

### Sombras e Elevação

| Propriedade | Valor (Modo Claro) | Valor (Modo Escuro) | Descrição |
|-------------|-------------------|---------------------|-----------|
| **Box Shadow** | `0 4px 20px rgba(0, 0, 0, 0.1)` | `0 4px 20px rgba(0, 0, 0, 0.2)` | Sombra suave que proporciona elevação sutil e sensação premium. |
| **Hover Shadow** | `0 6px 24px rgba(0, 0, 0, 0.12)` | `0 6px 24px rgba(0, 0, 0, 0.25)` | Feedback visual no hover, aumentando levemente a sombra. |
| **Transição** | `box-shadow 0.3s ease, transform 0.2s ease` | Mesma | Transição suave para efeitos de interação. |

### Cores de Fundo

| Modo | Cor | Código |
|------|-----|--------|
| **Claro** | Branco | `#FFFFFF` |
| **Escuro** | Cinza Muito Escuro | `#121212` |

## Aplicação nos Componentes

### Cards de Métricas

Cards utilizados para exibir KPIs, estatísticas e métricas principais:

- Utilizar títulos concisos
- Valores em destaque com tipografia maior
- Organizar métricas relacionadas em um mesmo card
- Incluir variação ou tendência quando relevante

### Cards de Gráficos

Cards que apresentam visualizações de dados:

- Título claro indicando o que está sendo visualizado
- Legenda quando necessário
- Ações relevantes nos botões do rodapé (exportar, filtrar, etc.)
- Espaçamento interno adequado para boa visualização

### Cards de Tabelas

Cards que contêm tabelas de dados:

- Cabeçalho com título e informações úteis (ex: última atualização)
- Tabelas com tamanho adequado ao card
- Paginação ou link para visualização completa quando há muitos dados

### Cards de Perfil/Informação

Cards que apresentam informações detalhadas ou perfis:

- Organizar informações por relevância
- Utilizar iconografia adequada
- Avatar ou imagem quando apropriado
- Ações contextuais nos botões do rodapé

### Modais e Popups

Componentes que utilizam o estilo visual de cards:

- Aplicar as mesmas bordas arredondadas (`16px`)
- Manter a consistência visual com os demais cards
- Adicionar botão de fechamento em posição acessível

## Implementação Técnica

A implementação é feita globalmente através do ThemeContext, aplicando os estilos a todos os componentes MuiCard:

```typescript
// frontend/src/contexts/ThemeContext.tsx
MuiCard: {
  styleOverrides: {
    root: {
      backgroundColor: mode === 'light' ? COLORS.WHITE : COLORS.GRAY_DARKEST,
      borderRadius: '16px',
      boxShadow: mode === 'light' 
        ? '0 4px 20px rgba(0, 0, 0, 0.1)'
        : '0 4px 20px rgba(0, 0, 0, 0.2)',
      transition: 'box-shadow 0.3s ease, transform 0.2s ease',
      '&:hover': {
        boxShadow: mode === 'light'
          ? '0 6px 24px rgba(0, 0, 0, 0.12)'
          : '0 6px 24px rgba(0, 0, 0, 0.25)',
      },
      overflow: 'hidden',
    }
  }
}
```

### Aplicação em Modais

Para modais e diálogos, aplicar o estilo de card através das `PaperProps`:

```typescript
<Dialog
  PaperProps={{
    sx: {
      borderRadius: '16px',
      overflow: 'hidden',
    }
  }}
>
  {/* Conteúdo do modal */}
</Dialog>
```

## Diretrizes de Uso

### Espaçamento Interno

- Padding adequado: mínimo de `16px` (1rem) em todos os lados
- Para cards com muita informação, considerar `24px` (1.5rem)
- Manter espaçamento consistente entre elementos internos

### Organização de Conteúdo

- Seguir hierarquia visual clara (títulos, subtítulos, conteúdo)
- Agrupar informações relacionadas
- Utilizar divisores (`Divider`) quando necessário para separar seções
- Limitar a quantidade de informações por card

### Responsividade

- Cards devem se adaptar a diferentes tamanhos de tela
- Em telas pequenas, cards podem ocupar largura total
- Conteúdo deve se ajustar sem quebrar o layout

## Verificação e Testes

Ao implementar cards no sistema, verifique:

1. **Consistência visual**: Bordas, sombras e cores conforme especificado
2. **Responsividade**: Comportamento adequado em diferentes tamanhos de tela
3. **Modo escuro**: Aparência adequada em ambos os modos (claro/escuro)
4. **Conteúdo**: Sem vazamentos ou cortes nas bordas arredondadas

## Demonstração Visual

Para visualizar a aplicação dos estilos de card em diferentes contextos:

```tsx
import CardDemo from '../components/CardDemo';

// Renderiza a demonstração completa
<CardDemo />
```

---

## Referências

- [Material Design - Cards](https://material.io/components/cards)
- [Diretrizes de Acessibilidade - WCAG](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html)
- [Princípios de Design de UI - Elevation & Shadows](https://material.io/design/environment/elevation.html) 