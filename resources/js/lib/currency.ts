export function formatEGP(value: number | null | undefined): string {
    const n = typeof value === 'number' ? value : Number(value ?? 0)

    // Handle NaN and Infinity
    if (!Number.isFinite(n)) {
        return '0 ج.م'
    }

    // Format with English locale for English numbers
    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: true
    })

    const formatted = formatter.format(n)
    return `${formatted} ج.م`
}

export function formatNumber(value: number | null | undefined): string {
    const n = typeof value === 'number' ? value : Number(value ?? 0)

    if (!Number.isFinite(n)) {
        return '0'
    }

    const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
        useGrouping: true
    })

    return formatter.format(n)
}


