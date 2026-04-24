/*
  Warnings:

  - Made the column `bloodType` on table `Patient` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'DISCONTINUED';

-- AlterTable
ALTER TABLE "Patient" ALTER COLUMN "bloodType" SET NOT NULL;
