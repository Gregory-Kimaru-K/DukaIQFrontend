import { Products } from "../products/Product"

export interface Batch {
    id:string;
    products: Products[]
    updated_at:string;
    created_at:string;
}