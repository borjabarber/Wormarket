-- CreateTable
CREATE TABLE "dimensions" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "currencyName" TEXT NOT NULL,
    "exchangeRate" DOUBLE PRECISION NOT NULL,
    "shippingRules" TEXT NOT NULL,
    "forbiddenObjects" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dimensions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dimensions_slug_key" ON "dimensions"("slug");

-- CreateIndex
CREATE INDEX "dimensions_name_idx" ON "dimensions"("name");
