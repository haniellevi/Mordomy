import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface AnnualPageProps {
    params: {
        year: string;
    };
}

export default async function AnnualPage({ params }: AnnualPageProps) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const year = parseInt(params.year);

    const months = await prisma.month.findMany({
        where: {
            userId: user.id,
            year: year,
        },
        include: {
            incomes: true,
            expenses: true,
        },
        orderBy: {
            month: "asc",
        },
    });

    const annualSummary = months.reduce(
        (acc, month) => {
            const income = month.incomes.reduce((sum, item) => sum + Number(item.amount), 0);
            const expense = month.expenses.reduce((sum, item) => sum + Number(item.totalAmount), 0);
            return {
                income: acc.income + income,
                expense: acc.expense + expense,
            };
        },
        { income: 0, expense: 0 }
    );

    const balance = annualSummary.income - annualSummary.expense;

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Resumo Anual - {year}</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Entradas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(annualSummary.income)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Saídas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(annualSummary.expense)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saldo Anual</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${balance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(balance)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="rounded-md border">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Mês</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Entradas</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Saídas</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Saldo</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {months.map((month) => {
                                const income = month.incomes.reduce((sum, item) => sum + Number(item.amount), 0);
                                const expense = month.expenses.reduce((sum, item) => sum + Number(item.totalAmount), 0);
                                const monthBalance = income - expense;

                                return (
                                    <tr key={month.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">
                                            <Link href={`/${month.year}/${month.month}`} className="hover:underline">
                                                {new Date(month.year, month.month - 1).toLocaleString("pt-BR", { month: "long" })}
                                            </Link>
                                        </td>
                                        <td className="p-4 align-middle text-right text-green-600">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(income)}
                                        </td>
                                        <td className="p-4 align-middle text-right text-red-600">
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(expense)}
                                        </td>
                                        <td className={`p-4 align-middle text-right font-medium ${monthBalance >= 0 ? "text-blue-600" : "text-red-600"}`}>
                                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(monthBalance)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
