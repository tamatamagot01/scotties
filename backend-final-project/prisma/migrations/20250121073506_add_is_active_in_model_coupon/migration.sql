/*
  Warnings:

  - Added the required column `isActive` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coupon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "couponName" TEXT NOT NULL,
    "couponCode" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Coupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Coupon" ("couponCode", "couponName", "discount", "id", "userId") SELECT "couponCode", "couponName", "discount", "id", "userId" FROM "Coupon";
DROP TABLE "Coupon";
ALTER TABLE "new_Coupon" RENAME TO "Coupon";
CREATE UNIQUE INDEX "Coupon_couponName_key" ON "Coupon"("couponName");
CREATE UNIQUE INDEX "Coupon_couponCode_key" ON "Coupon"("couponCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
