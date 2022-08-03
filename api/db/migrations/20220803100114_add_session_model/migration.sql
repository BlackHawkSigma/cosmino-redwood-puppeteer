-- CreateTable
CREATE TABLE "Session" (
    "userId" INTEGER NOT NULL,
    "terminal" TEXT NOT NULL,
    "busy" BOOLEAN NOT NULL,
    "focused" BOOLEAN NOT NULL,
    "lastSuccessImgUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("userId", "terminal"),
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_key" ON "Session"("userId");
