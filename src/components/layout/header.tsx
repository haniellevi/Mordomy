"use client";

import { useRouter } from "next/navigation";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
    userName: string;
    userEmail: string;
}

export function Header({ userName, userEmail }: HeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/landing");
        router.refresh();
    };

    // Generate user initials from name
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const initials = getInitials(userName);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Logo/Brand Area */}
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-primary">Mordomy</h1>
                </div>

                {/* User Profile Dropdown */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        <div className="flex items-center gap-3">
                            {/* Avatar */}
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-light text-white font-semibold text-sm">
                                {initials}
                            </div>
                            {/* User Info - Hidden on mobile */}
                            <div className="hidden sm:flex flex-col items-start">
                                <span className="text-sm font-semibold text-foreground">{userName}</span>
                                <span className="text-xs text-muted-foreground">{userEmail}</span>
                            </div>
                            {/* Chevron Icon */}
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{userName}</p>
                                <p className="text-xs leading-none text-muted-foreground">{userEmail}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                            <User className="mr-2 h-4 w-4" />
                            <span>Meu Perfil</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled className="opacity-50 cursor-not-allowed">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configurações</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sair</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
