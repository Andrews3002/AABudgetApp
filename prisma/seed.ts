import { prisma } from "../prisma/client.ts";

const ID = 1;

async function main() {
    // await prisma.budget.create({
    //     data: {
    //         salary: 1200.00,
    //         savings: 20,
    //         offering: 20,
    //         utilities: 20,
    //         relationship: 20,
    //         relationshipSavings: 20,
    //     }
    // });

    // await prisma.savingAllocation.create({
    //     data: {
    //         emergency: 25,
    //         safe: 25,
    //         risky: 25,
    //         wants: 25,
    //     }
    // });

    const data = await prisma.budget.findFirst({
        where: {
            id: ID,
        },
    });
    const data2 = await prisma.savingAllocation.findFirst({
        where: {
            id: ID,
        }
    })
    console.log("budget = ", data);
    console.log("saving allocations = ", data2);
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
