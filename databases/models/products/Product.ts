import { Shop } from "./Shop";
import { Category } from "./Category";
import { Type } from "./Type";
import { BatchItem } from "./BatchItem";

export interface Products {
    id: string;
    barcode?:string;
    name: string;
    shop: Shop;
    category: Category;
    type: Type;
    created_at:string;
    current_stock: number;
    total_purchased:number;
    total_sold:number;
    current_batch:BatchItem;
    batch_count:number;
}