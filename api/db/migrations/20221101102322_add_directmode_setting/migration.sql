-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" DATETIME,
    "showSuccessCounter" BOOLEAN NOT NULL DEFAULT true,
    "directMode" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("hashedPassword", "id", "name", "password", "resetToken", "resetTokenExpiresAt", "salt", "showSuccessCounter") SELECT "hashedPassword", "id", "name", "password", "resetToken", "resetTokenExpiresAt", "salt", "showSuccessCounter" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
