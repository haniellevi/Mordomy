import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const signupSchema = z.object({
    name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    password: z
        .string()
        .min(8, "A senha deve ter pelo menos 8 caracteres")
        .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
        .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password } = signupSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Este email já está cadastrado" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                user: userWithoutPassword,
                message: "Usuário criado com sucesso",
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: error.errors[0].message },
                { status: 400 }
            );
        }

        console.error("Signup error:", error);
        return NextResponse.json(
            { error: "Erro ao criar usuário" },
            { status: 500 }
        );
    }
}
