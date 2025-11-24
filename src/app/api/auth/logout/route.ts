import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function POST() {
    try {
        const supabase = await createServerClient();

        const { error } = await supabase.auth.signOut();

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: "Logout realizado com sucesso" },
            { status: 200 }
        );
    } catch (error) {
        console.error("[LOGOUT_POST]", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
