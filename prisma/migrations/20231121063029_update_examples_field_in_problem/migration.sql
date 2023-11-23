/*
  Warnings:

  - You are about to drop the column `explanation` on the `Problem` table. All the data in the column will be lost.
  - Added the required column `examples` to the `Problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "explanation",
ADD COLUMN     "examples" JSONB NOT NULL;
