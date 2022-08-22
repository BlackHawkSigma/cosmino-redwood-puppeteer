/*
  Warnings:

  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `busy` to the `Terminal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `focused` to the `Terminal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Terminal` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_userId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Session";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Terminal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    "busy" BOOLEAN NOT NULL,
    "focused" BOOLEAN NOT NULL,
    "lastSuccessImgUrl" TEXT,
    "loggedInAt" DATETIME,
    CONSTRAINT "Terminal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Terminal" ("name") SELECT "name" FROM "Terminal";
DROP TABLE "Terminal";
ALTER TABLE "new_Terminal" RENAME TO "Terminal";
CREATE UNIQUE INDEX "Terminal_name_key" ON "Terminal"("name");
CREATE UNIQUE INDEX "Terminal_userId_key" ON "Terminal"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
