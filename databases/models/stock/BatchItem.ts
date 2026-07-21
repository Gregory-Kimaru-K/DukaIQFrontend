import { Product } from "../products/Product";
import { Batch } from "./Batch";
import { TaxType } from "./TaxType";

export interface BatchItem {
  id: string;
  batch: Batch;
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
