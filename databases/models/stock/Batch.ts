export interface Batch {
    id:string;
    draft_id?: string;
    payment_method:string;
    price:string;
    payment:string;
    vendor:string;
    updated_at:string;
    created_at:string;
    draft?:boolean;
    drafted_at?:string;
}
