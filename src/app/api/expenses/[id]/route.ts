import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const user = await getCurrentUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        await prisma.expense.delete({
            where: { id: params.id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const user = await getCurrentUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();
        const { description, totalAmount, paidAmount, date, order, type } = body;

        const expense = await prisma.expense.update({
            where: { id: params.id },
            data: {
                description,
                totalAmount: totalAmount ? parseFloat(totalAmount) : undefined,
                paidAmount: paidAmount !== undefined ? parseFloat(paidAmount) : undefined,
                date: date ? new Date(date) : undefined,
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
