import { Vendor } from "../products/Vendors";
import { Batch } from "./Batch";
import { BatchPayment } from "./BatchPayment";

export interface VendorCredit {
  id: string;
  vendor_id: string;
  vendor?: Vendor;
  batch: Batch;
  original_amount: number;
  amount_paid: number;
  balance: number;
  status: string;
  created_at: string;
  settled_at?: string;
}

export interface VendorCreditPayment {
  id: string;
  vendor_credit: VendorCredit;
  batch_payment?: BatchPayment;
  payment_method: string;
  amount: number;
  reference?: string;
  created_at: string;
}
