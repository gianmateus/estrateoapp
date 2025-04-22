# Estrateo

Estrateo é uma plataforma de gestão empresarial que integra inteligência artificial para otimizar processos de negócio.

## Estrutura do Projeto

Este é um monorepo contendo:

- **frontend**: Aplicação React com TypeScript para a interface do usuário
- **backend**: API Node.js com TypeScript para o servidor

## Requisitos

- Node.js 16+
- npm ou yarn

## Instalação

### Frontend

```bash
cd frontend
npm install
npm start
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example` em cada diretório (frontend e backend).

## Documentação

Para mais detalhes sobre cada parte do projeto, consulte os READMEs específicos em cada pasta.

## Formatação de Moeda

A aplicação usa o formato monetário europeu (EUR) para exibir valores financeiros. A formatação é centralizada através dos seguintes mecanismos:

1. **Utilitário de formatação**: `formatCurrency()` em `frontend/src/utils/formatters.ts`

   ```ts
   export const formatCurrency = (value: number): string => {
     return new Intl.NumberFormat('de-DE', {
       style: 'currency',
       currency: 'EUR'
     }).format(value);
   };
   ```

2. **Componente Currency**: Um componente React para exibir valores monetários formatados:

   ```tsx
   // Uso básico:
   <Currency value={12345.67} /> // € 12.345,67
   
   // Com propriedades adicionais do Typography
   <Currency value={100} variant="h4" color="primary" />
   ```

3. **Formato de exibição**: € 1.234,56 (formato europeu com ponto para milhar e vírgula para decimal)

Para alterar o formato de moeda no futuro, basta modificar a função `formatCurrency()` e todas as exibições na aplicação serão atualizadas automaticamente.

## Licença

Este projeto está licenciado sob a licença MIT. 