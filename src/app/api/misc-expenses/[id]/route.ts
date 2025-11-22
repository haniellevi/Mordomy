import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { updateMiscTotal } from "@/lib/finance-service";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const user = await getCurrentUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const deletedMisc = await prisma.miscExpense.delete({
            where: { id: params.id },
        });

        await updateMiscTotal(deletedMisc.monthId);

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
        const { description, amount, date } = body;

        const miscExpense = await prisma.miscExpense.update({
            where: { id: params.id },
            data: {
                description,
                amount: amount ? parseFloat(amount) : undefined,
                date: date ? new Date(date) : undefined,
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
