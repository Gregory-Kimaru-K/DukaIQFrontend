import { Product } from "../products/Product";
import { Batch } from "./Batch";

export interface BatchItem {
  id: string;
  batch: Batch;
  product: Product;
  quantity: number;
  expiry?: string;
  price: number;
  vat?: number;
  exercise_duty: number;
  profit: number;
  updated_at: string;
}
