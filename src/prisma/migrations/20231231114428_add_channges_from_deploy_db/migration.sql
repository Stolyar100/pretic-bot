-- AlterTable
ALTER TABLE "TGBotEmployee" ADD COLUMN     "TelegramId" INTEGER,
ALTER COLUMN "FullName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TGBotOffer" ALTER COLUMN "CreationDate" SET DATA TYPE TIMESTAMP(6);
