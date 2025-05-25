-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('EMAIL', 'LINKEDIN');

-- CreateEnum
CREATE TYPE "MessagePurpose" AS ENUM ('PARTNERSHIP', 'PRODUCT');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "linkedinUrl" TEXT NOT NULL,
    "title" TEXT,
    "company" TEXT,
    "bio" TEXT,
    "location" TEXT,
    "experience" TEXT,
    "skills" TEXT[],
    "contentItems" JSONB,
    "partnershipBenefits" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "messageContent" TEXT NOT NULL,
    "messageType" "MessageType" NOT NULL,
    "purpose" "MessagePurpose" NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'PENDING',
    "profileId" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_username_key" ON "profiles"("username");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
