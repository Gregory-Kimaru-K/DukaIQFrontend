import { Q } from "@nozbe/watermelondb";
import type Collection from "@nozbe/watermelondb/Collection";

import { CreditorRepayment, Creditors, CreditorSale } from "../models/Creditors";
import { SalePayment, Sales } from "../models/sales/Sales";
import { SalesItem } from "../models/sales/SalesItem";
import { database } from "../watermelon/database";
import {
  CreditorRepaymentRecord,
  CreditorRecord,
  CreditorSaleRecord,
  ProductRecord,
  SalePaymentRecord,
  SalesItemRecord,
  SalesRecord,
} from "../watermelon/models";
import { toProductDto } from "./ProductRepo";

const salesCollection = () => database.get<SalesRecord>("sales");
const salesItemsCollection = () => database.get<SalesItemRecord>("sales_items");
const salePaymentsCollection = () =>
  database.get<SalePaymentRecord>("sale_payments");
const creditorsCollection = () => database.get<CreditorRecord>("creditors");
const creditorSalesCollection = () =>
  database.get<CreditorSaleRecord>("creditor_sales");
const creditorRepaymentsCollection = () =>
  database.get<CreditorRepaymentRecord>("creditor_repayments");
const productsCollection = () => database.get<ProductRecord>("products");
const now = () => new Date().toISOString();
const createReceiptNumber = () => `SALE-${Date.now().toString().slice(-8)}`;

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
  receipt_number: sale.receiptNumber,
  customer_name_snapshot: sale.customerNameSnapshot,
  creditor_id: sale.creditorId,
  amount_paid: sale.amountPaid,
  cost_total: sale.costTotal,
  gross_profit: sale.grossProfit,
  reversal_of_sale_id: sale.reversalOfSaleId,
  completed_at: sale.completedAt,
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

export const toSalePaymentDto = async (
  payment: SalePaymentRecord,
): Promise<SalePayment> => {
  const sale = await salesCollection().find(payment.saleId);

  return {
    id: payment.id,
    sale: toSaleDto(sale),
    payment_method: payment.paymentMethod,
    amount: payment.amount,
    reference: payment.reference,
    status: payment.status,
    created_at: payment.createdAt,
    reversed_at: payment.reversedAt,
  };
};

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
    batch_id: item.batchId,
    batch_item_id: item.batchItemId,
    product_name_snapshot: item.productNameSnapshot,
    product_barcode_snapshot: item.productBarcodeSnapshot,
    quantity: item.quantity,
    price: item.price,
    unit_cost: item.unitCost,
    unit_selling_price: item.unitSellingPrice,
    line_total: item.lineTotal,
    line_cost: item.lineCost,
    gross_profit: item.grossProfit,
    stock_movement_id: item.stockMovementId,
    created_at: item.createdAt,
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

const toCreditorSaleDto = async (
  link: CreditorSaleRecord,
): Promise<CreditorSale> => {
  const [creditor, sale] = await Promise.all([
    creditorsCollection().find(link.creditorId),
    salesCollection().find(link.saleId),
  ]);

  return {
    id: link.id,
    creditor: await toCreditorDto(creditor),
    sale: toSaleDto(sale),
    original_amount: link.originalAmount,
    amount_paid: link.amountPaid,
    balance: link.balance,
    status: link.status,
    created_at: link.createdAt,
    settled_at: link.settledAt,
  };
};

