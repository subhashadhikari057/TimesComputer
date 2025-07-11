/*
  Warnings:

  - You are about to drop the column `image` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "image",
ADD COLUMN     "images" TEXT[];
