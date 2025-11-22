import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { updateInvestmentTotal } from "@/lib/finance-service";
import { validateMonthEditable } from "@/lib/validation-helpers";

export async function POST(req: Request) {
    const user = await getCurrentUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { monthId, description, amount, dayOfMonth } = await req.json();

        if (!monthId || !description || !amount) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Validate month is editable
        const validationError = await validateMonthEditable(monthId, user.id);
        if (validationError) {
            return new NextResponse(validationError.error, { status: validationError.status });
        }

        const investment = await prisma.investment.create({
            data: {
                monthId,
                description,
                amount: parseFloat(amount),
                dayOfMonth: dayOfMonth ? parseInt(dayOfMonth) : undefined,
            },
        });

        await updateInvestmentTotal(monthId);

        return NextResponse.json(investment);
    } catch (error) {
        console.error("[INVESTMENT_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
