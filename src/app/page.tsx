import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/landing");
    }

    // Tentar encontrar o último mês acessado ou o mais recente
    const latestMonth = await prisma.month.findFirst({
        where: { userId: user.id },
        orderBy: [
            { year: 'desc' },
            { month: 'desc' }
        ]
    });

    if (latestMonth) {
        redirect(`/${latestMonth.year}/${latestMonth.month}`);
    }

    // Se não houver nenhum mês, criar o mês atual
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    try {
        await prisma.month.create({
            data: {
                userId: user.id,
                year: currentYear,
                month: currentMonth,
            }
        });
        redirect(`/${currentYear}/${currentMonth}`);
    } catch (error) {
        // Se der erro (ex: race condition), tentar redirecionar mesmo assim
        // ou redirecionar para uma página de erro
        console.error("Erro ao criar mês inicial:", error);
        // Fallback para landing se tudo falhar
        redirect("/landing");
    }
}
