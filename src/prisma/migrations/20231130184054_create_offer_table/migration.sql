-- CreateEnum
CREATE TYPE "TGBotOfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "TGBotOffer" (
    "Id" SERIAL NOT NULL,
    "ShortName" VARCHAR(70) NOT NULL,
    "Status" "TGBotOfferStatus" NOT NULL DEFAULT 'PENDING',
    "AuthorId" INTEGER NOT NULL,
    "CreationDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TGBotOffer_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "TGBotOffer" ADD CONSTRAINT "TGBotOffer_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "TGBotUser"("TelegramId") ON DELETE RESTRICT ON UPDATE CASCADE;
