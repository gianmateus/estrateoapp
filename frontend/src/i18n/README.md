# Internacionalização (i18n) do Projeto

Este documento descreve como o sistema de internacionalização (i18n) está configurado e como usá-lo em novos componentes.

## Estrutura do Sistema

A internacionalização usa a biblioteca i18next junto com react-i18next para fornecer traduções e formatação de acordo com o idioma.

### Idiomas Suportados

- 🇬🇧 Inglês (padrão)
- 🇧🇷 Português (pt-BR)
- 🇩🇪 Alemão
- 🇮🇹 Italiano

### Arquivos de Tradução

Os arquivos de tradução estão localizados em:

```
/frontend/src/locales/
├── en/
│   └── translation.json
├── pt/
│   └── translation.json
├── de/
│   └── translation.json
└── it/
    └── translation.json
```

## Configuração

A configuração principal está em `/frontend/src/i18n.ts` e inclui:

- Configuração de fallback para inglês (`fallbackLng: 'en'`)
- Detecção automática de idioma na ordem:
  1. `localStorage`
  2. `navigator.language`
  3. Idioma padrão (inglês)

## Formatação de Valores

Uma característica importante deste projeto é que todos os valores monetários são exibidos em euros (€), independentemente do idioma selecionado.

### Como os Valores São Formatados

- **Moeda**: Sempre em euro (€), mas formatado conforme as convenções do idioma selecionado
- **Datas**: Formatadas conforme as convenções do idioma selecionado
- **Números**: Formatados conforme as convenções do idioma selecionado

### Exemplos de Formatação de Moeda

Para o valor `1200.50`:

- 🇩🇪 Alemão → `1.200,50 €`
- 🇬🇧 Inglês → `€1,200.50`
- 🇧🇷 Português → `€1.200,50`
- 🇮🇹 Italiano → `1.200,50 €`

## Como Usar

### Tradução de Textos

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return <div>{t('chave.de.traducao')}</div>;
};
```

### Formatação de Valores

O projeto fornece hooks e funções para formatação:

```tsx
import useFormatters from '../hooks/useFormatters';

const MyComponent = () => {
  const { formatCurrency, formatNumber, formatDate } = useFormatters();
  
  return (
    <div>
      <p>Valor: {formatCurrency(1200.50)}</p>
      <p>Número: {formatNumber(1234567.89)}</p>
      <p>Data: {formatDate(new Date())}</p>
    </div>
  );
};
```

## Adicionar Novas Traduções

Para adicionar novas chaves de tradução:

1. Adicione a chave e o valor ao arquivo `/frontend/src/locales/en/translation.json` (inglês como referência)
2. Adicione a mesma chave aos outros arquivos de tradução com os valores traduzidos

## Componente de Seleção de Idioma

O projeto inclui um componente `LanguageSelector` que permite aos usuários escolher manualmente o idioma:

```tsx
import LanguageSelector from '../components/LanguageSelector';

const MyComponent = () => {
  return (
    <div>
      <LanguageSelector />
      {/* Resto do componente */}
    </div>
  );
};
```

## Melhores Práticas

1. Use chaves de tradução hierárquicas para organizar as traduções (ex: `menu.home`, `menu.about`)
2. Sempre use as funções de formatação fornecidas para valores monetários, datas e números
3. Teste a interface em todos os idiomas suportados
4. Use inglês como idioma padrão para novas chaves de tradução 