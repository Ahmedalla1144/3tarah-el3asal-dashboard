import { usePage } from '@inertiajs/react'
import type { SharedData } from '@/types'

export function useRoles() {
    const { auth } = usePage<SharedData>().props
    const roles = auth?.user?.roles as string[] | undefined
    return roles ?? []
}