const toCreditorRepaymentDto = async (
  repayment: CreditorRepaymentRecord,
): Promise<CreditorRepayment> => {
  const creditorSale = await creditorSalesCollection().find(
    repayment.creditorSaleId,
  );

  return {
    id: repayment.id,
    creditor_sale: await toCreditorSaleDto(creditorSale),
    sale_payment_id: repayment.salePaymentId,
    payment_method: repayment.paymentMethod,
    amount: repayment.amount,
    reference: repayment.reference,
    created_at: repayment.createdAt,
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
      const amountPaid = sale.amount_paid ?? sale.payment ?? 0;
      const record = await salesCollection().create((newSale) => {
        newSale.receiptNumber = sale.receipt_number ?? createReceiptNumber();
        newSale.customerNameSnapshot =
          sale.customer_name_snapshot ?? sale.payee;
        newSale.creditorId = sale.creditor_id;
        newSale.subtotal = sale.subtotal ?? total;
        newSale.discount = sale.discount ?? 0;
        newSale.tax = sale.tax ?? 0;
        newSale.total = total;
        newSale.amountPaid = amountPaid;
        newSale.balance = sale.balance ?? Math.max(0, total - amountPaid);
        newSale.costTotal = sale.cost_total ?? 0;
        newSale.grossProfit = sale.gross_profit ?? total - newSale.costTotal;
        newSale.status =
          sale.status ??
          (sale.done
            ? newSale.balance > 0
              ? "partially_paid"
              : "completed"
            : "draft");
        newSale.reversalOfSaleId = sale.reversal_of_sale_id;
        newSale.reversalReason = sale.reversal_reason;
        newSale.createdAt = sale.created_at ?? timestamp;
        newSale.completedAt =
          sale.completed_at ??
          (newSale.status === "completed" || newSale.status === "partially_paid"
            ? timestamp
            : undefined);
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
        if (updates.receipt_number !== undefined) {
          record.receiptNumber = updates.receipt_number;
        }
        if (updates.customer_name_snapshot !== undefined) {
          record.customerNameSnapshot = updates.customer_name_snapshot;
        }
        if ("creditor_id" in updates) record.creditorId = updates.creditor_id;
        if (updates.subtotal !== undefined) record.subtotal = updates.subtotal;
        if (updates.discount !== undefined) record.discount = updates.discount;
        if (updates.tax !== undefined) record.tax = updates.tax;
        if (updates.total !== undefined) record.total = updates.total;
        if (updates.amount_paid !== undefined) record.amountPaid = updates.amount_paid;
        if (updates.payment !== undefined) record.amountPaid = updates.payment;
        if (updates.balance !== undefined) record.balance = updates.balance;
        if (updates.cost_total !== undefined) record.costTotal = updates.cost_total;
        if (updates.gross_profit !== undefined) {
          record.grossProfit = updates.gross_profit;
        }
        if (updates.price !== undefined) record.total = updates.price;
        if (updates.payee !== undefined) record.customerNameSnapshot = updates.payee;
        if (updates.status !== undefined) record.status = updates.status;
        if (updates.done !== undefined && updates.status === undefined) {
          record.status = updates.done ? "completed" : "draft";
        }
        if ("reversal_of_sale_id" in updates) {
          record.reversalOfSaleId = updates.reversal_of_sale_id;
        }
        if ("reversal_reason" in updates) {
          record.reversalReason = updates.reversal_reason;
        }
        if ("completed_at" in updates) record.completedAt = updates.completed_at;
        record.updatedAt = updates.updated_at ?? now();
      });
      return toSaleDto(sale);
    }),
  deleteSale: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const sale = await findRecord<SalesRecord>(salesCollection(), id);
      if (!sale) return false;
      await sale.update((record) => {
        record.status = "cancelled";
        record.updatedAt = now();
      });
      return true;
    }),

  listSalePayments: async (): Promise<SalePayment[]> => {
    const payments = await salePaymentsCollection().query().fetch();
    return Promise.all(payments.map(toSalePaymentDto));
  },
  listSalePaymentsBySale: async (saleId: string): Promise<SalePayment[]> => {
    const payments = await salePaymentsCollection()
      .query(Q.where("sale_id", saleId))
      .fetch();
    return Promise.all(payments.map(toSalePaymentDto));
  },
  getSalePaymentById: async (id: string): Promise<SalePayment | undefined> => {
    const payment = await findRecord<SalePaymentRecord>(
      salePaymentsCollection(),
      id,
    );
    return payment ? toSalePaymentDto(payment) : undefined;
  },
  createSalePayment: async (
    payment: Omit<SalePayment, "id" | "created_at">,
  ): Promise<SalePayment> =>
    database.write(async () => {
      const timestamp = now();
      const sale = await salesCollection().find(payment.sale.id);
      const record = await salePaymentsCollection().create((newPayment) => {
        newPayment.saleId = payment.sale.id;
        newPayment.paymentMethod = payment.payment_method;
        newPayment.amount = payment.amount;
        newPayment.reference = payment.reference;
        newPayment.status = payment.status ?? "completed";
        newPayment.createdAt = timestamp;
        newPayment.reversedAt = payment.reversed_at;
      });
      await sale.update((recordSale) => {
        recordSale.amountPaid = sale.amountPaid + payment.amount;
        recordSale.balance = Math.max(0, sale.total - recordSale.amountPaid);
        recordSale.status =
          recordSale.balance > 0 ? "partially_paid" : "completed";
        recordSale.updatedAt = timestamp;
      });
      return toSalePaymentDto(record);
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
        newItem.batchId = item.batch_id ?? "";
        newItem.batchItemId = item.batch_item_id ?? "";
        newItem.productNameSnapshot =
          item.product_name_snapshot ?? item.product.name;
        newItem.productBarcodeSnapshot =
          item.product_barcode_snapshot ?? item.product.barcode;
        newItem.quantity = item.quantity;
        newItem.unitCost = item.unit_cost ?? 0;
        newItem.unitSellingPrice = item.unit_selling_price ?? item.price;
        newItem.lineTotal = item.line_total ?? item.quantity * item.price;
        newItem.lineCost =
          item.line_cost ?? item.quantity * (item.unit_cost ?? 0);
        newItem.grossProfit =
          item.gross_profit ?? newItem.lineTotal - newItem.lineCost;
        newItem.stockMovementId = item.stock_movement_id;
        newItem.createdAt = item.created_at ?? now();
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
        if (updates.batch_id !== undefined) record.batchId = updates.batch_id;
        if (updates.batch_item_id !== undefined) {
          record.batchItemId = updates.batch_item_id;
        }
        if (updates.product_name_snapshot !== undefined) {
          record.productNameSnapshot = updates.product_name_snapshot;
        }
        if ("product_barcode_snapshot" in updates) {
          record.productBarcodeSnapshot = updates.product_barcode_snapshot;
        }
        if (updates.quantity !== undefined) record.quantity = updates.quantity;
        if (updates.unit_cost !== undefined) record.unitCost = updates.unit_cost;
        if (updates.unit_selling_price !== undefined) {
          record.unitSellingPrice = updates.unit_selling_price;
        }
        if (updates.line_total !== undefined) record.lineTotal = updates.line_total;
        if (updates.line_cost !== undefined) record.lineCost = updates.line_cost;
        if (updates.gross_profit !== undefined) {
          record.grossProfit = updates.gross_profit;
        }
        if ("stock_movement_id" in updates) {
          record.stockMovementId = updates.stock_movement_id;
        }
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
          const balance = sale.balance ?? Math.max(0, sale.price - sale.payment);
          link.creditorId = record.id;
          link.saleId = sale.id;
          link.originalAmount = balance;
          link.amountPaid = 0;
          link.balance = balance;
          link.status = balance > 0 ? "open" : "paid";
          link.createdAt = timestamp;
          link.settledAt = balance > 0 ? undefined : timestamp;
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
              const balance = sale.balance ?? Math.max(0, sale.price - sale.payment);
              link.creditorId = creditor.id;
              link.saleId = sale.id;
              link.originalAmount = balance;
              link.amountPaid = 0;
              link.balance = balance;
              link.status = balance > 0 ? "open" : "paid";
              link.createdAt = now();
              link.settledAt = balance > 0 ? undefined : now();
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

  listCreditorSales: async (): Promise<CreditorSale[]> => {
    const links = await creditorSalesCollection().query().fetch();
    return Promise.all(links.map(toCreditorSaleDto));
  },
  getCreditorSaleById: async (
    id: string,
  ): Promise<CreditorSale | undefined> => {
    const link = await findRecord<CreditorSaleRecord>(
      creditorSalesCollection(),
      id,
    );
    return link ? toCreditorSaleDto(link) : undefined;
  },
  listCreditorRepayments: async (): Promise<CreditorRepayment[]> => {
    const repayments = await creditorRepaymentsCollection().query().fetch();
    return Promise.all(repayments.map(toCreditorRepaymentDto));
  },
  createCreditorRepayment: async (
    repayment: Omit<CreditorRepayment, "id" | "created_at">,
  ): Promise<CreditorRepayment> =>
    database.write(async () => {
      const timestamp = now();
      const creditorSale = await creditorSalesCollection().find(
        repayment.creditor_sale.id,
      );
      const record = await creditorRepaymentsCollection().create((newRepayment) => {
        newRepayment.creditorSaleId = repayment.creditor_sale.id;
        newRepayment.salePaymentId = repayment.sale_payment_id;
        newRepayment.paymentMethod = repayment.payment_method;
        newRepayment.amount = repayment.amount;
        newRepayment.reference = repayment.reference;
        newRepayment.createdAt = timestamp;
      });
      await creditorSale.update((link) => {
        link.amountPaid = creditorSale.amountPaid + repayment.amount;
        link.balance = Math.max(0, creditorSale.originalAmount - link.amountPaid);
        link.status = link.balance > 0 ? "partially_paid" : "paid";
        link.settledAt = link.balance > 0 ? undefined : timestamp;
      });
      return toCreditorRepaymentDto(record);
    }),
};
