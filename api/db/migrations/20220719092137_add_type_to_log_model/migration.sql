-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Log" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "terminal" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'success',
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Log" ("code", "createdAt", "id", "message", "terminal", "userId") SELECT "code", "createdAt", "id", "message", "terminal", "userId" FROM "Log";
DROP TABLE "Log";
ALTER TABLE "new_Log" RENAME TO "Log";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
