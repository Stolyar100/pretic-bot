-- CreateEnum
CREATE TYPE "TGBotOfferStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "TGBotEmployee" (
    "TabNumber" VARCHAR(4) NOT NULL,
    "FullName" TEXT NOT NULL,
    "IsAdmin" BOOLEAN NOT NULL DEFAULT false,
    "Phone" TEXT,

    CONSTRAINT "TGBotEmployee_pkey" PRIMARY KEY ("TabNumber")
);

-- CreateTable
CREATE TABLE "TGBotUser" (
    "TelegramId" INTEGER NOT NULL,
    "EmployeeTabNumber" VARCHAR(4) NOT NULL,

    CONSTRAINT "TGBotUser_pkey" PRIMARY KEY ("TelegramId")
);

-- CreateTable
CREATE TABLE "TGBotOffer" (
    "Id" SERIAL NOT NULL,
    "ShortName" VARCHAR(70) NOT NULL,
    "Status" "TGBotOfferStatus" NOT NULL DEFAULT 'PENDING',
    "AuthorId" INTEGER NOT NULL,
    "CreationDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TGBotOffer_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TGBotUser_EmployeeTabNumber_key" ON "TGBotUser"("EmployeeTabNumber");

-- AddForeignKey
ALTER TABLE "TGBotUser" ADD CONSTRAINT "TGBotUser_EmployeeTabNumber_fkey" FOREIGN KEY ("EmployeeTabNumber") REFERENCES "TGBotEmployee"("TabNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TGBotOffer" ADD CONSTRAINT "TGBotOffer_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "TGBotUser"("TelegramId") ON DELETE CASCADE ON UPDATE CASCADE;
