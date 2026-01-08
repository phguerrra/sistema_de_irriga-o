/*
  Warnings:

  - You are about to drop the column `duracaoSeg` on the `Historico` table. All the data in the column will be lost.
  - You are about to drop the column `fim` on the `Historico` table. All the data in the column will be lost.
  - You are about to drop the column `inicio` on the `Historico` table. All the data in the column will be lost.
  - The primary key for the `StatusMangueira` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ligado_em` on the `StatusMangueira` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mangueiraId]` on the table `StatusMangueira` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ligadoEm` to the `Historico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atualizadoEm` to the `StatusMangueira` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Historico" DROP COLUMN "duracaoSeg",
DROP COLUMN "fim",
DROP COLUMN "inicio",
ADD COLUMN     "desligadoEm" TIMESTAMP(3),
ADD COLUMN     "ligadoEm" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tempoLigado" INTEGER;

-- AlterTable
ALTER TABLE "Mangueira" ADD COLUMN     "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "StatusMangueira" DROP CONSTRAINT "StatusMangueira_pkey",
DROP COLUMN "ligado_em",
ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "StatusMangueira_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "StatusMangueira_mangueiraId_key" ON "StatusMangueira"("mangueiraId");
