-- CreateTable
CREATE TABLE "Budget" (
    "id" SERIAL NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,
    "savings" DOUBLE PRECISION NOT NULL,
    "offering" DOUBLE PRECISION NOT NULL,
    "utilities" DOUBLE PRECISION NOT NULL,
    "relationship" DOUBLE PRECISION NOT NULL,
    "relationshipSavings" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);
