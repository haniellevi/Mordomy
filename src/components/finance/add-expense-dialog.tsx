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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AddExpenseDialogProps {
    monthId: string;
}

export function AddExpenseDialog({ monthId }: AddExpenseDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [paidAmount, setPaidAmount] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState("STANDARD");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !totalAmount) return;

        setLoading(true);
        try {
            const res = await fetch("/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    monthId,
                    description,
                    totalAmount,
                    paidAmount: paidAmount || "0",
                    date: date || null,
                    type,
                }),
            });

            if (res.ok) {
                setOpen(false);
                setDescription("");
                setTotalAmount("");
                setPaidAmount("");
                setDate("");
                setType("STANDARD");
                router.refresh();
            } else {
                alert("Erro ao adicionar saída.");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Nova Saída</DialogTitle>
                    <DialogDescription>
                        Adicione uma nova saída financeira para este mês.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Descrição
                            </Label>
                            <Input
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="totalAmount" className="text-right">
                                Valor Total
                            </Label>
                            <Input
                                id="totalAmount"
                                type="number"
                                step="0.01"
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                                className="col-span-3"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="paidAmount" className="text-right">
                                Pago
                            </Label>
                            <Input
                                id="paidAmount"
                                type="number"
                                step="0.01"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                                className="col-span-3"
                                placeholder="Opcional"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="date" className="text-right">
                                Data
                            </Label>
                            <Input
                                id="date"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Tipo
                            </Label>
                            <Select onValueChange={setType} value={type}>
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione o tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="STANDARD">Padrão</SelectItem>
                                    <SelectItem value="TITHE">Dízimo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvando..." : "Salvar"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
