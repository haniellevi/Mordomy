import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET(req: Request) {
    const user = await getCurrentUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const months = await prisma.month.findMany({
            where: {
                userId: user.id,
            },
            orderBy: [
                { year: "desc" },
                { month: "desc" },
            ],
        });

        return NextResponse.json(months);
    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    const user = await getCurrentUser();

    if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const { month, year } = await req.json();

        if (!month || !year) {
            return new NextResponse("Month and Year are required", { status: 400 });
        }

        const existingMonth = await prisma.month.findFirst({
            where: {
                userId: user.id,
                month: parseInt(month),
                year: parseInt(year),
            },
        });

        if (existingMonth) {
            return new NextResponse("Month already exists", { status: 409 });
        }

        const newMonth = await prisma.month.create({
            data: {
                userId: user.id,
                month: parseInt(month),
                year: parseInt(year),
            },
        });

        return NextResponse.json(newMonth);
    } catch (error) {
        console.error("[MONTH_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
