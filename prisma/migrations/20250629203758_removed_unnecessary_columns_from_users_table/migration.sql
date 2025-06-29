/*
  Warnings:

  - You are about to drop the column `birthDate` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_cpf_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "birthDate",
DROP COLUMN "cpf",
ALTER COLUMN "validUntil" SET DEFAULT (now() + interval '1 year');
