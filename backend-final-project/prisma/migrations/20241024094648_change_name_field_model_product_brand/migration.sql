/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ProductBrand` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductBrand_name_key" ON "ProductBrand"("name");
