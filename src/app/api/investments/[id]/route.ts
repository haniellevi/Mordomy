import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { updateInvestmentTotal } from "@/lib/finance-service";
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

        // Get investment to find monthId
        const investment = await prisma.investment.findUnique({
            where: { id },
            select: { monthId: true },
        });

        if (!investment) {
            return new NextResponse("Investment not found", { status: 404 });
        }

        // Validate month is editable
        const validationError = await validateMonthEditable(investment.monthId, user.id);
        if (validationError) {
            return new NextResponse(validationError.error, { status: validationError.status });
        }

        const deletedInvestment = await prisma.investment.delete({
            where: { id },
        });

        await updateInvestmentTotal(deletedInvestment.monthId);

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

        // Get investment to find monthId
        const existingInvestment = await prisma.investment.findUnique({
            where: { id },
            select: { monthId: true },
        });

        if (!existingInvestment) {
            return new NextResponse("Investment not found", { status: 404 });
        }

        // Validate month is editable
        const validationError = await validateMonthEditable(existingInvestment.monthId, user.id);
        if (validationError) {
            return new NextResponse(validationError.error, { status: validationError.status });
        }

        const investment = await prisma.investment.update({
            where: { id },
            data: {
                description,
                amount: amount ? parseFloat(amount) : undefined,
                dayOfMonth: dayOfMonth ? parseInt(dayOfMonth) : undefined,
            },
        });

        if (amount) {
            await updateInvestmentTotal(investment.monthId);
        }

        return NextResponse.json(investment);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
