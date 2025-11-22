import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
    return (
        <section className="py-20 bg-primary/5">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Pronto para organizar sua vida financeira?
                        </h2>
                        <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                            Junte-se a nós e comece a tomar o controle do seu dinheiro hoje mesmo. É simples, rápido e eficiente.
                        </p>
                    </div>
                    <Link href="/signup">
                        <Button size="lg" className="h-12 px-8 text-lg">
                            Criar Conta Grátis
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
