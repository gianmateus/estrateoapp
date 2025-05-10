# Instruções para Enviar o Projeto Estratéo ao GitHub

O repositório Git local já foi inicializado e o primeiro commit foi criado. Para completar o processo e enviar o código ao GitHub, siga estas etapas:

## 1. Criar um Repositório no GitHub

1. Acesse https://github.com/ e faça login em sua conta
2. Clique no botão "+" no canto superior direito, em seguida selecione "New repository"
3. Preencha os seguintes campos:
   - Repository name: `estrateoapp`
   - Description (opcional): `Aplicação de gerenciamento para restaurantes`
   - Visibilidade: Public ou Private (conforme sua preferência)
4. Não inclua nenhum arquivo README, .gitignore ou licença, pois já temos os arquivos localmente
5. Clique em "Create repository"

## 2. Conectar o Repositório Local ao GitHub

Após criar o repositório, você verá a página de instruções. Copie os comandos na seção "…or push an existing repository from the command line".

Execute os seguintes comandos no terminal (PowerShell):

```powershell
git remote add origin https://github.com/SEU-USUARIO/estrateoapp.git
git branch -M main
git push -u origin main
```

Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub.

## 3. Autenticação

Ao executar o comando push, você poderá ser solicitado a fornecer suas credenciais do GitHub:

- Se você estiver usando o GitHub CLI, siga as instruções para autenticação
- Se você tiver configurado o acesso SSH, certifique-se de que a URL do repositório remoto use o formato SSH
- Para autenticação via Token, gere um token de acesso pessoal no GitHub e use-o como senha quando solicitado

## 4. Verificar o Upload

Após o push ser concluído, acesse o repositório no GitHub para verificar se todos os arquivos foram enviados corretamente.

## 5. Comandos Úteis para Atualizações Futuras

Para enviar atualizações futuras ao GitHub:

```powershell
git add .
git commit -m "Descrição das alterações"
git push
```

## Observações

- O arquivo `.gitignore` já foi configurado para excluir os arquivos desnecessários
- Senhas, chaves de API e outras informações sensíveis não devem ser enviadas ao GitHub. Use variáveis de ambiente ou o arquivo `.env` (que já está no `.gitignore`) 