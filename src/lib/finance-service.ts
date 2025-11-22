import { prisma } from "@/lib/prisma";

export async function updateTithe(monthId: string) {
    // 1. Calculate Total Income
    const incomes = await prisma.income.findMany({
        where: { monthId },
    });

    const totalIncome = incomes.reduce((acc, item) => acc + Number(item.amount), 0);
    const titheAmount = totalIncome * 0.1;

    // 2. Find existing Tithe expense
    const titheExpense = await prisma.expense.findFirst({
        where: {
            monthId,
            type: "TITHE",
        },
    });

    if (titheExpense) {
        // Update existing
        await prisma.expense.update({
            where: { id: titheExpense.id },
            data: {
                totalAmount: titheAmount,
            },
        });
    } else {
        // Create new Tithe expense
        await prisma.expense.create({
            data: {
                monthId,
                description: "Dízimo",
                totalAmount: titheAmount,
                type: "TITHE",
                order: 0, // Put it at the very top
            },
        });
    }
}

export async function updateInvestmentTotal(monthId: string) {
    const investments = await prisma.investment.findMany({
        where: { monthId },
    });

    const totalAmount = investments.reduce((acc, item) => acc + Number(item.amount), 0);

    const expense = await prisma.expense.findFirst({
        where: { monthId, type: "INVESTMENT_TOTAL" },
    });

    if (expense) {
        await prisma.expense.update({
            where: { id: expense.id },
            data: { totalAmount },
        });
    } else if (totalAmount > 0) {
        await prisma.expense.create({
            data: {
                monthId,
                description: "Total em Investimentos",
                totalAmount,
                type: "INVESTMENT_TOTAL",
                order: 998, // Put it near the bottom
            },
        });
    }
}

export async function updateMiscTotal(monthId: string) {
    const miscExpenses = await prisma.miscExpense.findMany({
        where: { monthId },
    });

    const totalAmount = miscExpenses.reduce((acc, item) => acc + Number(item.amount), 0);

    const expense = await prisma.expense.findFirst({
        where: { monthId, type: "MISC_TOTAL" },
    });

    if (expense) {
        await prisma.expense.update({
            where: { id: expense.id },
            data: { totalAmount },
        });
    } else if (totalAmount > 0) {
        await prisma.expense.create({
            data: {
                monthId,
                description: "Total em Gastos Avulsos",
                totalAmount,
                type: "MISC_TOTAL",
                order: 999, // Put it at the bottom
            },
        });
    }
}
