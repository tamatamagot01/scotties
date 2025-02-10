/*
  Warnings:

  - A unique constraint covering the columns `[userId,orderId,couponId]` on the table `UserCoupon` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserCoupon_userId_couponId_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserCoupon_userId_orderId_couponId_key" ON "UserCoupon"("userId", "orderId", "couponId");
