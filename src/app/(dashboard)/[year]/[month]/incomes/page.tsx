import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { IncomeTable } from "@/components/finance/income-table";
import { AddIncomeDialog } from "@/components/finance/add-income-dialog";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface IncomesPageProps {
    params: Promise<{
        year: string;
        month: string;
    }>;
}

export default async function IncomesPage({ params }: IncomesPageProps) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const { year: yearStr, month: monthStr } = await params;
    const year = parseInt(yearStr);
    const month = parseInt(monthStr);

    const monthData = await prisma.month.findFirst({
        where: {
            userId: user.id,
            year: year,
            month: month,
        },
        include: {
            incomes: { orderBy: { order: "asc" } },
        },
    });

    if (!monthData) {
        redirect("/");
    }

    const totalIncome = monthData.incomes.reduce((sum, income) => sum + Number(income.amount), 0);

    // Converter Decimal para number para Client Components
    const incomesData = monthData.incomes.map(inc => ({
        ...inc,
        amount: Number(inc.amount),
    }));

    return (
        <>
            <div className="container mx-auto p-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Entradas</h1>
                    <AddIncomeDialog monthId={monthData.id} />
                </div>

                <Card className="bg-accent-green/10 border-accent-green/20">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total de Entradas
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-accent-green">
                            {formatCurrency(totalIncome)}
                        </p>
                    </CardContent>
                </Card>

                <IncomeTable incomes={incomesData} />
            </div>

            <BottomNav year={yearStr} month={monthStr} />
        </>
    );
}
