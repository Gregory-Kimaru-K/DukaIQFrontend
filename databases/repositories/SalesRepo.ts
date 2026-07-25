import { Q } from "@nozbe/watermelondb";
import type Collection from "@nozbe/watermelondb/Collection";

import { Creditors } from "../models/Creditors";
import { Sales } from "../models/sales/Sales";
import { SalesItem } from "../models/sales/SalesItem";
import { database } from "../watermelon/database";
import {
  CreditorRecord,
  CreditorSaleRecord,
  ProductRecord,
  SalesItemRecord,
  SalesRecord,
} from "../watermelon/models";
import { toProductDto } from "./ProductRepo";

const salesCollection = () => database.get<SalesRecord>("sales");
const salesItemsCollection = () => database.get<SalesItemRecord>("sales_items");
const creditorsCollection = () => database.get<CreditorRecord>("creditors");
const creditorSalesCollection = () =>
  database.get<CreditorSaleRecord>("creditor_sales");
const productsCollection = () => database.get<ProductRecord>("products");
const now = () => new Date().toISOString();

const findRecord = async <T extends { id: string }>(
  collection: Collection<any>,
  id: string,
): Promise<T | undefined> => {
  try {
    return (await collection.find(id)) as T;
  } catch {
    return undefined;
  }
};

export const toSaleDto = (sale: SalesRecord): Sales => ({
  id: sale.id,
  payment: sale.payment,
  payment_method: sale.paymentMethod,
  price: sale.price,
  done: sale.done,
  payee: sale.payee,
  subtotal: sale.subtotal,
  discount: sale.discount,
  tax: sale.tax,
  total: sale.total,
  balance: sale.balance,
  status: sale.status,
  reversal_reason: sale.reversalReason,
  created_at: sale.createdAt,
  updated_at: sale.updatedAt,
});

export const toSalesItemDto = async (
  item: SalesItemRecord,
): Promise<SalesItem> => {
  const [product, sale] = await Promise.all([
    productsCollection().find(item.productId),
    salesCollection().find(item.saleId),
  ]);

  return {
    id: item.id,
    product: await toProductDto(product),
    sale: toSaleDto(sale),
    quantity: item.quantity,
    price: item.price,
    unit_cost: item.unitCost,
    unit_selling_price: item.unitSellingPrice,
    line_total: item.lineTotal,
  };
};

const toCreditorDto = async (creditor: CreditorRecord): Promise<Creditors> => {
  const links = await creditorSalesCollection()
    .query(Q.where("creditor_id", creditor.id))
    .fetch();
  const sales = await Promise.all(
    links.map(async (link) => toSaleDto(await salesCollection().find(link.saleId))),
  );

  return {
    id: creditor.id,
    name: creditor.name,
    phone_number: creditor.phoneNumber,
    location: creditor.location,
    sales,
  };
};

