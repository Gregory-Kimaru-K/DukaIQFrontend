import { Shop } from "./Shop";

export interface Category {
    id:string;
    name:string;
    shop: Shop;
    updated_at:string;
    created_at:string;
}