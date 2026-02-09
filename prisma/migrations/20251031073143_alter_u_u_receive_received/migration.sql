/*
  Warnings:

  - You are about to drop the column `receiveEmail` on the `UserPreference` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserPreference" DROP COLUMN "receiveEmail",
ADD COLUMN     "receivedEmail" BOOLEAN NOT NULL DEFAULT false;
