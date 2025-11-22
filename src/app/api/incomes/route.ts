import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { updateTithe } from "@/lib/finance-service";

export async function POST(req: Request) {
    const user = await getCurrentUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { monthId, description, amount, date } = await req.json();

        if (!monthId || !description || !amount || !date) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        // Get the current max order to append to the end
        const lastItem = await prisma.income.findFirst({
            where: { monthId },
            orderBy: { order: "desc" },
        });

        const newOrder = lastItem ? lastItem.order + 1 : 0;

        const income = await prisma.income.create({
            data: {
                monthId,
                description,
                amount: parseFloat(amount),
                date: new Date(date),
                order: newOrder,
            },
        });

        // Update Tithe
        await updateTithe(monthId);

        return NextResponse.json(income);
    } catch (error) {
        console.error("[INCOME_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
