/*
  Warnings:

  - You are about to drop the column `criado_em` on the `Mangueira` table. All the data in the column will be lost.
  - The primary key for the `StatusMangueira` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `atualizado` on the `StatusMangueira` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `StatusMangueira` table. All the data in the column will be lost.
  - You are about to drop the column `criado_em` on the `Usuario` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "StatusMangueira_mangueiraId_key";

-- AlterTable
ALTER TABLE "Mangueira" DROP COLUMN "criado_em";

-- AlterTable
ALTER TABLE "StatusMangueira" DROP CONSTRAINT "StatusMangueira_pkey",
DROP COLUMN "atualizado",
DROP COLUMN "id",
ADD COLUMN     "ligado_em" TIMESTAMP(3),
ADD CONSTRAINT "StatusMangueira_pkey" PRIMARY KEY ("mangueiraId");

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "criado_em";

-- CreateTable
CREATE TABLE "Historico" (
    "id" SERIAL NOT NULL,
    "mangueiraId" INTEGER NOT NULL,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,
    "duracaoSeg" INTEGER NOT NULL,

    CONSTRAINT "Historico_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Historico" ADD CONSTRAINT "Historico_mangueiraId_fkey" FOREIGN KEY ("mangueiraId") REFERENCES "Mangueira"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
