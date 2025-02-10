/*
  Warnings:

  - Added the required column `status` to the `OrderNotLogin` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderNotLogin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_OrderNotLogin" ("address", "email", "firstName", "id", "lastName", "phoneNumber") SELECT "address", "email", "firstName", "id", "lastName", "phoneNumber" FROM "OrderNotLogin";
DROP TABLE "OrderNotLogin";
ALTER TABLE "new_OrderNotLogin" RENAME TO "OrderNotLogin";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
