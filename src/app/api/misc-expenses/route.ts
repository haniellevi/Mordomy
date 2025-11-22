import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { updateMiscTotal } from "@/lib/finance-service";
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

        const miscExpense = await prisma.miscExpense.create({
            data: {
                monthId,
                description,
                amount: parseFloat(amount),
                dayOfMonth: dayOfMonth ? parseInt(dayOfMonth) : undefined,
            },
        });

        await updateMiscTotal(monthId);

        return NextResponse.json(miscExpense);
    } catch (error) {
        console.error("[MISC_EXPENSE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
