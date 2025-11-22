import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { canDeleteMonth } from "@/lib/month-utils";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
        }

        const { id } = await params;

        // Find the month
        const month = await prisma.month.findUnique({
            where: { id },
        });

        if (!month) {
            return NextResponse.json({ error: "Mês não encontrado" }, { status: 404 });
        }

        // Check if user owns this month
        if (month.userId !== user.id) {
            return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
        }

        // Check if month can be deleted (must be in the future)
        if (!canDeleteMonth(month.year, month.month)) {
            return NextResponse.json(
                { error: "Não é possível excluir este mês. Você só pode excluir meses que ainda não iniciaram." },
                { status: 400 }
            );
        }

        // Delete the month (cascade will delete related records)
        await prisma.month.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: "Mês excluído com sucesso" });
    } catch (error) {
        console.error("Error deleting month:", error);
        return NextResponse.json(
            { error: "Erro ao excluir mês" },
            { status: 500 }
        );
    }
}
