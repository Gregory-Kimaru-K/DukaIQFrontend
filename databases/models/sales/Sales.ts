export interface Sales {
    id:string;
    payment:number;
    payment_method:string;
    price:number;
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
