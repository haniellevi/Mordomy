import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { ExpenseTable } from "@/components/finance/expense-table";
import { AddExpenseDialog } from "@/components/finance/add-expense-dialog";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface ExpensesPageProps {
    params: Promise<{
        year: string;
        month: string;
    }>;
}

export default async function ExpensesPage({ params }: ExpensesPageProps) {
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
            incomes: true,
            expenses: { orderBy: { order: "asc" } },
        },
    });

    if (!monthData) {
        redirect("/");
    }

    const totalIncome = monthData.incomes.reduce((sum, income) => sum + Number(income.amount), 0);
    const totalPaid = monthData.expenses.reduce((sum, expense) => sum + Number(expense.paidAmount), 0);
    const balance = totalIncome - totalPaid;

    return (
        <>
            <div className="container mx-auto p-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Saídas</h1>
                    <AddExpenseDialog monthId={monthData.id} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-accent-red/10 border-accent-red/20">
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Total Pago
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold text-accent-red">
                                {formatCurrency(totalPaid)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className={balance >= 0 ? "bg-accent-green/10 border-accent-green/20" : "bg-accent-red/10 border-accent-red/20"}>
                        <CardHeader>
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Saldo Restante
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className={`text-3xl font-bold ${balance >= 0 ? "text-accent-green" : "text-accent-red"}`}>
                                {formatCurrency(balance)}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <ExpenseTable expenses={monthData.expenses} />
            </div>

            <BottomNav year={yearStr} month={monthStr} />
        </>
    );
}
