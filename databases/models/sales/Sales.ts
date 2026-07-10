import { Products } from "../products/Product";

export interface Sales {
    id:string;
    payment:string;
    payment_method:string;
    price:string;
    done:boolean;
    payee:string;
}