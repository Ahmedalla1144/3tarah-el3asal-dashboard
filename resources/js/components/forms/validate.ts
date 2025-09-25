export type FieldRule = {
    name: string;
    label?: string;
    required?: boolean;
    type?: 'string' | 'number' | 'phone' | 'email' | 'password' | 'confirmPassword';
    minLength?: number;
    maxLength?: number;
    matchWith?: string;
};

export function validateField(value: string, rule: FieldRule, form?: HTMLFormElement): string | null {
    const { label = rule.name, required = true, type = 'string', minLength = 3, maxLength = 80 } = rule;

    const trimmed = value?.trim?.() ?? '';

    if (required && trimmed === '') return `حقل ${label} مطلوب`;

    if (trimmed !== '') {
        if (type === 'number') {
            const numValue = parseFloat(trimmed);
            if (isNaN(numValue) || numValue < 0) return `حقل ${label} يجب أن يكون رقمًا صالحًا`;
        }

        if (type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(trimmed)) return `حقل ${label} يجب أن يكون بريدًا إلكترونيًا صالحًا`;
        }

        if (type === 'password') {
            if (minLength != null && trimmed.length < minLength) return `حقل ${label} يجب أن لا يقل عن ${minLength} أحرف`;
            if (maxLength != null && trimmed.length > maxLength) return `حقل ${label} يجب أن لا يزيد عن ${maxLength} أحرف`;
        }

        if (type === 'confirmPassword' && form) {
            const target = form.querySelector<HTMLInputElement>(`[name="${rule.matchWith}"]`);
            if (target && target.value !== trimmed) {
                return `حقل ${label} لا يطابق ${rule.matchWith == 'password' ? 'كلمة المرور' : rule.matchWith}`;
            }
        }

        if (type === 'string') {
            if (minLength != null && trimmed.length < minLength) return `حقل ${label} يجب أن لا يقل عن ${minLength} حرف`;
            if (maxLength != null && trimmed.length > maxLength) return `حقل ${label} يجب أن لا يزيد عن ${maxLength} حرف`;
        }

        if (type === 'phone') {
            const phoneRegex = /^(010|011|012|015)[0-9]{8}$/;
            if (!phoneRegex.test(trimmed)) {
                return `حقل ${label} يجب أن يكون رقم هاتف مصري صحيح (مثال: 01012345678)`;
            }
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
        const error = validateField(input.value ?? '', rule, form);
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
                if (input) {
                    const valid = validateInput(input);
                    if (!valid) hasErrors = true;
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

    setTimeout(() => {
        rules.forEach((r) => {
            const input = form.elements.namedItem(r.name) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
            if (input) validateInput(input);
        });
        updateSubmitButton();
    }, 100);
}
