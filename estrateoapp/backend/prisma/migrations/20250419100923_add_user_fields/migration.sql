-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cargo" TEXT,
ADD COLUMN     "horarioFuncionamento" JSONB,
ADD COLUMN     "permissoes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "tipoNegocio" TEXT,
ADD COLUMN     "whatsapp" TEXT;
