import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { updateMiscTotal } from "@/lib/finance-service";
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

        // Get misc expense to find monthId
        const miscExpense = await prisma.miscExpense.findUnique({
            where: { id },
            select: { monthId: true },
        });

        if (!miscExpense) {
            return new NextResponse("Misc expense not found", { status: 404 });
        }

        // Validate month is editable
        const validationError = await validateMonthEditable(miscExpense.monthId, user.id);
        if (validationError) {
            return new NextResponse(validationError.error, { status: validationError.status });
        }

        const deletedMisc = await prisma.miscExpense.delete({
            where: { id },
        });

        await updateMiscTotal(deletedMisc.monthId);

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
        const { description, amount, dayOfMonth } = body;

        // Get misc expense to find monthId
        const existingMiscExpense = await prisma.miscExpense.findUnique({
            where: { id },
            select: { monthId: true },
        });

        if (!existingMiscExpense) {
            return new NextResponse("Misc expense not found", { status: 404 });
        }

        // Validate month is editable
        const validationError = await validateMonthEditable(existingMiscExpense.monthId, user.id);
        if (validationError) {
            return new NextResponse(validationError.error, { status: validationError.status });
        }

        const miscExpense = await prisma.miscExpense.update({
            where: { id },
            data: {
                description,
                amount: amount ? parseFloat(amount) : undefined,
                dayOfMonth: dayOfMonth ? parseInt(dayOfMonth) : undefined,
            },
        });

        if (amount) {
            await updateMiscTotal(miscExpense.monthId);
        }

        return NextResponse.json(miscExpense);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
