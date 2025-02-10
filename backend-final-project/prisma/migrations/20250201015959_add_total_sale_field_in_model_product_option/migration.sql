-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductOption" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "optionName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "totalSale" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProductOption_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductOption" ("id", "optionName", "productId", "quantity") SELECT "id", "optionName", "productId", "quantity" FROM "ProductOption";
DROP TABLE "ProductOption";
ALTER TABLE "new_ProductOption" RENAME TO "ProductOption";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
