import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { CreateMonthDialog } from "@/components/finance/create-month-dialog";
import { PlanNextMonthAlert } from "@/components/finance/plan-next-month-alert";

export default async function DashboardPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const months = await prisma.month.findMany({
        where: { userId: user.id },
        orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    const latestMonth = months.length > 0 ? months[0] : null;

    return (
        <div className="container mx-auto p-4 space-y-6">
            <PlanNextMonthAlert latestMonth={latestMonth} />
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Meus Meses</h1>
                <div className="flex gap-2">
                    <Link href={`/annual/${new Date().getFullYear()}`}>
                        <Button variant="outline">Resumo Anual</Button>
                    </Link>
                    <CreateMonthDialog />
                </div>
            </div>

            {months.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10">
                        <p className="text-muted-foreground mb-4">Nenhum mês registrado ainda.</p>
                        <CreateMonthDialog />
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {months.map((month) => (
                        <Link key={month.id} href={`/${month.year}/${month.month}`}>
                            <Card className="hover:bg-accent transition-colors cursor-pointer">
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>
                                            {new Date(month.year, month.month - 1).toLocaleString("pt-BR", {
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </span>
                                        {month.isOpen ? (
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                Aberto
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                                                Fechado
                                            </span>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Clique para ver detalhes
                                    </p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
