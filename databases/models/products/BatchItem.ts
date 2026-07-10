import { Batch } from "../stock/Batch";
import { Products } from "./Product";

export interface BatchItem {
    id: string;
    batch:Batch;
    product: Products;
    quantity:number;
    expiry?:string;
    price:number;
    vat?:number;
    exercise_duty:number;
    profit:number;
    updated_at:string;
}