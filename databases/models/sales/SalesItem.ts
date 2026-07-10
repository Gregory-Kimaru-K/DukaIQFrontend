import { Products } from "../products/Product";
import { Sales } from "./Sales";

export interface SalesItem {
    id:string;
    product:Products;
    sale:Sales;
    quantity:number;
    price:number;
}