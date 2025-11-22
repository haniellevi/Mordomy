import { HeroSection } from "@/components/landing/hero-section";
import { FeatureCard } from "@/components/landing/feature-card";
import { CTASection } from "@/components/landing/cta-section";
import {
    TrendingUp,
    TrendingDown,
    PiggyBank,
    ShoppingBag,
    Calendar,
    Church
} from "lucide-react";

export default function LandingPage() {
    const features = [
        {
            icon: TrendingUp,
            title: "Controle de Entradas",
            description: "Registre e acompanhe todas as suas fontes de renda de forma organizada.",
            color: "text-accent-green",
        },
        {
            icon: TrendingDown,
            title: "Gestão de Saídas",
            description: "Monitore seus gastos fixos e variáveis com total controle de pagamentos.",
            color: "text-accent-red",
        },
        {
            icon: PiggyBank,
            title: "Investimentos",
            description: "Acompanhe seus investimentos e veja seu patrimônio crescer.",
            color: "text-primary",
        },
        {
            icon: ShoppingBag,
            title: "Gastos Avulsos",
            description: "Registre despesas extras e mantenha tudo sob controle.",
            color: "text-orange-500",
        },
        {
            icon: Calendar,
            title: "Planejamento Mensal",
            description: "Duplique meses anteriores e planeje o futuro com facilidade.",
            color: "text-blue-500",
        },
        {
            icon: Church,
            title: "Dízimo Automático",
            description: "Cálculo automático de 10% do total de entradas para dízimo.",
            color: "text-purple-500",
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <HeroSection />

            {/* Features Section */}
            <section className="py-20 bg-muted/50">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center mb-16">
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                            Tudo que Você Precisa
                        </h2>
                        <p className="text-lg text-muted-foreground md:text-xl">
                            Funcionalidades poderosas para controlar suas finanças pessoais
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <FeatureCard key={feature.title} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center mb-16">
                        <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                            Como Funciona
                        </h2>
                        <p className="text-lg text-muted-foreground md:text-xl">
                            Comece a usar em 3 passos simples
                        </p>
                    </div>

                    <div className="mx-auto max-w-4xl">
                        <div className="grid gap-8 md:grid-cols-3">
                            <div className="text-center">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                                    1
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">Cadastre-se</h3>
                                <p className="text-muted-foreground">
                                    Crie sua conta gratuitamente em menos de 1 minuto
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                                    2
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">Configure</h3>
                                <p className="text-muted-foreground">
                                    Adicione suas entradas, saídas e investimentos do mês
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                                    3
                                </div>
                                <h3 className="mb-2 text-xl font-semibold">Acompanhe</h3>
                                <p className="text-muted-foreground">
                                    Visualize seu saldo e tome decisões financeiras inteligentes
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <CTASection />

            {/* Footer */}
            <footer className="border-t py-8">
                <div className="container mx-auto px-4">
                    <div className="text-center text-sm text-muted-foreground">
                        <p>© 2025 Mordomy. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
