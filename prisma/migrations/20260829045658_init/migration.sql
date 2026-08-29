-- AlterTable
ALTER TABLE "College" ADD COLUMN     "brochureUrl" TEXT,
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'India';

-- CreateIndex
CREATE INDEX "College_country_idx" ON "College"("country");
