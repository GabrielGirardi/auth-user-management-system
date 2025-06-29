-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_personId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "validUntil" SET DEFAULT (now() + interval '1 year');

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_personId_fkey" FOREIGN KEY ("personId") REFERENCES "people"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
