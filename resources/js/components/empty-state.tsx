import { cn } from '@/lib/utils';

export default function EmptyState({
    title = 'لا توجد بيانات',
    description = 'حاول تعديل كلمات البحث.',
    className = '',
    colSpan = 1,
}: {
    title?: string;
    description?: string;
    className?: string;
    colSpan?: number;
}) {
    return (
        <tr>
            <td colSpan={colSpan}>
                <div
                    className={cn(
                        'flex flex-col items-center justify-center gap-2 rounded-lg p-8 text-center text-sm text-muted-foreground',
                        className,
                    )}
                >
                    <div className="text-base font-medium text-foreground">{title}</div>
                    {description && <div>{description}</div>}
                </div>
            </td>
        </tr>
    );
}
