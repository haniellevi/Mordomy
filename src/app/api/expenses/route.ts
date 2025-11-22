import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { validateMonthEditable } from "@/lib/validation-helpers";

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        const body = await req.json();
        const { monthId, description, totalAmount, paidAmount, dayOfMonth, type } = body;

        const validationError = await validateMonthEditable(monthId, user.id);
        if (validationError) {
            return new NextResponse(validationError.error, { status: validationError.status });
        }

        const lastItem = await prisma.expense.findFirst({
            where: { monthId },
            orderBy: { order: "desc" },
        });

        const newOrder = lastItem ? lastItem.order + 1 : 0;

        const expense = await prisma.expense.create({
            data: {
                monthId,
                description,
                totalAmount: parseFloat(totalAmount),
                paidAmount: paidAmount ? parseFloat(paidAmount) : 0,
                dayOfMonth: dayOfMonth ? parseInt(dayOfMonth) : null,
                order: newOrder,
                type: type || "STANDARD",
            },
        });

        return NextResponse.json(expense);
    } catch (error) {
        console.error("[EXPENSE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