export const SalesRepo = {
  listSales: async (): Promise<Sales[]> => {
    const sales = await salesCollection().query().fetch();
    return sales.map(toSaleDto);
  },
  getSaleById: async (id: string): Promise<Sales | undefined> => {
    const sale = await findRecord<SalesRecord>(salesCollection(), id);
    return sale ? toSaleDto(sale) : undefined;
  },
  createSale: async (sale: Omit<Sales, "id">): Promise<Sales> =>
    database.write(async () => {
      const timestamp = now();
      const total = sale.total ?? sale.price;
      const record = await salesCollection().create((newSale) => {
        newSale.payment = sale.payment;
        newSale.paymentMethod = sale.payment_method;
        newSale.subtotal = sale.subtotal ?? total;
        newSale.discount = sale.discount ?? 0;
        newSale.tax = sale.tax ?? 0;
        newSale.total = total;
        newSale.balance = sale.balance ?? Math.max(0, total - sale.payment);
        newSale.price = sale.price;
        newSale.done = sale.done;
        newSale.payee = sale.payee;
        newSale.status = sale.status ?? (sale.done ? "completed" : "draft");
        newSale.reversalReason = sale.reversal_reason;
        newSale.createdAt = sale.created_at ?? timestamp;
        newSale.updatedAt = sale.updated_at ?? timestamp;
      });
      return toSaleDto(record);
    }),
  updateSale: async (
    id: string,
    updates: Partial<Omit<Sales, "id">>,
  ): Promise<Sales | undefined> =>
    database.write(async () => {
      const sale = await findRecord<SalesRecord>(salesCollection(), id);
      if (!sale) return undefined;
      await sale.update((record) => {
        if (updates.payment !== undefined) record.payment = updates.payment;
        if (updates.payment_method !== undefined) {
          record.paymentMethod = updates.payment_method;
        }
        if (updates.price !== undefined) record.price = updates.price;
        if (updates.subtotal !== undefined) record.subtotal = updates.subtotal;
        if (updates.discount !== undefined) record.discount = updates.discount;
        if (updates.tax !== undefined) record.tax = updates.tax;
        if (updates.total !== undefined) record.total = updates.total;
        if (updates.balance !== undefined) record.balance = updates.balance;
        if (updates.done !== undefined) record.done = updates.done;
        if (updates.payee !== undefined) record.payee = updates.payee;
        if (updates.status !== undefined) record.status = updates.status;
        if ("reversal_reason" in updates) {
          record.reversalReason = updates.reversal_reason;
        }
        record.updatedAt = updates.updated_at ?? now();
      });
      return toSaleDto(sale);
    }),
  deleteSale: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const sale = await findRecord<SalesRecord>(salesCollection(), id);
      if (!sale) return false;
      await sale.destroyPermanently();
      return true;
    }),

  listSalesItems: async (): Promise<SalesItem[]> => {
    const items = await salesItemsCollection().query().fetch();
    return Promise.all(items.map(toSalesItemDto));
  },
  getSalesItemById: async (id: string): Promise<SalesItem | undefined> => {
    const item = await findRecord<SalesItemRecord>(salesItemsCollection(), id);
    return item ? toSalesItemDto(item) : undefined;
  },
  createSalesItem: async (item: Omit<SalesItem, "id">): Promise<SalesItem> =>
    database.write(async () => {
      const record = await salesItemsCollection().create((newItem) => {
        newItem.productId = item.product.id;
        newItem.saleId = item.sale.id;
        newItem.quantity = item.quantity;
        newItem.unitCost = item.unit_cost ?? 0;
        newItem.unitSellingPrice = item.unit_selling_price ?? item.price;
        newItem.lineTotal = item.line_total ?? item.quantity * item.price;
        newItem.price = item.price;
      });
      return toSalesItemDto(record);
    }),
  updateSalesItem: async (
    id: string,
    updates: Partial<Omit<SalesItem, "id">>,
  ): Promise<SalesItem | undefined> =>
    database.write(async () => {
      const item = await findRecord<SalesItemRecord>(salesItemsCollection(), id);
      if (!item) return undefined;
      await item.update((record) => {
        if (updates.product !== undefined) record.productId = updates.product.id;
        if (updates.sale !== undefined) record.saleId = updates.sale.id;
        if (updates.quantity !== undefined) record.quantity = updates.quantity;
        if (updates.unit_cost !== undefined) record.unitCost = updates.unit_cost;
        if (updates.unit_selling_price !== undefined) {
          record.unitSellingPrice = updates.unit_selling_price;
        }
        if (updates.line_total !== undefined) record.lineTotal = updates.line_total;
        if (updates.price !== undefined) record.price = updates.price;
      });
      return toSalesItemDto(item);
    }),
  deleteSalesItem: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const item = await findRecord<SalesItemRecord>(salesItemsCollection(), id);
      if (!item) return false;
      await item.destroyPermanently();
      return true;
    }),

  listCreditors: async (): Promise<Creditors[]> => {
    const creditors = await creditorsCollection().query().fetch();
    return Promise.all(creditors.map(toCreditorDto));
  },
  getCreditorById: async (id: string): Promise<Creditors | undefined> => {
    const creditor = await findRecord<CreditorRecord>(
      creditorsCollection(),
      id,
    );
    return creditor ? toCreditorDto(creditor) : undefined;
  },
  createCreditor: async (creditor: Omit<Creditors, "id">): Promise<Creditors> =>
    database.write(async () => {
      const timestamp = now();
      const record = await creditorsCollection().create((newCreditor) => {
        newCreditor.name = creditor.name;
        newCreditor.phoneNumber = creditor.phone_number;
        newCreditor.location = creditor.location;
        newCreditor.createdAt = timestamp;
        newCreditor.updatedAt = timestamp;
      });
      const links = creditor.sales.map((sale) =>
        creditorSalesCollection().prepareCreate((link) => {
          link.creditorId = record.id;
          link.saleId = sale.id;
        }),
      );
      await database.batch(links);
      return toCreditorDto(record);
    }),
  updateCreditor: async (
    id: string,
    updates: Partial<Omit<Creditors, "id">>,
  ): Promise<Creditors | undefined> =>
    database.write(async () => {
      const creditor = await findRecord<CreditorRecord>(
        creditorsCollection(),
        id,
      );
      if (!creditor) return undefined;
      await creditor.update((record) => {
        if (updates.name !== undefined) record.name = updates.name;
        if (updates.phone_number !== undefined) {
          record.phoneNumber = updates.phone_number;
        }
        if (updates.location !== undefined) record.location = updates.location;
        record.updatedAt = now();
      });
      if (updates.sales !== undefined) {
        const currentLinks = await creditorSalesCollection()
          .query(Q.where("creditor_id", creditor.id))
          .fetch();
        await database.batch(
          currentLinks.map((link) => link.prepareDestroyPermanently()),
          updates.sales.map((sale) =>
            creditorSalesCollection().prepareCreate((link) => {
              link.creditorId = creditor.id;
              link.saleId = sale.id;
            }),
          ),
        );
      }
      return toCreditorDto(creditor);
    }),
  deleteCreditor: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const creditor = await findRecord<CreditorRecord>(
        creditorsCollection(),
        id,
      );
      if (!creditor) return false;
      const links = await creditorSalesCollection()
        .query(Q.where("creditor_id", creditor.id))
        .fetch();
      await database.batch(
        links.map((link) => link.prepareDestroyPermanently()),
        creditor.prepareDestroyPermanently(),
      );
      return true;
    }),
};
