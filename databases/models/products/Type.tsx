import { Category } from "./Category";

export interface Type {
    id:string;
    name:string;
    category: Category;
    updated_at:string;
    created_at:string;
}