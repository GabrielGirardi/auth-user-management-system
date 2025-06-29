-- AlterTable
ALTER TABLE "people" ALTER COLUMN "birthDate" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "validUntil" SET DEFAULT (now() + interval '1 year');
