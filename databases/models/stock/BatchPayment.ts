import { Batch } from "./Batch";

export interface BatchPayment {
  id: string;
  batch: Batch;
  payment_method: string;
  amount: number;
  reference?: string;
  created_at: string;
}
