import { Creditorss, SalesItems, Saless } from "../FakeDatabase";
import { Creditors } from "../models/Creditors";
import { Sales } from "../models/sales/Sales";
import { SalesItem } from "../models/sales/SalesItem";

const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const SalesRepo = {
  listSales: () => Saless,
  getSaleById: (id: string) => Saless.find((sale) => sale.id === id),
  createSale: (sale: Omit<Sales, "id">): Sales => {
    const newSale: Sales = {
      id: generateId(),
      ...sale,
    };
    Saless.push(newSale);
    return newSale;
  },
  updateSale: (
    id: string,
    updates: Partial<Omit<Sales, "id">>,
  ): Sales | undefined => {
    const index = Saless.findIndex((sale) => sale.id === id);
    if (index === -1) return undefined;
    Saless[index] = {
      ...Saless[index],
      ...updates,
    };
    return Saless[index];
  },
  deleteSale: (id: string): boolean => {
    const index = Saless.findIndex((sale) => sale.id === id);
    if (index === -1) return false;
    Saless.splice(index, 1);
    return true;
  },

  listSalesItems: () => SalesItems,
  getSalesItemById: (id: string) => SalesItems.find((item) => item.id === id),
  createSalesItem: (item: Omit<SalesItem, "id">): SalesItem => {
    const newItem: SalesItem = {
      id: generateId(),
      ...item,
    };
    SalesItems.push(newItem);
    return newItem;
  },
  updateSalesItem: (
    id: string,
    updates: Partial<Omit<SalesItem, "id">>,
  ): SalesItem | undefined => {
    const index = SalesItems.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    SalesItems[index] = {
      ...SalesItems[index],
      ...updates,
    };
    return SalesItems[index];
  },
  deleteSalesItem: (id: string): boolean => {
    const index = SalesItems.findIndex((item) => item.id === id);
    if (index === -1) return false;
    SalesItems.splice(index, 1);
    return true;
  },

  listCreditors: () => Creditorss,
  getCreditorById: (id: string) =>
    Creditorss.find((creditor) => creditor.id === id),
  createCreditor: (creditor: Omit<Creditors, "id">): Creditors => {
    const newCreditor: Creditors = {
      id: generateId(),
      ...creditor,
    };
    Creditorss.push(newCreditor);
    return newCreditor;
  },
  updateCreditor: (
    id: string,
    updates: Partial<Omit<Creditors, "id">>,
  ): Creditors | undefined => {
    const index = Creditorss.findIndex((creditor) => creditor.id === id);
    if (index === -1) return undefined;
    Creditorss[index] = {
      ...Creditorss[index],
      ...updates,
    };
    return Creditorss[index];
  },
  deleteCreditor: (id: string): boolean => {
    const index = Creditorss.findIndex((creditor) => creditor.id === id);
    if (index === -1) return false;
    Creditorss.splice(index, 1);
    return true;
  },
};