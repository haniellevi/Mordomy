import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function POST(req: Request) {
    const user = await getCurrentUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { monthId, description, totalAmount, paidAmount, date, type } = await req.json();

        if (!monthId || !description || !totalAmount) {
            return new NextResponse("Missing required fields", { status: 400 });
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
                date: date ? new Date(date) : null,
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
