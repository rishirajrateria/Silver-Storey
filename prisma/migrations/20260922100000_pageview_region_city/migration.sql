-- State and city for each page view. Both nullable: the edge headers are
-- absent in local development and on non-Vercel hosts, and existing rows
-- predate the columns entirely.
ALTER TABLE "PageView" ADD COLUMN "region" TEXT;
ALTER TABLE "PageView" ADD COLUMN "city" TEXT;
