-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "empresa" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "documentoPrincipal" TEXT,
    "endereco" TEXT,
    "website" TEXT,
    "segmento" TEXT,
    "anotacoes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ativo',
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InteracaoCliente" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responsavel" TEXT,
    "resultado" TEXT,
    "proximaAcao" TEXT,
    "dataProximaAcao" TIMESTAMP(3),
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InteracaoCliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentoCliente" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "caminhoArquivo" TEXT NOT NULL,
    "tamanhoBytes" INTEGER,
    "mimeType" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentoCliente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cliente_nome_idx" ON "Cliente"("nome");

-- CreateIndex
CREATE INDEX "Cliente_email_idx" ON "Cliente"("email");

-- CreateIndex
CREATE INDEX "Cliente_documentoPrincipal_idx" ON "Cliente"("documentoPrincipal");

-- CreateIndex
CREATE INDEX "InteracaoCliente_clienteId_idx" ON "InteracaoCliente"("clienteId");

-- CreateIndex
CREATE INDEX "InteracaoCliente_data_idx" ON "InteracaoCliente"("data");

-- CreateIndex
CREATE INDEX "DocumentoCliente_clienteId_idx" ON "DocumentoCliente"("clienteId");

-- CreateIndex
CREATE INDEX "DocumentoCliente_tipo_idx" ON "DocumentoCliente"("tipo");

-- AddForeignKey
ALTER TABLE "InteracaoCliente" ADD CONSTRAINT "InteracaoCliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentoCliente" ADD CONSTRAINT "DocumentoCliente_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE; 