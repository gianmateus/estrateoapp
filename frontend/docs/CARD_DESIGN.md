# Documentação de Design dos Cards

## Visão Geral

Este documento descreve as diretrizes de design para todos os cards no sistema Estrateo. As atualizações visam reforçar a identidade premium da marca, através de uma apresentação visual consistente em todos os módulos.

## Especificações Técnicas

### Bordas
- **Border-radius**: 16px (1rem) para todos os cards
- Aplicado de forma consistente em todos os módulos
- Bordas suaves e modernas que transmitem sofisticação

### Sombras
- **Box-shadow**: `0 4px 20px rgba(0, 0, 0, 0.1)`
- Sombra suave e sutil, com visual premium
- Visível tanto no modo claro quanto escuro
- Não pesa visualmente o layout

### Implementação

A implementação foi realizada em dois níveis:

1. **Nível Global**: Através do ThemeContext, aplicando os estilos a todos os componentes MuiCard
2. **Nível de Componente**: Atualizando componentes específicos como ResumoMensalCard e InfoCard
3. **Componente Reutilizável**: Um novo componente `Card` foi criado em `src/components/ui/Card.tsx`

## Uso do Componente Card

Para novos componentes, recomendamos usar o componente Card personalizado:

```tsx
import Card from 'src/components/ui/Card';
import { CardContent } from '@mui/material';

const MeuComponente = () => {
  return (
    <Card>
      <CardContent>
        {/* Conteúdo do card */}
      </CardContent>
    </Card>
  );
};
```

Para cards clicáveis, use a propriedade `clickable`:

```tsx
<Card clickable onClick={handleClick}>
  <CardContent>
    {/* Conteúdo do card */}
  </CardContent>
</Card>
```

## Considerações Importantes

- Não foram removidas personalizações específicas de cards existentes
- A transição ao passar o mouse foi mantida para melhorar a experiência do usuário
- A implementação mantém a compatibilidade com o sistema de temas (claro/escuro)

## Testes Recomendados

Antes do deploy, recomendamos testar:

1. Visualização em diferentes tamanhos de tela
2. Verificação em modo claro e escuro
3. Interações de hover e clique nos cards clicáveis
4. Verificar se não há vazamento ou corte de conteúdo nas bordas

## Próximos Passos

- Revisão geral de cards personalizados em componentes específicos
- Validação visual com stakeholders
- Implementação de feedback recebido 