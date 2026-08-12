-- AlterTable
ALTER TABLE "public"."Inquiry" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Inquiry_isRead_createdAt_idx" ON "public"."Inquiry"("isRead", "createdAt");
