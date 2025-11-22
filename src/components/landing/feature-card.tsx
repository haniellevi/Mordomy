import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    color?: string;
}

export function FeatureCard({ icon: Icon, title, description, color = "text-primary" }: FeatureCardProps) {
    return (
        <Card className="group transition-all hover:shadow-lg hover:scale-105 duration-300">
            <CardHeader>
                <div className={`mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ${color}`}>
                    <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-base">{description}</CardDescription>
            </CardContent>
        </Card>
    );
}
