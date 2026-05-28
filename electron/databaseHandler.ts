import { prisma } from "../prisma/client.ts";

interface Budget {
    id?: number;
    salary: number;
    savings: number;
    offering: number;
    utilities: number;
    relationship: number;
    relationshipSavings: number;
}

async function updateBudget(data: Budget) {
    if (!data.id) {
        throw new Error("Entry ID is required");
    }

    return await prisma.budget.update({
        where: {
            id: 10,
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
    updateBudget,
};