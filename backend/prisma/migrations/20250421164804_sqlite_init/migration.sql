-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cargo" TEXT,
    "telefone" TEXT,
    "setor" TEXT,
    "password" TEXT NOT NULL,
    "permissoes" TEXT NOT NULL DEFAULT 'user',
    "tipoNegocio" TEXT,
    "numeroFuncionarios" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Pagamento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "valor" REAL NOT NULL,
    "data" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "descricao" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pagamento_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Inventario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco" REAL NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inventario_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
