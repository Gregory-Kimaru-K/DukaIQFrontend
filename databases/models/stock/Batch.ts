export interface Batch {
    id:string;
    draft_id?: string;
    vendor_id?: string;
    payment_method:string;
    price:number;
    payment:number;
    total_amount?: number;
    amount_paid?: number;
    balance?: number;
    vendor:string;
    status?: string;
    updated_at:string;
    created_at:string;
}
