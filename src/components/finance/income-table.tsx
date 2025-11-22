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
import { Income } from "@prisma/client";

interface IncomeTableProps {
    incomes: Income[];
}

function SortableRow({ income, onDelete }: { income: Income; onDelete: (id: string) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: income.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        position: isDragging ? "relative" : undefined,
    } as React.CSSProperties;

    return (
        <TableRow ref={setNodeRef} style={style} className={isDragging ? "bg-accent opacity-80" : ""}>
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
            <TableCell>{income.description}</TableCell>
            <TableCell>
                {new Date(income.date).toLocaleDateString("pt-BR")}
            </TableCell>
            <TableCell className="text-right font-medium text-green-600">
                {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(Number(income.amount))}
            </TableCell>
            <TableCell className="w-[50px]">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(income.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
}

export function IncomeTable({ incomes: initialIncomes }: IncomeTableProps) {
    const router = useRouter();
    const [items, setItems] = useState(initialIncomes);

    useEffect(() => {
        setItems(initialIncomes);
    }, [initialIncomes]);

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

                // Update order in backend
                // Note: For a real app, you might want to debounce this or do it optimistically
                // Here we just update the local state and could trigger an API call
                updateOrder(newItems);

                return newItems;
            });
        }
    };

    const updateOrder = async (newItems: Income[]) => {
        // In a real implementation, we would send the new order to the backend
        // For now, we assume the backend handles this or we implement a bulk update endpoint
        // Since we don't have a bulk update endpoint yet, we'll skip the API call for now
        // or implement it one by one (inefficient but works for demo)

        // Ideally: POST /api/incomes/reorder { items: [{id, order}] }
        console.log("New order:", newItems.map(i => i.id));
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir?")) return;

        try {
            await fetch(`/api/incomes/${id}`, { method: "DELETE" });
            router.refresh();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    };

    const total = items.reduce((acc, item) => acc + Number(item.amount), 0);

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
                                <TableHead>Data</TableHead>
                                <TableHead className="text-right">Valor</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <SortableContext
                                items={items.map((i) => i.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {items.map((income) => (
                                    <SortableRow
                                        key={income.id}
                                        income={income}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </SortableContext>
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                        Nenhuma entrada registrada.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </DndContext>
            </div>
            <div className="flex justify-end items-center gap-2 text-lg font-semibold">
                <span>Total Mensal:</span>
                <span className="text-green-600">
                    {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }).format(total)}
                </span>
            </div>
        </div>
    );
}
