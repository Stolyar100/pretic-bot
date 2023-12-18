-- DropForeignKey
ALTER TABLE "TGBotOffer" DROP CONSTRAINT "TGBotOffer_AuthorId_fkey";

-- AddForeignKey
ALTER TABLE "TGBotOffer" ADD CONSTRAINT "TGBotOffer_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "TGBotUser"("TelegramId") ON DELETE CASCADE ON UPDATE CASCADE;
