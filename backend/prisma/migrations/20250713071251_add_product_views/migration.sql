/*
  Warnings:

  - Added the required column `views` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "views" INTEGER NOT NULL;
