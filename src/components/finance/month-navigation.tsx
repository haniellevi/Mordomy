"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MonthInfo, capitalize, formatMonthName } from "@/lib/month-utils";

interface MonthNavigationProps {
    currentMonth: MonthInfo;
    allMonths: MonthInfo[];
    previousMonth: MonthInfo | null;
    nextMonth: MonthInfo | null;
    canDelete: boolean;
}

export function MonthNavigation({
    currentMonth,
    allMonths,
    previousMonth,
    nextMonth,
    canDelete,
}: MonthNavigationProps) {
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const currentMonthName = capitalize(formatMonthName(currentMonth.year, currentMonth.month));

    const navigateToMonth = (month: MonthInfo) => {
        router.push(`/${month.year}/${month.month}`);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/months/${currentMonth.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                // Navigate to previous month or home if no previous month
                if (previousMonth) {
                    router.push(`/${previousMonth.year}/${previousMonth.month}`);
                } else if (nextMonth) {
                    router.push(`/${nextMonth.year}/${nextMonth.month}`);
                } else {
                    router.push("/");
                }
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || "Erro ao excluir mês");
            }
        } catch (error) {
            console.error("Error deleting month:", error);
            alert("Erro ao excluir mês");
        } finally {
            setIsDeleting(false);
            setDeleteDialogOpen(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-between gap-2">
                {/* Previous Month Button */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => previousMonth && navigateToMonth(previousMonth)}
                    disabled={!previousMonth}
                    className="h-9 w-9"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Month Selector Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex-1 justify-between gap-2 h-9">
                            <span className="font-semibold">{currentMonthName}</span>
                            <Calendar className="h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-56 max-h-[300px] overflow-y-auto">
                        {allMonths.map((month) => {
                            const isCurrent = month.year === currentMonth.year && month.month === currentMonth.month;
                            const monthName = capitalize(formatMonthName(month.year, month.month));
                            return (
                                <DropdownMenuItem
                                    key={`${month.year}-${month.month}`}
                                    onClick={() => navigateToMonth(month)}
                                    className={isCurrent ? "bg-accent font-semibold" : ""}
                                >
                                    {isCurrent && "✓ "}
                                    {monthName}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Next Month Button */}
                <Button
                    variant="outline"
                    size="icon"
                    onClick={() => nextMonth && navigateToMonth(nextMonth)}
                    disabled={!nextMonth}
                    className="h-9 w-9"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Delete Button (only if allowed) */}
                {canDelete && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteDialogOpen(true)}
                        className="h-9 w-9 text-red-600 hover:text-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Excluir mês</DialogTitle>
                        <DialogDescription>
                            Tem certeza que deseja excluir <strong>{currentMonthName}</strong>?
                            Esta ação não pode ser desfeita e todos os dados do mês serão permanentemente removidos.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={isDeleting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Excluindo..." : "Excluir"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
