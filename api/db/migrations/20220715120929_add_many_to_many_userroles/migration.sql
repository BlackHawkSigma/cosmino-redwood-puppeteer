/*
  Warnings:

  - You are about to drop the column `userId` on the `UserRole` table. All the data in the column will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateTable
CREATE TABLE "UserRolesOnUser" (
    "userId" INTEGER NOT NULL,
    "userRoleId" INTEGER NOT NULL,

    PRIMARY KEY ("userId", "userRoleId"),
    CONSTRAINT "UserRolesOnUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserRolesOnUser_userRoleId_fkey" FOREIGN KEY ("userRoleId") REFERENCES "UserRole" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" DATETIME
);
INSERT INTO "new_User" ("hashedPassword", "id", "name", "password", "resetToken", "resetTokenExpiresAt", "salt") SELECT "hashedPassword", "id", "name", "password", "resetToken", "resetTokenExpiresAt", "salt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
CREATE TABLE "new_UserRole" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);
INSERT INTO "new_UserRole" ("id", "name") SELECT "id", "name" FROM "UserRole";
DROP TABLE "UserRole";
ALTER TABLE "new_UserRole" RENAME TO "UserRole";
CREATE UNIQUE INDEX "UserRole_name_key" ON "UserRole"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
