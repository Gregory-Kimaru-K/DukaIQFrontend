export interface Sales {
    id:string;
    payment:number;
    payment_method:string;
    price:number;
    receipt_number?: string;
    customer_name_snapshot?: string;
    creditor_id?: string;
    amount_paid?: number;
    cost_total?: number;
    gross_profit?: number;
    reversal_of_sale_id?: string;
    completed_at?: string;
    subtotal?: number;
    discount?: number;
    tax?: number;
    total?: number;
    balance?: number;
    done:boolean;
    payee:string;
    status?: string;
    reversal_reason?: string;
    created_at?: string;
    updated_at?: string;
}

export interface SalePayment {
    id: string;
    sale: Sales;
    payment_method: string;
    amount: number;
    reference?: string;
    status: string;
    created_at: string;
    reversed_at?: string;
}
