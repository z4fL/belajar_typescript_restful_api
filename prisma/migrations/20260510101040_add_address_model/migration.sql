-- CreateEnum
CREATE TYPE "LabelContact" AS ENUM ('HOME', 'OFFICE', 'CAMPUS');

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "label" "LabelContact" NOT NULL DEFAULT 'HOME',
    "street" VARCHAR(255),
    "city" VARCHAR(100),
    "province" VARCHAR(100),
    "country" VARCHAR(100) NOT NULL,
    "postalCode" VARCHAR(10) NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "contactId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
