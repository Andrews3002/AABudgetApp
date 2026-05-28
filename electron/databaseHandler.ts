import { prisma } from "../prisma/client.ts";

const ID = 10;

interface Budget {
    id?: number;
    salary: number;
    savings: number;
    offering: number;
    utilities: number;
    relationship: number;
    relationshipSavings: number;
}

async function getBudget(){
    const data = await prisma.budget.findFirst({
        where: {
            id: ID,
        },
    });

    return data;
}

async function updateBudget(data: Budget) {
    if (!data.id) {
        throw new Error("Entry ID is required");
    }

    return await prisma.budget.update({
        where: {
            id: ID,
        },

        data: {
            salary: data.salary,
            savings: data.savings,
            offering: data.offering,
            utilities: data.utilities,
            relationship: data.relationship,
            relationshipSavings: data.relationshipSavings,
        },
    });
}

export default {
    getBudget,
    updateBudget,
};