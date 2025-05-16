/*
  Warnings:

  - You are about to drop the column `layout` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the column `templateId` on the `Portfolio` table. All the data in the column will be lost.
  - You are about to drop the `Template` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Portfolio" DROP CONSTRAINT "Portfolio_templateId_fkey";

-- DropIndex
DROP INDEX "Portfolio_templateId_idx";

-- AlterTable
ALTER TABLE "Portfolio" DROP COLUMN "layout",
DROP COLUMN "templateId",
ADD COLUMN     "htmlContent" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "s3Key" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileImage" TEXT;

-- DropTable
DROP TABLE "Template";
