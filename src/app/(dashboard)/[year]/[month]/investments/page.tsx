import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { InvestmentTable } from "@/components/finance/investment-table";
import { AddInvestmentDialog } from "@/components/finance/add-investment-dialog";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface InvestmentsPageProps {
    params: Promise<{
        year: string;
        month: string;
    }>;
}

export default async function InvestmentsPage({ params }: InvestmentsPageProps) {
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
            investments: true,
        },
    });

    if (!monthData) {
        redirect("/");
    }

    const totalInvestments = monthData.investments.reduce(
        (sum, investment) => sum + Number(investment.amount),
        0
    );

    return (
        <>
            <div className="container mx-auto p-4 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Investimentos</h1>
                    <AddInvestmentDialog monthId={monthData.id} />
                </div>

                <Card className="bg-primary/10 border-primary/20">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total de Investimentos
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-primary">
                            {formatCurrency(totalInvestments)}
                        </p>
                    </CardContent>
                </Card>

                <InvestmentTable investments={monthData.investments} />
            </div>

            <BottomNav year={yearStr} month={monthStr} />
        </>
    );
}
