/*
  Warnings:

  - Changed the type of `tag` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "tag" AS ENUM ('FASHION', 'ELECTRONICS', 'KITCHENWARE');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "tag",
ADD COLUMN     "tag" "tag" NOT NULL;
