# Sistema de Gerenciamento para Restaurantes

Um sistema completo de gerenciamento para restaurantes com funcionalidades para controle de estoque, finanças, pagamentos, e análises com IA.

## Funcionalidades

- **Dashboard**: Visão geral de todos os aspectos do restaurante
- **Financeiro**: Gestão de receitas, despesas e relatórios
- **Inventário**: Controle de estoque com notificações de itens em baixa
- **Pagamentos**: Gerenciamento de contas a pagar e receber
- **Inteligência Artificial**: Análises e previsões para o negócio

## Tecnologias Utilizadas

- React com TypeScript
- Material UI para interface
- React Router para navegação
- Recharts para gráficos e visualizações
- Node.js com Express para o servidor proxy da IA
- OpenAI API (ChatGPT) para análises inteligentes

## Recursos Avançados

### Segurança & Desempenho

- **Cache Persistente**: Armazenamento de respostas da API para reduzir custos e melhorar tempo de resposta
- **Rate Limiting**: Protege contra uso excessivo da API
- **Logging Estruturado**: Sistema de logs completo para monitoramento e diagnóstico
- **Autenticação Multi-Nível**: Proteção para endpoints administrativos
- **Tolerância a Falhas**: Retry logic inteligente para lidar com falhas transitórias

### Interface de IA

- **Métricas em Tempo Real**: Visualização de uso de tokens e requisições
- **Configurações Avançadas**: Seleção de modelos e parâmetros de geração
- **Gestão de Cache**: Controle sobre uso de respostas em cache

## Sistema de Permissões

O Estrateo-App utiliza um sistema de permissões baseado em constantes para controlar o acesso às diferentes funcionalidades da aplicação.

### Constantes de Permissões

As permissões estão definidas como constantes no arquivo `src/constants/permissions.ts`. Isso permite um gerenciamento centralizado das permissões e evita erros de digitação ao usar strings diretamente no código.

Principais permissões:

- `ADMIN_PERMISSION`: Permissão de administrador com acesso completo ao sistema
- `VIEW_DASHBOARD_PERMISSION`: Acesso à visualização do painel principal
- `VIEW_PAYMENTS_PERMISSION`: Acesso à visualização de pagamentos
- `CREATE_PAYMENT_PERMISSION`: Permissão para criar novos pagamentos
- `EDIT_PAYMENT_PERMISSION`: Permissão para editar pagamentos existentes
- `DELETE_PAYMENT_PERMISSION`: Permissão para excluir pagamentos
- `VIEW_INVENTORY_PERMISSION`: Acesso à visualização do inventário
- `CREATE_INVENTORY_PERMISSION`: Permissão para adicionar itens ao inventário
- `EDIT_INVENTORY_PERMISSION`: Permissão para editar itens do inventário
- `DELETE_INVENTORY_PERMISSION`: Permissão para excluir itens do inventário
- `VIEW_PROFILE_PERMISSION`: Permissão para visualizar perfil
- `EDIT_PROFILE_PERMISSION`: Permissão para editar perfil

### Componentes de Verificação de Permissões

O projeto utiliza dois componentes principais para controle de acesso baseado em permissões:

1. **PermissionGuard**: Componente que controla o acesso a conteúdos e seções da interface
   ```jsx
   <PermissionGuard permission={VIEW_INVENTORY_PERMISSION}>
     <InventarioContent />
   </PermissionGuard>
   ```

2. **PermissionButton**: Componente para botões que só são exibidos se o usuário tiver a permissão necessária
   ```jsx
   <PermissionButton 
     permission={CREATE_PAYMENT_PERMISSION}
     onClick={handleCreatePayment}
   >
     Criar Pagamento
   </PermissionButton>
   ```

3. **ProtectedRoute**: Componente que protege rotas completas, redirecionando para tela de acesso negado se o usuário não tiver permissão
   ```jsx
   <Route path="/dashboard/pagamentos" element={
     <ProtectedRoute requiredPermission={VIEW_PAYMENTS_PERMISSION}>
       <Pagamentos />
     </ProtectedRoute>
   } />
   ```

### Verificação de Permissões

Para verificar permissões em componentes funcionais:

```jsx
import { useAuth } from '../contexts/AuthContext';
import { EDIT_PAYMENT_PERMISSION } from '../constants/permissions';

function MeuComponente() {
  const { hasPermission } = useAuth();
  
  // Verificar se usuário tem permissão
  const podeEditar = hasPermission(EDIT_PAYMENT_PERMISSION);
  
  // ...
}
```

## Requisitos

- Node.js 14+ e npm
- Uma chave de API da OpenAI (para o servidor de IA)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/sistema-restaurante.git
cd sistema-restaurante
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo .env com sua chave da OpenAI:
```
# Criar arquivo .env na raiz do projeto
OPENAI_API_KEY=sua_chave_api_aqui
PORT=3001  # opcional, padrão é 3001

# Configurações de segurança (opcionais)
ADMIN_USER=admin
ADMIN_PASSWORD=senha_segura
ENABLE_RATE_LIMIT=true
MAX_REQUESTS_PER_HOUR=100
```

4. Inicie o servidor e a aplicação em desenvolvimento:
```bash
npm run dev
```

Isso iniciará o servidor proxy na porta 3001 e o frontend React na porta 3000.

## Arquitetura 

O sistema está dividido em:

- **Frontend**: Interface React com TypeScript
- **Servidor Proxy**: Middleware Node.js que protege sua chave de API OpenAI
- **Serviços**: Encapsulamento da lógica de negócio e integração com APIs

### O Servidor de IA

Para proteger sua chave de API e facilitar para os usuários finais, o sistema utiliza um servidor proxy que:

- Centraliza todas as chamadas para a OpenAI API
- Mantém sua chave de API segura no servidor
- Oferece controle de uso e monitoramento
- Permite adicionar limites e recursos de caching

### Monitoramento e Administração

O sistema inclui endpoints administrativos protegidos:

- `/api/status`: Verifica status do servidor e suas configurações
- `/api/admin/stats`: Visualiza estatísticas detalhadas de uso (requer autenticação)
- `/api/admin/clear-cache`: Limpa o cache do servidor (requer autenticação)

## Uso em Produção

Para implantar em produção:

1. Construa a aplicação:
```bash
npm run build
```

2. Configure um servidor web (Nginx, Apache, etc.) para servir os arquivos estáticos da pasta `build`

3. Configure o servidor Node.js proxy como um serviço:
```bash
# Exemplo com PM2
npm install -g pm2
pm2 start src/server/openaiProxy.js
```

4. Recomendações de segurança para produção:
   - Ative a autenticação de API com `ENABLE_AUTHENTICATION=true`
   - Configure uma senha forte para o admin
   - Defina limites de requisições apropriados
   - Configure CORS para permitir apenas origens confiáveis

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes. 