import { BatchItem } from "../stock/BatchItem";
import { Category } from "./Category";
import { Shop } from "./Shop";
import { Type } from "./Type";

export interface Product {
  id: string;
  barcode?: string;
  name: string;
  shop: Shop;
  category: Category;
  type: Type;
  created_at: string;
  current_stock: number;
  total_purchased: number;
  total_sold: number;
  current_batch: BatchItem;
  batch_count: number;
  unit: "Unit" | "Kg" | "Litre";
}
