-- AlterTable
ALTER TABLE "people" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "validUntil" SET DEFAULT (now() + interval '1 year');
