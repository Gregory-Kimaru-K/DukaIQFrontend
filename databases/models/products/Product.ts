import { Shop } from "./Shop";
import { Category } from "./Category";
import { Type } from "./Type";

export interface Products {
    id: string;
    barcode?:string;
    name: string;
    shop: Shop;
    category: Category;
    type: Type;
    quantity:number;
    expiry?:string;
    price:string;
    vat?:string;
    exercise_duty:string;
    profit:string;
    updated_at:string;
    created_at:string;
}