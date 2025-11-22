"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { Expense } from "@prisma/client";
import { cn } from "@/lib/utils";

interface SerializedExpense extends Omit<Expense, "totalAmount" | "paidAmount"> {
    totalAmount: number;
    paidAmount: number;
}

interface ExpenseTableProps {
    expenses: SerializedExpense[];
}

function SortableRow({ expense, onDelete }: { expense: SerializedExpense; onDelete: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: expense.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        position: isDragging ? "relative" : undefined,
    } as React.CSSProperties;

    const remaining = Number(expense.totalAmount) - Number(expense.paidAmount);
    const isPaid = remaining <= 0;

    return (
        <TableRow ref={setNodeRef} style={style} className={cn(isDragging ? "bg-accent opacity-80" : "", isPaid ? "bg-green-50/50" : "")}>
            <TableCell className="w-[50px]">
                <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-move"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-4 w-4" />
                </Button>
            </TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <span className="font-medium">{expense.description}</span>
                    {expense.type === "TITHE" && <span className="text-xs text-blue-600 font-semibold">Dízimo</span>}
                </div>
            </TableCell>
            <TableCell>
                {expense.dayOfMonth ? `Dia ${expense.dayOfMonth}` : "-"}
            </TableCell>
            <TableCell className="text-right">
                {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(Number(expense.totalAmount))}
            </TableCell>
            <TableCell className="text-right text-green-600">
                {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(Number(expense.paidAmount))}
            </TableCell>
            <TableCell className="text-right text-red-600 font-medium">
                {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(remaining > 0 ? remaining : 0)}
            </TableCell>
            <TableCell className="w-[50px]">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(expense.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
}

export function ExpenseTable({ expenses: initialExpenses }: ExpenseTableProps) {
    const router = useRouter();
    const [items, setItems] = useState(initialExpenses);

    useEffect(() => {
        setItems(initialExpenses);
    }, [initialExpenses]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over?.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Update order in backend (mock)
                console.log("New expense order:", newItems.map(i => i.id));

                return newItems;
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir?")) return;

        try {
            await fetch(`/api/expenses/${id}`, { method: "DELETE" });
            router.refresh();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const total = items.reduce((acc, item) => acc + Number(item.totalAmount), 0);
    const totalPaid = items.reduce((acc, item) => acc + Number(item.paidAmount), 0);
    const totalRemaining = total - totalPaid;

    return (
        <div className="space-y-4">
            <div className="rounded-md border bg-card">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[50px]"></TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Dia</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead className="text-right">Pago</TableHead>
                                <TableHead className="text-right">Falta</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <SortableContext
                                items={items.map((i) => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {items.map((expense) => (
                                    <SortableRow
                                        key={expense.id}
                                        expense={expense}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </SortableContext>
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                        Nenhuma saída registrada.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DndContext>
            </div>
            <div className="flex flex-col md:flex-row justify-end items-end md:items-center gap-4 text-sm font-medium">
                <div className="flex gap-2">
                    <span>Total Previsto:</span>
                    <span className="text-foreground">
                        {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }).format(total)}
                    </span>
                </div>
                <div className="flex gap-2">
                    <span>Total Pago:</span>
                    <span className="text-green-600">
                        {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }).format(totalPaid)}
                    </span>
                </div>
                <div className="flex gap-2">
                    <span>Falta Pagar:</span>
                    <span className="text-red-600">
                        {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        }).format(totalRemaining > 0 ? totalRemaining : 0)}
                    </span>
                </div>
            </div>
        </div>
    );
}
