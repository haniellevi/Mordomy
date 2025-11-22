import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-background py-20 md:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                            Controle Financeiro Pessoal Inteligente
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                            Gerencie suas finanças de forma simples e eficiente. Acompanhe entradas, saídas, investimentos e planeje seu futuro com o Mordomy.
                        </p>
                    </div>
                    <div className="space-x-4">
                        <Link href="/signup">
                            <Button size="lg" className="h-12 px-8">
                                Começar Agora
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" size="lg" className="h-12 px-8">
                                Fazer Login
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Background Elements */}
            <div className="absolute -top-24 -z-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px] opacity-50 left-1/2 -translate-x-1/2" />
        </section>
    );
}
