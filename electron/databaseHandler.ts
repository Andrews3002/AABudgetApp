import { prisma } from "../prisma/client.ts";

const ID = 1;

interface Budget {
    id?: number;
    salary: number;
    savings: number;
    offering: number;
    utilities: number;
    relationship: number;
    relationshipSavings: number;
}

interface SavingAllocation {
    id?: number;
    emergency: number;
    safe: number;
    risky: number;
    wants: number;
}

async function getBudget() {
    const data = await prisma.budget.findFirst({
        where: {
            id: ID,
        },
    });

    return data;
}

async function getSavingAllocation() {
    const data = await prisma.savingAllocation.findFirst({
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

async function updateSavingAllocation(data: SavingAllocation) {
    if (!data.id) {
        throw new Error("Entry ID is required");
    }

    return await prisma.savingAllocation.update({
        where: {
            id: ID,
        },

        data: {
            emergency: data.emergency,
            safe: data.safe,
            risky: data.risky,
            wants: data.wants,
        },
    });
}

export default {
    getBudget,
    getSavingAllocation,
    updateBudget,
    updateSavingAllocation,
};
