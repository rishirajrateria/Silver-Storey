-- Category.slug: added nullable, backfilled from the existing names, then
-- locked down. Doing it in one step would fail on any database that already
-- holds categories, which is every deployed site.

ALTER TABLE "Category" ADD COLUMN "slug" TEXT;

-- "Living Room" -> "living-room"
UPDATE "Category"
SET "slug" = trim(BOTH '-' FROM regexp_replace(lower("name"), '[^a-z0-9]+', '-', 'g'));

-- A name with no usable characters leaves an empty slug; fall back to the id.
UPDATE "Category" SET "slug" = "id" WHERE "slug" IS NULL OR "slug" = '';

-- Two categories can share a name, and the column is about to become unique:
-- keep the first and suffix the rest, the same way uniqueSlug() does.
WITH numbered AS (
  SELECT "id",
         "slug",
         ROW_NUMBER() OVER (
           PARTITION BY "slug" ORDER BY "order", "createdAt", "id"
         ) AS position
  FROM "Category"
)
UPDATE "Category" AS c
SET "slug" = numbered."slug" || '-' || numbered.position
FROM numbered
WHERE c."id" = numbered."id" AND numbered.position > 1;

ALTER TABLE "Category" ALTER COLUMN "slug" SET NOT NULL;

CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateTable
CREATE TABLE "CategoryImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT,
    "price" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "CategoryImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CategoryImage_categoryId_order_idx" ON "CategoryImage"("categoryId", "order");

-- AddForeignKey
ALTER TABLE "CategoryImage" ADD CONSTRAINT "CategoryImage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
