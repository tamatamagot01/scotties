-- CreateTable
CREATE TABLE "OnlineAdmin" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "adminId" INTEGER NOT NULL,
    CONSTRAINT "OnlineAdmin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "OnlineAdmin_adminId_key" ON "OnlineAdmin"("adminId");
