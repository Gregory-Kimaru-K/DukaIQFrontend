import { Product } from "../products/Product";
import { Sales } from "./Sales";

export interface SalesItem {
    id:string;
    product:Product;
    sale:Sales;
    batch_id?: string;
    batch_item_id?: string;
    product_name_snapshot?: string;
    product_barcode_snapshot?: string;
    quantity:number;
    price:number;
    unit_cost?: number;
    unit_selling_price?: number;
    line_total?: number;
    line_cost?: number;
    gross_profit?: number;
    stock_movement_id?: string;
    created_at?: string;
}
