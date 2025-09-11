export function formatEGP(value: number | null | undefined): string {
    const n = typeof value === 'number' ? value : Number(value ?? 0)
    const formatter = new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })
    const formatted = Number.isFinite(n) ? formatter.format(n) : '0'
    return `${formatted} ج.م`
}


