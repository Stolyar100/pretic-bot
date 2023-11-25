/*
  Warnings:

  - You are about to drop the column `TelegramId` on the `TGBotEmployee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[EmployeeTabNumber]` on the table `TGBotUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `EmployeeTabNumber` to the `TGBotUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TGBotUser" DROP CONSTRAINT "TGBotUser_TelegramId_fkey";

-- DropIndex
DROP INDEX "TGBotEmployee_TelegramId_key";

-- AlterTable
ALTER TABLE "TGBotEmployee" DROP COLUMN "TelegramId";

-- AlterTable
ALTER TABLE "TGBotUser" ADD COLUMN     "EmployeeTabNumber" VARCHAR(4) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TGBotUser_EmployeeTabNumber_key" ON "TGBotUser"("EmployeeTabNumber");

-- AddForeignKey
ALTER TABLE "TGBotUser" ADD CONSTRAINT "TGBotUser_EmployeeTabNumber_fkey" FOREIGN KEY ("EmployeeTabNumber") REFERENCES "TGBotEmployee"("TabNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
