-- AlterTable
ALTER TABLE "GalleryImage" ADD COLUMN     "roomType" TEXT;

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "city" TEXT,
ADD COLUMN     "details" JSONB,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'contact';

-- AlterTable
ALTER TABLE "ProjectPage" ADD COLUMN     "afterImageUrl" TEXT,
ADD COLUMN     "areaSqft" INTEGER,
ADD COLUMN     "beforeImageUrl" TEXT,
ADD COLUMN     "budget" TEXT,
ADD COLUMN     "clientName" TEXT,
ADD COLUMN     "clientQuote" TEXT,
ADD COLUMN     "durationDays" INTEGER,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "materials" TEXT,
ADD COLUMN     "propertyType" TEXT,
ADD COLUMN     "style" TEXT,
ADD COLUMN     "summary" TEXT;

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT,
    "projectType" TEXT,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "quote" TEXT NOT NULL,
    "imageUrl" TEXT,
    "source" TEXT NOT NULL DEFAULT 'direct',
    "sourceUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lookbook" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "roomType" TEXT,
    "fileUrl" TEXT NOT NULL,
    "coverImageUrl" TEXT,
    "pages" INTEGER,
    "downloads" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lookbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientProject" (
    "id" TEXT NOT NULL,
    "accessCode" TEXT NOT NULL,
    "phoneLast4" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "city" TEXT,
    "currentStep" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP(3),
    "expectedHandover" TIMESTAMP(3),
    "projectManager" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectUpdate" (
    "id" TEXT NOT NULL,
    "clientProjectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "imageUrl" TEXT,
    "step" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Testimonial_published_order_idx" ON "Testimonial"("published", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Lookbook_slug_key" ON "Lookbook"("slug");

-- CreateIndex
CREATE INDEX "Lookbook_published_order_idx" ON "Lookbook"("published", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProject_accessCode_key" ON "ClientProject"("accessCode");

-- CreateIndex
CREATE INDEX "ClientProject_status_updatedAt_idx" ON "ClientProject"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "ProjectUpdate_clientProjectId_createdAt_idx" ON "ProjectUpdate"("clientProjectId", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_kind_createdAt_idx" ON "Lead"("kind", "createdAt");

-- AddForeignKey
ALTER TABLE "ProjectUpdate" ADD CONSTRAINT "ProjectUpdate_clientProjectId_fkey" FOREIGN KEY ("clientProjectId") REFERENCES "ClientProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
