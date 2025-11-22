import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export function CTASection() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background border-primary/20">
                    <CardContent className="p-8 md:p-12 lg:p-16">
                        <div className="mx-auto max-w-3xl text-center">
                            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
                                Pronto para Transformar suas Finanças?
                            </h2>
                            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                                Junte-se a milhares de usuários que já estão controlando melhor seu dinheiro.
                                <span className="block mt-2">É grátis e leva menos de 1 minuto!</span>
                            </p>
                            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                                <Link href="/signup">
                                    <Button size="lg" className="w-full sm:w-auto group">
                                        Criar Conta Grátis
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                                        Já Tenho Conta
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
