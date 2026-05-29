-- AlterTable
ALTER TABLE "Budget" ALTER COLUMN "salary" DROP DEFAULT,
ALTER COLUMN "savings" DROP DEFAULT,
ALTER COLUMN "offering" DROP DEFAULT,
ALTER COLUMN "utilities" DROP DEFAULT,
ALTER COLUMN "relationship" DROP DEFAULT,
ALTER COLUMN "relationshipSavings" DROP DEFAULT;

-- CreateTable
CREATE TABLE "SavingAllocation" (
    "id" SERIAL NOT NULL,
    "emergency" DOUBLE PRECISION NOT NULL,
    "safe" DOUBLE PRECISION NOT NULL,
    "risky" DOUBLE PRECISION NOT NULL,
    "wants" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SavingAllocation_pkey" PRIMARY KEY ("id")
);
