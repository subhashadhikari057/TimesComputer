/*
  Warnings:

  - You are about to drop the column `tags` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "image" TEXT NOT NULL DEFAULT 'default-image.jpg';

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "image" TEXT NOT NULL DEFAULT 'default-image.jpg';

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "tags";

-- DropTable
DROP TABLE "Tag";

-- CreateTable
CREATE TABLE "FeatureTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FeatureTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketingTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MarketingTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductFeatureTag" (
    "productId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "ProductFeatureTag_pkey" PRIMARY KEY ("productId","tagId")
);

-- CreateTable
CREATE TABLE "ProductMarketingTag" (
    "productId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "ProductMarketingTag_pkey" PRIMARY KEY ("productId","tagId")
);

-- CreateTable
CREATE TABLE "Color" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "hexCode" TEXT,

    CONSTRAINT "Color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductColor" (
    "productId" INTEGER NOT NULL,
    "colorId" INTEGER NOT NULL,

    CONSTRAINT "ProductColor_pkey" PRIMARY KEY ("productId","colorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "FeatureTag_name_key" ON "FeatureTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MarketingTag_name_key" ON "MarketingTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Color_name_key" ON "Color"("name");

-- AddForeignKey
ALTER TABLE "ProductFeatureTag" ADD CONSTRAINT "ProductFeatureTag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductFeatureTag" ADD CONSTRAINT "ProductFeatureTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "FeatureTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMarketingTag" ADD CONSTRAINT "ProductMarketingTag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMarketingTag" ADD CONSTRAINT "ProductMarketingTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "MarketingTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductColor" ADD CONSTRAINT "ProductColor_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductColor" ADD CONSTRAINT "ProductColor_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "Color"("id") ON DELETE CASCADE ON UPDATE CASCADE;
