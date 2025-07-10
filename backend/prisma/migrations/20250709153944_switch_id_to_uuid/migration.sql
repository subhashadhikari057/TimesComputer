/*
  Warnings:

  - The primary key for the `AdminUser` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "AdminUser" DROP CONSTRAINT "AdminUser_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "AdminUser_id_seq";
