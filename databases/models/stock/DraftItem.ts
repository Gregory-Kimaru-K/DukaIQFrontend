import { Product } from "../products/Product";
import { DraftBatch } from "./Draft";

export interface DraftItem {
  id: string;
  draft: DraftBatch;
  product: Product;
  quantity: number;
  expiry?: string;
  price: number;
  vat?: number;
  exercise_duty: number;
  profit: number;
  updated_at: string;
}
