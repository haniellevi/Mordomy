import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    colorClass?: string;
}

export function FeatureCard({ icon: Icon, title, description, colorClass = "text-primary" }: FeatureCardProps) {
    return (
        <Card className="border-none shadow-lg transition-all hover:scale-105 hover:shadow-xl bg-card/50 backdrop-blur">
            <CardHeader>
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ${colorClass}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
