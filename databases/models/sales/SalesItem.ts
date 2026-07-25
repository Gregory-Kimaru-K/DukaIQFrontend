import { Product } from "../products/Product";
import { Sales } from "./Sales";

export interface SalesItem {
    id:string;
    product:Product;
    sale:Sales;
    quantity:number;
    price:number;
    unit_cost?: number;
    unit_selling_price?: number;
    line_total?: number;
}
