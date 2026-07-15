-- CreateTable
CREATE TABLE "identity_accounts" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "refreshTokenHash" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identity_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "identity_accounts_email_key" ON "identity_accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "identity_accounts_userId_key" ON "identity_accounts"("userId");

-- CreateIndex
CREATE INDEX "identity_accounts_userId_idx" ON "identity_accounts"("userId");

-- AddForeignKey
ALTER TABLE "identity_accounts" ADD CONSTRAINT "identity_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
