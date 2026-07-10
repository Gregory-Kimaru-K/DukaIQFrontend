import { Product } from "../products/Product";
import { Sales } from "./Sales";

export interface SalesItem {
    id:string;
    product:Product;
    sale:Sales;
    quantity:number;
    price:number;
}