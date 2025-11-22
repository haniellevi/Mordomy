"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, TrendingDown, ShoppingBag, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
    year: string;
    month: string;
}

export function BottomNav({ year, month }: BottomNavProps) {
    const pathname = usePathname();

    const navItems = [
        {
            label: "Dashboard",
            icon: Home,
            href: `/${year}/${month}`,
            match: (path: string) => path === `/${year}/${month}`,
        },
        {
            label: "Entradas",
            icon: TrendingUp,
            href: `/${year}/${month}/incomes`,
            match: (path: string) => path.includes("/incomes"),
        },
        {
            label: "Saídas",
            icon: TrendingDown,
            href: `/${year}/${month}/expenses`,
            match: (path: string) => path.includes("/expenses"),
        },
        {
            label: "Gastos",
            icon: ShoppingBag,
            href: `/${year}/${month}/misc-expenses`,
            match: (path: string) => path.includes("/misc-expenses"),
        },
        {
            label: "Investimentos",
            icon: PiggyBank,
            href: `/${year}/${month}/investments`,
            match: (path: string) => path.includes("/investments"),
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-2">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const isActive = item.match(pathname);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors min-w-[60px]",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon className={cn("h-5 w-5", isActive && "fill-primary/20")} />
                                <span className="text-xs font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
