/*
  Warnings:

  - Added the required column `optionId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `optionId` to the `OrderItemNotLogin` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "ProductOption" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderItem" ("id", "orderId", "productId", "quantity") SELECT "id", "orderId", "productId", "quantity" FROM "OrderItem";
DROP TABLE "OrderItem";
ALTER TABLE "new_OrderItem" RENAME TO "OrderItem";
CREATE UNIQUE INDEX "OrderItem_optionId_key" ON "OrderItem"("optionId");
CREATE TABLE "new_OrderItemNotLogin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    CONSTRAINT "OrderItemNotLogin_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItemNotLogin_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "ProductOption" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItemNotLogin_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "OrderNotLogin" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OrderItemNotLogin" ("id", "orderId", "productId", "quantity") SELECT "id", "orderId", "productId", "quantity" FROM "OrderItemNotLogin";
DROP TABLE "OrderItemNotLogin";
ALTER TABLE "new_OrderItemNotLogin" RENAME TO "OrderItemNotLogin";
CREATE UNIQUE INDEX "OrderItemNotLogin_optionId_key" ON "OrderItemNotLogin"("optionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
