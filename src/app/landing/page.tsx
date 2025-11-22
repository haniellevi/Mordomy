import { HeroSection } from "@/components/landing/hero-section";
import { FeatureCard } from "@/components/landing/feature-card";
import { CTASection } from "@/components/landing/cta-section";
import {
    TrendingUp,
    TrendingDown,
    LayoutDashboard,
    PiggyBank,
    CalendarDays,
    ShoppingBag
} from "lucide-react";

export default function LandingPage() {
    const features = [
        {
            icon: TrendingUp,
            title: "Controle de Entradas",
            description: "Registre todas as suas fontes de renda e visualize o crescimento do seu patrimônio.",
            colorClass: "text-green-600 bg-green-100",
        },
        {
            icon: TrendingDown,
            title: "Gestão de Saídas",
            description: "Acompanhe seus gastos mensais e identifique onde você pode economizar.",
            colorClass: "text-red-500 bg-red-100",
        },
        {
            icon: LayoutDashboard,
            title: "Dashboard Intuitivo",
            description: "Visualize sua saúde financeira com gráficos claros e resumos automáticos.",
            colorClass: "text-blue-600 bg-blue-100",
        },
        {
            icon: PiggyBank,
            title: "Investimentos",
            description: "Gerencie seus investimentos e acompanhe a evolução da sua carteira.",
            colorClass: "text-purple-600 bg-purple-100",
        },
        {
            icon: CalendarDays,
            title: "Planejamento Mensal",
            description: "Planeje o próximo mês com facilidade duplicando seus gastos recorrentes.",
            colorClass: "text-orange-600 bg-orange-100",
        },
        {
            icon: ShoppingBag,
            title: "Gastos Avulsos",
            description: "Controle despesas variáveis e não perca nada de vista.",
            colorClass: "text-pink-600 bg-pink-100",
        },
    ];

    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection />

            <section className="py-20 bg-muted/50">
                <div className="container px-4 md:px-6">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Tudo que você precisa
                        </h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                            Funcionalidades pensadas para simplificar sua vida financeira e te dar controle total.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, index) => (
                            <FeatureCard key={index} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            <CTASection />
        </div>
    );
}
