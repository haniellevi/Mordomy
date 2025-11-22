import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";

export default async function HomePage() {
    const user = await getCurrentUser();

    if (user) {
        // Usuário autenticado - redirecionar para o dashboard mais recente
        redirect("/");
    }

    // Usuário não autenticado - redirecionar para landing page
    redirect("/landing");
}
