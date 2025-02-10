/*
  Warnings:

  - You are about to drop the column `userId` on the `Coupon` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_CouponToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_CouponToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Coupon" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CouponToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coupon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "couponName" TEXT NOT NULL,
    "couponCode" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL
);
INSERT INTO "new_Coupon" ("couponCode", "couponName", "discount", "id", "isActive") SELECT "couponCode", "couponName", "discount", "id", "isActive" FROM "Coupon";
DROP TABLE "Coupon";
ALTER TABLE "new_Coupon" RENAME TO "Coupon";
CREATE UNIQUE INDEX "Coupon_couponName_key" ON "Coupon"("couponName");
CREATE UNIQUE INDEX "Coupon_couponCode_key" ON "Coupon"("couponCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_CouponToUser_AB_unique" ON "_CouponToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_CouponToUser_B_index" ON "_CouponToUser"("B");
