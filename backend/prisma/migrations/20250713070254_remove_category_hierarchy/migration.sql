/*
  Warnings:

  - You are about to drop the column `parentCategoryId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentCategoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "parentCategoryId";
