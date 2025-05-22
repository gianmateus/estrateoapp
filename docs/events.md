# Registro de Eventos do Sistema

Este documento mantém um registro centralizado de todos os eventos utilizados no sistema, suas origens, destinos e casos de uso.

## Convenção de Nomenclatura

Todos os eventos devem seguir o padrão: `dominio.acao`

Exemplos:
- `ferias.registradas`
- `estoque.atualizado`
- `pagamento.realizado`

## Eventos de Férias

### `ferias.registradas`

**Payload:**
```typescript
{
  funcionarioId: string;
  funcionarioNome: string;
  dataInicio: string;
  dataFim: string;
  metadata?: {
    motivo?: string;
    aprovadoPor?: string;
    [key: string]: any;
  };
}
```

**Emissores:**
- `FeriasRegistro` - Quando um funcionário registra um novo período de férias

**Listeners:**
- `FeriasNotificacoes` - Exibe notificação de férias registradas
- `FeriasAprovacao` - Atualiza lista de férias pendentes

**Caso de Uso:**
Notifica o sistema sobre um novo registro de férias, permitindo que outros componentes reajam a esta mudança.

### `ferias.aprovadas`

**Payload:**
```typescript
{
  funcionarioId: string;
  funcionarioNome: string;
  dataInicio: string;
  dataFim: string;
  aprovadoPor: string;
  metadata?: {
    [key: string]: any;
  };
}
```

**Emissores:**
- `FeriasAprovacao` - Quando um gestor aprova um período de férias

**Listeners:**
- `FeriasNotificacoes` - Exibe notificação de aprovação
- `Calendario` - Atualiza o calendário com as férias aprovadas

**Caso de Uso:**
Notifica o sistema sobre a aprovação de férias, permitindo atualizações em componentes relacionados.

### `ferias.rejeitadas`

**Payload:**
```typescript
{
  funcionarioId: string;
  funcionarioNome: string;
  motivo: string;
  rejeitadoPor: string;
  metadata?: {
    [key: string]: any;
  };
}
```

**Emissores:**
- `FeriasAprovacao` - Quando um gestor rejeita um período de férias

**Listeners:**
- `FeriasNotificacoes` - Exibe notificação de rejeição
- `FeriasRegistro` - Notifica o funcionário sobre a rejeição

**Caso de Uso:**
Notifica o sistema sobre a rejeição de férias, permitindo que os componentes relevantes atualizem seu estado.

## Eventos de Estoque

### `estoque.item.abaixo.minimo`

**Payload:**
```typescript
{
  id: string;
  nome: string;
  quantidade: number;
  minimo: number;
  categoria?: string;
}
```

**Emissores:**
- `EstoqueService` - Quando um item atinge quantidade abaixo do mínimo

**Listeners:**
- `EstoqueNotificacoes` - Exibe alerta de estoque baixo
- `EstoqueRelatorio` - Atualiza relatórios de estoque

**Caso de Uso:**
Alerta o sistema sobre itens com estoque abaixo do mínimo configurado.

### `estoque.item.proximo.vencimento`

**Payload:**
```typescript
{
  id: string;
  nome: string;
  dataValidade: string;
  diasRestantes: number;
  categoria?: string;
}
```

**Emissores:**
- `EstoqueService` - Quando um item está próximo do vencimento

**Listeners:**
- `EstoqueNotificacoes` - Exibe alerta de vencimento próximo
- `EstoqueRelatorio` - Atualiza relatórios de estoque

**Caso de Uso:**
Notifica o sistema sobre itens próximos do vencimento para ações preventivas.

## Eventos de Pagamento

### `pagamento.criado`

**Payload:**
```typescript
{
  id: string;
  valor: number;
  data: string;
  categoria: string;
}
```

**Emissores:**
- `PagamentoService` - Quando um novo pagamento é registrado

**Listeners:**
- `FinanceiroNotificacoes` - Exibe notificação de novo pagamento
- `FinanceiroRelatorio` - Atualiza relatórios financeiros

**Caso de Uso:**
Notifica o sistema sobre a criação de um novo pagamento.

## Eventos de Sincronização

### `sincronizacao`

**Payload:**
```typescript
{
  tipo: 'inicio' | 'fim' | 'erro';
  detalhes?: string;
}
```

**Emissores:**
- `SincronizacaoService` - Durante processos de sincronização

**Listeners:**
- `SincronizacaoNotificacoes` - Exibe status da sincronização
- `SincronizacaoLog` - Registra logs de sincronização

**Caso de Uso:**
Notifica o sistema sobre o status de processos de sincronização.

## Eventos de Impostos

### `imposto.vencimento.proximo`

**Payload:**
```typescript
{
  id: string;
  tipo: string;
  nome: string;
  dataVencimento: string;
  diasRestantes: number;
  valor: number;
  paisAplicacao: string;
}
```

**Emissores:**
- `ImpostoService` - Quando um imposto está próximo do vencimento

**Listeners:**
- `ImpostoNotificacoes` - Exibe alerta de vencimento próximo
- `ImpostoRelatorio` - Atualiza relatórios de impostos

**Caso de Uso:**
Alerta o sistema sobre impostos com vencimento próximo.

### `imposto.pago`

**Payload:**
```typescript
{
  id: string;
  tipo: string;
  nome: string;
  valorPago: number;
  dataPagamento: string;
  referencia: string;
  paisAplicacao: string;
}
```

**Emissores:**
- `ImpostoService` - Quando um imposto é pago

**Listeners:**
- `ImpostoNotificacoes` - Exibe confirmação de pagamento
- `ImpostoRelatorio` - Atualiza relatórios de impostos

**Caso de Uso:**
Notifica o sistema sobre o pagamento de um imposto. 