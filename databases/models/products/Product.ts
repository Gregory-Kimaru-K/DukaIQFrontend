import { Shop } from "./Shop";
import { Category } from "./Category";
import { Type } from "./Type";

export interface Products {
    id: string;
    name: string;
    shop: Shop;
    category: Category;
    type: Type;
    quantity:string;
    expiry?:string;
    price:string;
    updated_at:string;
    created_at:string;
}