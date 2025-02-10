-- CreateTable
CREATE TABLE "Review" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "productOptionId" INTEGER NOT NULL,
    "ratingScore" INTEGER NOT NULL,
    "reviewContent" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Review_productOptionId_fkey" FOREIGN KEY ("productOptionId") REFERENCES "ProductOption" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
