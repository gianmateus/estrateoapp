-- AlterTable para adicionar novos campos ao modelo Funcionario
ALTER TABLE "Funcionario" ADD COLUMN "formaPagamento" TEXT;
ALTER TABLE "Funcionario" ADD COLUMN "situacaoAtual" TEXT;
ALTER TABLE "Funcionario" ADD COLUMN "telefone" TEXT;
ALTER TABLE "Funcionario" ADD COLUMN "email" TEXT;

-- Atualizar registros existentes com valores padrão
UPDATE "Funcionario" SET 
  "formaPagamento" = 'mensal',
  "situacaoAtual" = 'ativo' 
WHERE "formaPagamento" IS NULL; 