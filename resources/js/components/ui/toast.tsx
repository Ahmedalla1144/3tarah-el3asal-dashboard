import React, { createContext, useContext, useState, useCallback } from 'react'

type Toast = { id: number; title?: string; description?: string; variant?: 'default' | 'destructive' }

const ToastContext = createContext<{ add: (t: Omit<Toast, 'id'>) => void } | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])
    const add = useCallback((t: Omit<Toast, 'id'>) => {
        const id = Date.now()
        setToasts((prev) => [...prev, { id, ...t }])
        setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 3000)
    }, [])

    return (
        <ToastContext.Provider value={{ add }}>
            {children}
            <div className="fixed right-4 top-4 z-50 space-y-2">
                {toasts.map((t) => (
                    <div key={t.id} className={`rounded-md border px-4 py-3 shadow ${t.variant === 'destructive' ? 'border-red-400 bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-100' : 'border-green-400 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-100'}`}>
                        {t.title && <div className="text-sm font-semibold">{t.title}</div>}
                        {t.description && <div className="text-xs">{t.description}</div>}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}


