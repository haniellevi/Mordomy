/**
 * Utility functions for month management
 */

export interface MonthInfo {
    id: string;
    year: number;
    month: number;
}

/**
 * Check if a month can be deleted (must be in the future)
 */
export function canDeleteMonth(year: number, month: number): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of day

    const monthStart = new Date(year, month - 1, 1);
    monthStart.setHours(0, 0, 0, 0);

    return today < monthStart;
}

/**
 * Check if a month can be edited (current month or future)
 */
export function isMonthEditable(year: number, month: number): boolean {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    // Future year = editable
    if (year > currentYear) return true;

    // Same year, current month or future = editable
    if (year === currentYear && month >= currentMonth) return true;

    // Past month = not editable
    return false;
}

/**
 * Format month name in Portuguese
 */
export function formatMonthName(year: number, month: number): string {
    const date = new Date(year, month - 1, 1);
    return date.toLocaleString('pt-BR', {
        month: 'long',
        year: 'numeric'
    });
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Find the previous month in the available months list
 */
export function findPreviousMonth(
    currentYear: number,
    currentMonth: number,
    availableMonths: MonthInfo[]
): MonthInfo | null {
    const sorted = [...availableMonths].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
    });

    const currentIndex = sorted.findIndex(
        m => m.year === currentYear && m.month === currentMonth
    );

    if (currentIndex <= 0) return null;
    return sorted[currentIndex - 1];
}

/**
 * Find the next month in the available months list
 */
export function findNextMonth(
    currentYear: number,
    currentMonth: number,
    availableMonths: MonthInfo[]
): MonthInfo | null {
    const sorted = [...availableMonths].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
    });

    const currentIndex = sorted.findIndex(
        m => m.year === currentYear && m.month === currentMonth
    );

    if (currentIndex === -1 || currentIndex >= sorted.length - 1) return null;
    return sorted[currentIndex + 1];
}

/**
 * Sort months chronologically
 */
export function sortMonths(months: MonthInfo[]): MonthInfo[] {
    return [...months].sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
    });
}
