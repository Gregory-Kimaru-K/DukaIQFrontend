export interface Batch {
    id:string;
    vendor_id?: string;
    payment_method:string;
    total_amount?: number;
    amount_paid?: number;
    balance?: number;
    vendor:string;
    status?: string;
    updated_at:string;
    created_at:string;
}
