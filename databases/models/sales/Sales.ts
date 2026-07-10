import { Products } from "../products/Product";

export interface Sales {
    id:string;
    products: Products[];
    payment:string;
    price:string;
    done:boolean;
    payee:string;
}