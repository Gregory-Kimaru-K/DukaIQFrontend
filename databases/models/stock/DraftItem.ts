import { Product } from "../products/Product";
import { DraftBatch } from "./Draft";
import { TaxType } from "./TaxType";

export interface DraftItem {
  id: string;
  draft: DraftBatch;
  product: Product;
  quantity: number;
  expiry?: string;
  price: number;
  vat?: number;
  tax_type_id?: string;
  tax_type?: TaxType;
  exercise_duty: number;
  profit: number;
  updated_at: string;
}
