"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Investment } from "@prisma/client";

interface InvestmentTableProps {
    investments: Investment[];
}

export function InvestmentTable({ investments: initialInvestments }: InvestmentTableProps) {
    const router = useRouter();
    const [items, setItems] = useState(initialInvestments);

    useEffect(() => {
        setItems(initialInvestments);
    }, [initialInvestments]);

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir?")) return;

        try {
            await fetch(`/api/investments/${id}`, { method: "DELETE" });
            router.refresh();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const total = items.reduce((acc, item) => acc + Number(item.amount), 0);

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Dia</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map((investment) => (
                            <TableRow key={investment.id}>
                                <TableCell>{investment.description}</TableCell>
                                <TableCell>
                                    {investment.dayOfMonth ? `Dia ${investment.dayOfMonth}` : "-"}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(Number(investment.amount))}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                        onClick={() => handleDelete(investment.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {items.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                    Nenhum investimento registrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-end items-center gap-2 text-lg font-semibold">
                <span>Total em Investimentos:</span>
                <span className="text-blue-600">
                    {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }).format(total)}
                </span>
            </div>
        </div>
    );
}
