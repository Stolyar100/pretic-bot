/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "Profile";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "TGBotEmployee" (
    "TabNumber" VARCHAR(4) NOT NULL,
    "FullName" TEXT NOT NULL,
    "Phone" TEXT,
    "TelegramId" INTEGER,

    CONSTRAINT "TGBotEmployee_pkey" PRIMARY KEY ("TabNumber")
);

-- CreateTable
CREATE TABLE "TGBotUser" (
    "TelegramId" INTEGER NOT NULL,

    CONSTRAINT "TGBotUser_pkey" PRIMARY KEY ("TelegramId")
);

-- CreateIndex
CREATE UNIQUE INDEX "TGBotEmployee_TelegramId_key" ON "TGBotEmployee"("TelegramId");

-- AddForeignKey
ALTER TABLE "TGBotUser" ADD CONSTRAINT "TGBotUser_TelegramId_fkey" FOREIGN KEY ("TelegramId") REFERENCES "TGBotEmployee"("TelegramId") ON DELETE RESTRICT ON UPDATE CASCADE;
