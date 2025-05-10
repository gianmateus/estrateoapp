# Módulo de Impostos - Estrateo

Este documento descreve a implementação do módulo de Impostos para o Estrateo, incluindo a estrutura de arquivos, componentes, rotas e instruções de integração.

## Estrutura de Arquivos

```
frontend/
├── src/
│   ├── components/
│   │   └── contador/
│   │       ├── CardImposto.tsx       # Card reutilizável para exibir impostos
│   │       ├── TaxDatePicker.tsx     # Componente de seleção de período fiscal
│   │       └── TaxStatusBadge.tsx    # Badge para mostrar status do imposto
│   ├── contexts/
│   │   └── TaxContext.tsx           # Contexto para gerenciar dados de impostos
│   ├── pages/
│   │   ├── impostos/                # Páginas específicas de impostos
│   │   │   ├── Overview.tsx         # Visão geral com cards
│   │   │   ├── Umsatzsteuer.tsx     # Detalhes do VAT (Imposto sobre Valor Agregado)
│   │   │   ├── Koerperschaft.tsx    # Detalhes do Imposto Corporativo
│   │   │   ├── Gewerbesteuer.tsx    # Detalhes do Imposto Comercial
│   │   │   └── Folha.tsx            # Detalhes dos Impostos de Folha
│   │   └── Impostos.tsx             # Página principal de impostos (já existente)
│   └── types/
│       └── tax.d.ts                 # Definições de tipos para impostos
```

## Componentes Principais

### CardImposto

Card reutilizável para exibir informações de impostos com:
- Título e ícone
- Valor formatado em EUR
- Status visual (pago/pendente/atrasado)
- Data de vencimento
- Animação de fade-in e interatividade

### TaxDatePicker

Componente para selecionar o período fiscal com:
- Campo de seleção de mês/ano
- Botões de navegação (mês anterior/próximo)
- Botão de atualização com indicador de carregamento

### TaxStatusBadge

Badge colorido para indicar o status de um imposto:
- Pago (verde)
- A vencer (amarelo)
- Atrasado (vermelho)
- Futuro (azul)

## Contexto (TaxContext)

Gerencia dados fiscais em toda a aplicação:
- Previsão de impostos para o período atual
- Detalhes dos vários tipos de impostos
- Cálculos de saldo (ex: saldo de VAT)
- Status dos impostos com base em datas de vencimento

## Páginas

### Overview.tsx

Visão geral dos impostos com cards para cada categoria principal:
- VAT (Umsatzsteuer)
- Imposto Corporativo (Körperschaftsteuer)
- Imposto Comercial (Gewerbesteuer)
- Impostos de Folha (Lohnsteuer, etc.)

### Páginas Detalhadas (Umsatzsteuer.tsx, etc.)

Cada página de detalhe contém:
- Resumo do imposto para o período selecionado
- Gráfico histórico de 12 meses
- Tabela detalhada de lançamentos
- Botões de ação (exportar CSV, gerar XML, pagar)

## Integração ao Projeto Existente

Para integrar o módulo de impostos ao projeto existente, siga estas etapas:

### 1. Adicionar Dependências

Adicione as dependências necessárias ao `package.json`:

```bash
npm install apexcharts react-apexcharts
```

### 2. Definir Tipos

Crie o arquivo `tax.d.ts` com os tipos necessários.

### 3. Implementar Componentes Reutilizáveis

Adicione os componentes reutilizáveis na pasta `components/contador/`.

### 4. Implementar o Contexto

Adicione o contexto `TaxContext.tsx` para gerenciar os dados fiscais.

### 5. Adicionar Rotas

Integre as novas rotas ao `App.tsx` existente:

```jsx
<Route 
  path="/dashboard/impostos" 
  element={
    <PermissionGuard permission="financeiro.visualizar">
      <Impostos />
    </PermissionGuard>
  } 
/>
<Route 
  path="/dashboard/impostos/overview" 
  element={
    <PermissionGuard permission="financeiro.visualizar">
      <OverviewImpostos />
    </PermissionGuard>
  } 
/>
<Route 
  path="/dashboard/impostos/umsatzsteuer" 
  element={
    <PermissionGuard permission="financeiro.visualizar">
      <Umsatzsteuer />
    </PermissionGuard>
  } 
/>
```

### 6. Atualizar o Arquivo de Tradução

Adicione as chaves de tradução necessárias para o módulo de impostos no arquivo de tradução.

### 7. Adicionar Links no Menu de Navegação

Atualize o componente Navigation para incluir links para o módulo de impostos.

## Funcionalidades Principais

1. **Visualização de Impostos**: Cards intuitivos mostrando valores de cada tipo de imposto para o período selecionado.

2. **Filtragem por Período**: Seletor de mês/ano para visualizar dados fiscais de diferentes períodos.

3. **Detalhamento de Impostos**: Visualização detalhada de cada tipo de imposto com histórico e lançamentos.

4. **Status Visual**: Badges e cores indicando o status de cada imposto (pago, pendente, atrasado).

5. **Exportação**: Botões para exportar dados em formatos CSV e XML (ELSTER).

6. **Pagamento**: Integração com sistema de pagamento para liquidar impostos devidos.

7. **Atualização em Tempo Real**: Atualizações via EventBus quando há alterações nos dados fiscais.

## Conclusão

O módulo de Impostos traz uma experiência completa para gerenciamento fiscal, permitindo visualizar, analisar e agir sobre os diversos tipos de impostos de forma intuitiva e eficiente.

Para mais detalhes sobre cada componente, consulte os comentários no código-fonte. 