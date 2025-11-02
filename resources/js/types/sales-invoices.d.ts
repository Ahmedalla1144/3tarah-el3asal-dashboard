export interface InvoiceItem {
    id: number;
    product: {
        id: number;
        name: string;
    };
    unit: {
        id: number;
        name: string;
    };
    qty: number;
    unit_price: number;
    discount_value: number;
    tax_value: number;
    total: number;
}

export interface PageProps {
    invoice: {
        id: number;
        number: string;
        date: string;
        status: string;
        total: number;
        paid_amount: number;
        remaining_amount: number;
        notes: string | null;
        customer: {
            id: number;
            name: string;
            current_balance: number;
            customer_balance_at_creation: number;
        } | null;
        warehouse: {
            id: number;
            name: string;
        } | null;
        items: InvoiceItem[];
    };
}
