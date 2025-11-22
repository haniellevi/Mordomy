import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden py-20 md:py-32">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

            {/* Content */}
            <div className="container relative z-10 mx-auto px-4">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Badge */}
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                        <Sparkles className="h-4 w-4" />
                        <span>Gerencie suas finanças com inteligência</span>
                    </div>

                    {/* Title */}
                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                        Controle Financeiro
                        <span className="block bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                            Pessoal Inteligente
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="mb-8 text-lg text-muted-foreground md:text-xl lg:text-2xl">
                        Organize suas entradas, saídas, investimentos e gastos em um só lugar.
                        <span className="block mt-2">Simples, rápido e eficiente.</span>
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link href="/signup">
                            <Button size="lg" className="w-full sm:w-auto group">
                                Começar Agora
                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                Fazer Login
                            </Button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
                        <div>
                            <div className="text-3xl font-bold text-primary">100%</div>
                            <div className="text-sm text-muted-foreground">Grátis</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-accent-green">Fácil</div>
                            <div className="text-sm text-muted-foreground">De Usar</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-primary">Seguro</div>
                            <div className="text-sm text-muted-foreground">Seus Dados</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-accent-green">24/7</div>
                            <div className="text-sm text-muted-foreground">Disponível</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
