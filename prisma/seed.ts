import { prisma } from "./client";

interface Budget {
    id?: number;
    salary: number;
    savings: number;
    offering: number;
    utilities: number;
    relationship: number;
    relationshipSavings: number;
}

async function main() {
    await prisma.budget.create({
        data: {
            salary: 1200.00,
            savings: 0.2,
            offering: 0.2,
            utilities: 0.2,
            relationship: 0.2,
            relationshipSavings: 0.2,
        }
    });

    const data = await prisma.budget.findFirst({
        where: {
            id: 6
        }
    });
    console.log("salary = ",data);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
