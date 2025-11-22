import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { updateTithe } from "@/lib/finance-service";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const user = await getCurrentUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const deletedIncome = await prisma.income.delete({
            where: { id: params.id },
        });

        await updateTithe(deletedIncome.monthId);

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
        const { description, amount, date, order } = body;

        const income = await prisma.income.update({
            where: { id: params.id },
            data: {
                description,
                amount: amount ? parseFloat(amount) : undefined,
                date: date ? new Date(date) : undefined,
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
