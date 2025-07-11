/*
  Warnings:

  - The `image` column on the `Brand` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `image` column on the `Category` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "image",
ADD COLUMN     "image" TEXT[];

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "image",
ADD COLUMN     "image" TEXT[];
