import { Sales } from "./sales/Sales";

export interface Creditors {
  id: string;
  name: string;
  phone_number: string;
  location: string;
  sales: Sales[];
}

export interface CreditorSale {
  id: string;
  creditor: Creditors;
  sale: Sales;
  original_amount: number;
  amount_paid: number;
  balance: number;
  status: string;
  created_at: string;
  settled_at?: string;
}

export interface CreditorRepayment {
  id: string;
  creditor_sale: CreditorSale;
  sale_payment_id?: string;
  payment_method: string;
  amount: number;
  reference?: string;
  created_at: string;
}
