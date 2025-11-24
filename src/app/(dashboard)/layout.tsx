import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-background">
            <Header userName={user.user_metadata?.name || "Usuário"} userEmail={user.email || ""} />
            <main className="pb-20">{children}</main>
        </div>
    );
}
