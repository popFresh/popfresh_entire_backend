CREATE TABLE "PasswordReset" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordReset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PasswordReset_token_key"
ON "PasswordReset"("token");

ALTER TABLE "PasswordReset"
ADD CONSTRAINT "PasswordReset_adminId_fkey"
FOREIGN KEY ("adminId")
REFERENCES "Admin"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;