"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PlanNextMonthAlertProps {
    latestMonth: {
        id: string;
        year: number;
        month: number;
    } | null;
}

export function PlanNextMonthAlert({ latestMonth }: PlanNextMonthAlertProps) {
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [daysLeft, setDaysLeft] = useState(0);
    const [nextMonthName, setNextMonthName] = useState("");

    useEffect(() => {
        const checkDate = () => {
            const today = new Date();
            const day = today.getDate();
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
            const remaining = lastDay - day;

            setDaysLeft(remaining);

            // Calculate next month name
            if (latestMonth) {
                let nextMonth = latestMonth.month + 1;
                let nextYear = latestMonth.year;
                if (nextMonth > 12) {
                    nextMonth = 1;
                    nextYear += 1;
                }
                const nextDate = new Date(nextYear, nextMonth - 1, 1);
                const monthName = nextDate.toLocaleString('pt-BR', {
                    month: 'long',
                    year: 'numeric'
                });
                setNextMonthName(monthName.charAt(0).toUpperCase() + monthName.slice(1));
            }

            // Show if it's after the 20th (design implies end of month urgency)
            if (day >= 20) {
                setShow(true);
            }
        };
        checkDate();
    }, [latestMonth]);

    const handleDuplicate = async () => {
        if (!latestMonth) return;

        setLoading(true);
        // Calculate next month
        let nextMonth = latestMonth.month + 1;
        let nextYear = latestMonth.year;
        if (nextMonth > 12) {
            nextMonth = 1;
            nextYear += 1;
        }

        try {
            const res = await fetch("/api/months/duplicate", {
                method: "POST",
                body: JSON.stringify({
                    sourceMonthId: latestMonth.id,
                    targetYear: nextYear,
                    targetMonth: nextMonth,
                }),
            });

            if (res.ok) {
                const newMonth = await res.json();
                router.refresh();
                router.push(`/${newMonth.year}/${newMonth.month}`);
            } else {
                alert("Erro ao duplicar mês ou mês já existe.");
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao duplicar mês.");
        } finally {
            setLoading(false);
        }
    };

    if (!show || !latestMonth) return null;

    return (
        <div className="flex flex-1 flex-col items-start justify-between gap-4 rounded-xl border border-green-200 bg-green-100 p-5 @[480px]:flex-row @[480px]:items-center">
            <div className="flex flex-col gap-1">
                <p className="text-green-800 text-base font-bold leading-tight">
                    Faltam {daysLeft} dias para o fim do mês!
                </p>
                <p className="text-green-600 text-base font-normal leading-normal">
                    Como deseja iniciar o planejamento de {nextMonthName}?
                </p>
            </div>
            <div className="flex w-full flex-col gap-2 @[480px]:w-auto @[480px]:flex-row">
                <button
                    onClick={handleDuplicate}
                    disabled={loading}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-green-600 text-white text-sm font-bold leading-normal w-full transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                    <span className="truncate">{loading ? "Criando..." : "Duplicar Mês"}</span>
                </button>
                {/* Optional: "Começar do Zero" button could just navigate to create month dialog or similar */}
            </div>
        </div>
    );
}
