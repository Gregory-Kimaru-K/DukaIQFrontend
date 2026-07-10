import { Sales } from "./sales/Sales";

export interface Creditors {
  id: string;
  name: string;
  phone_number: string;
  location: string;
  sales: Sales[];
}
