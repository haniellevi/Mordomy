import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { MiscExpenseTable } from "@/components/finance/misc-expense-table";
import { AddMiscExpenseDialog } from "@/components/finance/add-misc-expense-dialog";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface MiscExpensesPageProps {
    params: Promise<{
        year: string;
        month: string;
    }>;
}

export default async function MiscExpensesPage({ params }: MiscExpensesPageProps) {
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
            miscExpenses: true,
        },
    });

    if (!monthData) {
        redirect("/");
    }

    const totalMiscExpenses = monthData.miscExpenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
    );

    // Converter Decimal para number para Client Components
    const miscExpensesData = monthData.miscExpenses.map(exp => ({
        ...exp,
        amount: Number(exp.amount),
    }));

    return (
        <>
            <div className="container mx-auto p-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gastos Avulsos</h1>
                    <AddMiscExpenseDialog monthId={monthData.id} />
                </div>

                <Card className="bg-accent-red/10 border-accent-red/20">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total de Gastos Avulsos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-accent-red">
                            {formatCurrency(totalMiscExpenses)}
                        </p>
                    </CardContent>
                </Card>

                <MiscExpenseTable miscExpenses={miscExpensesData} />
            </div>

            <BottomNav year={yearStr} month={monthStr} />
        </>
    );
}
