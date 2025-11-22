import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { updateTithe } from "@/lib/finance-service";
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

        // Get income to find monthId
        const income = await prisma.income.findUnique({
            where: { id },
            select: { monthId: true },
        });

        if (!income) {
            return new NextResponse("Income not found", { status: 404 });
        }

        // Validate month is editable
        const validationError = await validateMonthEditable(income.monthId, user.id);
        if (validationError) {
            return new NextResponse(validationError.error, { status: validationError.status });
        }

        const deletedIncome = await prisma.income.delete({
            where: { id },
        });

        await updateTithe(deletedIncome.monthId);

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
        const { description, amount, dayOfMonth, order } = body;

        // Get income to find monthId
        const existingIncome = await prisma.income.findUnique({
            where: { id },
            select: { monthId: true },
        });

        if (!existingIncome) {
            return new NextResponse("Income not found", { status: 404 });
        }

        // Validate month is editable
        const validationError = await validateMonthEditable(existingIncome.monthId, user.id);
        if (validationError) {
            return new NextResponse(validationError.error, { status: validationError.status });
        }

        const income = await prisma.income.update({
            where: { id },
            data: {
                description,
                amount: amount ? parseFloat(amount) : undefined,
                dayOfMonth: dayOfMonth ? parseInt(dayOfMonth) : undefined,
                order,
            },
        });

        if (amount) {
            await updateTithe(income.monthId);
        }

        return NextResponse.json(income);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
