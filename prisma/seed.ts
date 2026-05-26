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
    const budget = await prisma.budget.create({
        data: {
            salary: 1200.00,
            savings: 0.2,
            offering: 0.2,
            utilities: 0.2,
            relationship: 0.2,
            relationshipSavings: 0.2,
        }
    });
    console.log("Created budget:", budget);

    const data = await prisma.budget.findFirst({
        where: {
            id: 1
        }
    });
    console.log("salary = ",data?.salary);
    console.log("savings = ",data?.savings * data?.salary);
    console.log("utilities = ",data?.utilities * data?.salary);
    console.log("relationship = ",data?.relationship * data?.salary);
    console.log("relationshipSavings = ",data?.relationshipSavings * data?.salary);
    console.log("offering = ",data?.offering * data?.salary);
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
