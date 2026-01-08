-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mangueira" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mangueira_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StatusMangueira" (
    "id" SERIAL NOT NULL,
    "mangueiraId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "atualizado" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StatusMangueira_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "StatusMangueira_mangueiraId_key" ON "StatusMangueira"("mangueiraId");

-- AddForeignKey
ALTER TABLE "Mangueira" ADD CONSTRAINT "Mangueira_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StatusMangueira" ADD CONSTRAINT "StatusMangueira_mangueiraId_fkey" FOREIGN KEY ("mangueiraId") REFERENCES "Mangueira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
