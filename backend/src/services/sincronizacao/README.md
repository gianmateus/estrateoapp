# Sistema de Eventos e Sincronização Entre Módulos

Este diretório contém os componentes do sistema de eventos que permite a comunicação desacoplada entre os módulos da aplicação Estrateo.

## Visão Geral

O sistema utiliza um padrão de **Event Bus** (barramento de eventos) para facilitar a comunicação entre diferentes partes da aplicação sem criar dependências diretas entre elas. Quando uma ação importante ocorre em um módulo (como a criação de um pagamento), um evento é emitido e outros módulos interessados podem reagir a esse evento.

## Componentes Principais

1. **EventBus**: Classe estática que gerencia eventos e callbacks
2. **Listeners**: Serviços que escutam eventos específicos e fazem atualizações em outros módulos
3. **Emissores**: Controladores que emitem eventos quando ocorrem ações relevantes

## Estrutura

```
/src
  /lib
    EventBus.ts - Classe central de gerenciamento de eventos
  /services
    /sincronizacao
      index.ts - Inicialização de todos os listeners
      pagamentoListener.ts - Reage a eventos de pagamentos
      entradaListener.ts - Reage a eventos de entradas
      funcionarioListener.ts - Reage a eventos de pagamentos de funcionários
      estoqueListener.ts - Reage a eventos de movimentação de estoque
```

## Como Funciona

1. Quando ocorre uma ação importante (ex: criação de um pagamento), o controlador emite um evento:
   ```typescript
   EventBus.emit('pagamento.criado', pagamentoData);
   ```

2. Os listeners de diferentes módulos reagem ao evento:
   ```typescript
   EventBus.on('pagamento.criado', async (pagamento) => {
     // Atualiza o Calendário
     // Atualiza o Financeiro
     // Notifica o Contador
   });
   ```

## Eventos Suportados

| Evento | Descrição | Módulos Afetados |
|--------|-----------|------------------|
| `pagamento.criado` | Criação de um novo pagamento | Calendário, Contador, Financeiro |
| `pagamento.atualizado` | Atualização de um pagamento existente | Calendário, Contador, Financeiro |
| `pagamento.excluido` | Exclusão de um pagamento | Calendário, Contador, Financeiro |
| `entrada.criada` | Criação de uma nova entrada financeira | Contador, Financeiro, Relatórios |
| `entrada.atualizada` | Atualização de uma entrada existente | Contador, Financeiro, Relatórios |
| `entrada.excluida` | Exclusão de uma entrada | Contador, Financeiro, Relatórios |
| `funcionario.pagamento.realizado` | Pagamento feito a um funcionário | Contador, Financeiro, Calendário |
| `funcionario.pagamento.cancelado` | Cancelamento de pagamento de funcionário | Contador, Financeiro, Calendário |
| `estoque.movimentado` | Movimentação de estoque (entrada/saída) | Financeiro, Contador |
| `estoque.item.abaixo.minimo` | Item abaixo do nível mínimo | Notificações |

## Como Adicionar um Novo Evento

1. Adicione o tipo do evento na definição `EventName` em `EventBus.ts`
2. Crie um listener para o evento ou adicione a um listener existente
3. Registre o listener no arquivo `index.ts` 
4. Emita o evento nos controladores apropriados

## Benefícios

- **Baixo Acoplamento**: Os módulos não dependem diretamente uns dos outros
- **Manutenibilidade**: Facilidade para adicionar novos comportamentos a eventos existentes
- **Extensibilidade**: Novos módulos podem se inscrever em eventos existentes
- **Escalabilidade**: Processamento distribuído entre diferentes serviços

## Considerações para o Futuro

- Implementar armazenamento de eventos para histórico de auditoria
- Adicionar sistema de notificações por email/WhatsApp baseado em eventos
- Integrar com serviços de IA para análise automática de dados 