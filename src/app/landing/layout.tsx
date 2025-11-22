import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <span className="text-lg font-bold text-primary-foreground">M</span>
                        </div>
                        <span className="text-xl font-bold">Mordomy</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost">Entrar</Button>
                        </Link>
                        <Link href="/signup">
                            <Button>Criar Conta</Button>
                        </Link>
                    </div>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © 2025 Mordomy. Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}
