/*
  Warnings:

  - Added the required column `ownerId` to the `Bag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "User" ("email") VALUES ('durand.sulyvan@gmail.com');

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bag" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Bag_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Bag" ("ownerId","createdAt", "id", "name", "updatedAt") SELECT (SELECT id FROM "User" WHERE email='durand.sulyvan@gmail.com'), "createdAt", "id", "name", "updatedAt" FROM "Bag";
DROP TABLE "Bag";
ALTER TABLE "new_Bag" RENAME TO "Bag";
CREATE UNIQUE INDEX "Bag_ownerId_name_key" ON "Bag"("ownerId", "name");
CREATE TABLE "new_Item" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ownerId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "weightGrams" INTEGER NOT NULL DEFAULT 0,
    "category" TEXT NOT NULL,
    "ownedQuantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Item_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Item" ("ownerId", "category", "createdAt", "id", "name", "ownedQuantity", "updatedAt", "weightGrams") SELECT (SELECT id FROM "User" WHERE email='durand.sulyvan@gmail.com'), "category", "createdAt", "id", "name", "ownedQuantity", "updatedAt", "weightGrams" FROM "Item";
DROP TABLE "Item";
ALTER TABLE "new_Item" RENAME TO "Item";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
