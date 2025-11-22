import { prisma } from "@/lib/prisma";
import { isMonthEditable } from "@/lib/month-utils";

/**
 * Validate if a month can be edited and if user owns it
 * Returns error response if validation fails, null if valid
 */
export async function validateMonthEditable(
    monthId: string,
    userId: string
): Promise<{ error: string; status: number } | null> {
    const month = await prisma.month.findUnique({
        where: { id: monthId },
        select: { year: true, month: true, userId: true },
    });

    if (!month) {
        return { error: "Month not found", status: 404 };
    }

    if (month.userId !== userId) {
        return { error: "Unauthorized", status: 403 };
    }

    if (!isMonthEditable(month.year, month.month)) {
        return { error: "Cannot edit past months", status: 403 };
    }

    return null;
}
