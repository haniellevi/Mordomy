import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BottomNav } from "@/components/layout/bottom-nav";
import { PlanNextMonthAlert } from "@/components/finance/plan-next-month-alert";
import { MonthNavigation } from "@/components/finance/month-navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, ShoppingBag, PiggyBank, ChevronRight } from "lucide-react";
import { canDeleteMonth, findPreviousMonth, findNextMonth, sortMonths, type MonthInfo } from "@/lib/month-utils";

interface MonthPageProps {
    params: Promise<{
        year: string;
        month: string;
    }>;
}

export default async function MonthPage({ params }: MonthPageProps) {
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
            expenses: true,
            investments: true,
            miscExpenses: true,
        },
    });

    if (!monthData) {
        redirect("/");
    }

    // Fetch all months for navigation
    const allMonthsData = await prisma.month.findMany({
        where: {
            userId: user.id,
        },
        select: {
            id: true,
            year: true,
            month: true,
        },
        orderBy: [
            { year: "asc" },
            { month: "asc" },
        ],
    });

    const allMonths: MonthInfo[] = allMonthsData.map(m => ({
        id: m.id,
        year: m.year,
        month: m.month,
    }));

    // Calculate navigation
    const sortedMonths = sortMonths(allMonths);
    const previousMonth = findPreviousMonth(year, month, sortedMonths);
    const nextMonth = findNextMonth(year, month, sortedMonths);
    const canDelete = canDeleteMonth(year, month);

    // Calculate totals
    const totalIncome = monthData.incomes.reduce((sum, income) => sum + Number(income.amount), 0);
    const totalExpensePaid = monthData.expenses.reduce((sum, expense) => sum + Number(expense.paidAmount), 0);
    const totalInvestments = monthData.investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const totalMiscExpenses = monthData.miscExpenses.reduce((sum, misc) => sum + Number(misc.amount), 0);
    const balance = totalIncome - totalExpensePaid - totalInvestments - totalMiscExpenses;

    // Month name
    const monthName = new Date(year, month - 1).toLocaleString("pt-BR", {
        month: "long",
        year: "numeric",
    });

    const categories = [
        {
            title: "Entradas",
            value: totalIncome,
            count: monthData.incomes.length,
            href: `/${yearStr}/${monthStr}/incomes`,
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-100",
            borderColor: "border-green-200",
        },
        {
            title: "Saídas",
            value: totalExpensePaid,
            count: monthData.expenses.length,
            href: `/${yearStr}/${monthStr}/expenses`,
            icon: TrendingDown,
            color: "text-red-500",
            bgColor: "bg-red-50",
            borderColor: "border-red-100",
        },
        {
            title: "Gastos Avulsos",
            value: totalMiscExpenses,
            count: monthData.miscExpenses.length,
            href: `/${yearStr}/${monthStr}/misc-expenses`,
            icon: ShoppingBag,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-100",
        },
        {
            title: "Investimentos",
            value: totalInvestments,
            count: monthData.investments.length,
            href: `/${yearStr}/${monthStr}/investments`,
            icon: PiggyBank,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-100",
        },
    ];

    return (
        <>
            <div className="container mx-auto p-4 space-y-6 pb-24">
                {/* Month Navigation */}
                <MonthNavigation
                    currentMonth={{ id: monthData.id, year: monthData.year, month: monthData.month }}
                    allMonths={allMonths}
                    previousMonth={previousMonth}
                    nextMonth={nextMonth}
                    canDelete={canDelete}
                />

                {/* Month Title */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold capitalize">{monthName}</h1>
                </div>

                {/* Plan Next Month Alert */}
                <PlanNextMonthAlert latestMonth={{ id: monthData.id, year: monthData.year, month: monthData.month }} />

                {/* Balance Card */}
                <Card className={balance >= 0 ? "bg-green-100 border-green-200" : "bg-red-50 border-red-100"}>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground text-center">
                            Saldo do Mês
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className={`text-4xl font-bold text-center ${balance >= 0 ? "text-green-600" : "text-red-500"}`}>
                            {formatCurrency(balance)}
                        </p>
                        <p className="text-xs text-muted-foreground text-center mt-2">
                            {totalIncome > 0 ? `${((balance / totalIncome) * 100).toFixed(1)}% do total de entradas` : "Sem entradas registradas"}
                        </p>
                    </CardContent>
                </Card>

                {/* Categories Grid */}
                <div className="space-y-3">
                    <h2 className="text-lg font-semibold">Categorias</h2>
                    <div className="grid gap-3">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <Link key={category.href} href={category.href}>
                                    <Card className={`${category.bgColor} ${category.borderColor} hover:opacity-80 transition-opacity`}>
                                        <CardContent className="flex items-center justify-between p-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${category.bgColor}`}>
                                                    <Icon className={`h-5 w-5 ${category.color}`} />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{category.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {category.count} {category.count === 1 ? "item" : "itens"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <p className={`text-xl font-bold ${category.color}`}>
                                                    {formatCurrency(category.value)}
                                                </p>
                                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            <BottomNav year={yearStr} month={monthStr} />
        </>
    );
}
