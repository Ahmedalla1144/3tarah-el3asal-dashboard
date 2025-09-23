export type FieldRule = {
    name: string;
    label?: string;
    required?: boolean;
    type?: 'string' | 'number';
    minLength?: number;
    maxLength?: number;
};

export function validateField(value: string, rule: FieldRule): string | null {
    const label = rule.label ?? rule.name;
    const trimmed = value?.trim?.() ?? '';

    // For required fields, check if empty
    if (rule.required && trimmed === '') return `حقل ${label} مطلوب`;

    if (trimmed !== '') {
        if (rule.type === 'number') {
            const numValue = parseFloat(trimmed);
            if (isNaN(numValue) || numValue < 0) return `حقل ${label} يجب أن يكون رقمًا صالحًا`;
        }

        if (rule.type === 'string') {
            if (rule.minLength != null && trimmed.length < rule.minLength) return `حقل ${label} يجب أن لا يقل عن ${rule.minLength} حرف`;
            if (rule.maxLength != null && trimmed.length > rule.maxLength) return `حقل ${label} يجب أن لا يزيد عن ${rule.maxLength} حرف`;
        }
    }

    return null;
}

export function attachLiveValidation(form: HTMLFormElement, rules: FieldRule[]) {
    if (!form || typeof form.addEventListener !== 'function') {
        console.warn('attachLiveValidation: form is not a valid HTMLFormElement');
        return;
    }

    const fieldRules = new Map(rules.map((r) => [r.name, r]));
    const setError = (name: string, msg: string | null) => {
        const errorEl = form.querySelector(`[data-error-for="${name}"]`) as HTMLElement | null;
        if (errorEl) errorEl.textContent = msg ?? '';
    };

    const validateInput = (input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) => {
        const rule = fieldRules.get(input.name);
        if (!rule) return true;
        const error = validateField(String((input as HTMLInputElement).value ?? ''), rule);
        setError(input.name, error);
        if (error) {
            input.setAttribute('aria-invalid', 'true');
        } else {
            input.removeAttribute('aria-invalid');
        }
        return !error;
    };

    const updateSubmitButton = () => {
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
        if (submitButton) {
            let hasErrors = false;
            rules.forEach((r) => {
                const input = form.elements.namedItem(r.name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
                if (input && input.getAttribute('aria-invalid') === 'true') {
                    hasErrors = true;
                }
            });
            submitButton.disabled = hasErrors;
        }
    };

    form.addEventListener('input', (e) => {
        const target = e.target as HTMLElement;
        if (!('name' in target)) return;
        validateInput(target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement);
        updateSubmitButton();
    });

    form.addEventListener('submit', (e) => {
        let valid = true;
        const errors: string[] = [];

        rules.forEach((r) => {
            const input = form.elements.namedItem(r.name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
            if (input) {
                const inputValid = validateInput(input);
                if (!inputValid) {
                    errors.push(`${r.label || r.name}: ${input.getAttribute('aria-invalid') ? 'خطأ في التحقق' : 'مطلوب'}`);
                }
                valid = inputValid && valid;
            }
        });

        if (!valid) {
            e.preventDefault();
            console.log('Form submission prevented due to validation errors:', errors);
            alert('يرجى تصحيح الأخطاء قبل المتابعة');
        }
    });

    // Initial validation check
    setTimeout(() => {
        rules.forEach((r) => {
            const input = form.elements.namedItem(r.name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
            if (input) validateInput(input);
        });
        updateSubmitButton();
    }, 100);
}
