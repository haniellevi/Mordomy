import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const signupSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    name: z.string().min(1, "Nome é obrigatório"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name } = signupSchema.parse(body);

        const supabase = await createServerClient();

        // Create user with Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        if (!data.user) {
            return NextResponse.json(
                { error: "Erro ao criar usuário" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                message: "Usuário criado com sucesso",
                user: data.user,
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const zodError = error as any;
            return NextResponse.json(
                { error: zodError.errors[0].message },
                { status: 400 }
            );
        }

        console.error("[SIGNUP_POST]", error);
        return NextResponse.json(
            { error: "Erro interno do servidor" },
            { status: 500 }
        );
    }
}
