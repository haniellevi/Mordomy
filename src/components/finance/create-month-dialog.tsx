"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";

export function CreateMonthDialog() {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState<string>("");
    const [year, setYear] = useState<string>(new Date().getFullYear().toString());

    const handleSubmit = async () => {
        if (!month || !year) return;

        setLoading(true);
        try {
            const res = await fetch("/api/months", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ month, year }),
            });

            if (res.ok) {
                setOpen(false);
                router.refresh();
            } else {
                alert("Erro ao criar mês. Verifique se já não existe.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];
    const months = [
        { value: "1", label: "Janeiro" },
        { value: "2", label: "Fevereiro" },
        { value: "3", label: "Março" },
        { value: "4", label: "Abril" },
        { value: "5", label: "Maio" },
        { value: "6", label: "Junho" },
        { value: "7", label: "Julho" },
        { value: "8", label: "Agosto" },
        { value: "9", label: "Setembro" },
        { value: "10", label: "Outubro" },
        { value: "11", label: "Novembro" },
        { value: "12", label: "Dezembro" },
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Mês
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adicionar Mês</DialogTitle>
                    <DialogDescription>
                        Crie um novo mês para começar a controlar suas finanças.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="month" className="text-right">
                            Mês
                        </Label>
                        <Select onValueChange={setMonth} value={month}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione o mês" />
                            </SelectTrigger>
                            <SelectContent>
                                {months.map((m) => (
                                    <SelectItem key={m.value} value={m.value}>
                                        {m.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="year" className="text-right">
                            Ano
                        </Label>
                        <Select onValueChange={setYear} value={year}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione o ano" />
                            </SelectTrigger>
                            <SelectContent>
                                {years.map((y) => (
                                    <SelectItem key={y} value={y.toString()}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit} disabled={loading}>
                        {loading ? "Criando..." : "Criar Mês"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
