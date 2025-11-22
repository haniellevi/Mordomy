import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { validateMonthEditable } from "@/lib/validation-helpers";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { id } = await params;

        // Get expense to find monthId
        const expense = await prisma.expense.findUnique({
            where: { id },
            select: { monthId: true },
        });

        if (!expense) {
            return new NextResponse("Expense not found", { status: 404 });
        }

        // Validate month is editable
        const validationError = await validateMonthEditable(expense.monthId, user.id);
        if (validationError) {
            return new NextResponse(validationError.error, { status: validationError.status });
        }

        await prisma.expense.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();
        const { description, totalAmount, paidAmount, dayOfMonth, order, type } = body;

        // Get expense to find monthId
        const existingExpense = await prisma.expense.findUnique({
            where: { id },
            select: { monthId: true },
        });

        if (!existingExpense) {
            return new NextResponse("Expense not found", { status: 404 });
        }

        // Validate month is editable
        const validationError = await validateMonthEditable(existingExpense.monthId, user.id);
        if (validationError) {
            return new NextResponse(validationError.error, { status: validationError.status });
        }

        const expense = await prisma.expense.update({
            where: { id },
            data: {
                description,
                totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
                paidAmount: paidAmount !== undefined ? parseFloat(paidAmount) : undefined,
                dayOfMonth: dayOfMonth ? parseInt(dayOfMonth) : undefined,
                order,
                type,
            },
        });

        return NextResponse.json(expense);
    } catch (error) {
        console.error("[EXPENSE_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
