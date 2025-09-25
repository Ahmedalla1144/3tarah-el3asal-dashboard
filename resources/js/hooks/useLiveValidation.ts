import { attachLiveValidation, type FieldRule } from '@/components/forms/validate';
import { useEffect } from 'react';

export function useLiveValidation(formSelector: string, rules: FieldRule[]) {
    useEffect(() => {
        const form = document.querySelector(formSelector) as HTMLFormElement | null;
        if (!form) return;

        const handler = () => {
            attachLiveValidation(form, rules);
        };

        const inputs: (HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement)[] = [];

        rules.forEach((rule) => {
            const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[name="${rule.name}"]`);
            if (el) {
                el.addEventListener('input', handler, { once: true });
                inputs.push(el);
            }
        });

        return () => {
            inputs.forEach((el) => {
                el.removeEventListener('input', handler);
            });
        };
    }, [formSelector, rules]);
}
