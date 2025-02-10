-- CreateTable
CREATE TABLE "OptionName" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OptionNameToProductType" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_OptionNameToProductType_A_fkey" FOREIGN KEY ("A") REFERENCES "OptionName" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_OptionNameToProductType_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_OptionNameToProductType_AB_unique" ON "_OptionNameToProductType"("A", "B");

-- CreateIndex
CREATE INDEX "_OptionNameToProductType_B_index" ON "_OptionNameToProductType"("B");
