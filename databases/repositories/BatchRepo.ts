import { Q } from "@nozbe/watermelondb";
import type Collection from "@nozbe/watermelondb/Collection";

import { database } from "../watermelon/database";
import {
  BatchItemRecord,
  BatchPaymentRecord,
  BatchRecord,
  DraftItemRecord,
  DraftRecord,
  ProductRecord,
  StockMovementRecord,
  TaxTypeRecord,
  VendorCreditPaymentRecord,
  VendorCreditRecord,
} from "../watermelon/models";
import { toProductDto } from "./ProductRepo";

const now = () => new Date().toISOString();
const createDraftName = () => `DRAFT-${Date.now().toString().slice(-6)}`;

const draftsCollection = () => database.get<DraftRecord>("drafts");
const draftItemsCollection = () => database.get<DraftItemRecord>("draft_items");
const batchesCollection = () => database.get<BatchRecord>("batches");
const batchItemsCollection = () => database.get<BatchItemRecord>("batch_items");
const batchPaymentsCollection = () => database.get<BatchPaymentRecord>("batch_payments");
const vendorCreditsCollection = () => database.get<VendorCreditRecord>("vendor_credits");
const vendorCreditPaymentsCollection = () => database.get<VendorCreditPaymentRecord>("vendor_credit_payments");
const productsCollection = () => database.get<ProductRecord>("products");
const taxTypesCollection = () => database.get<TaxTypeRecord>("tax_types");
const stockMovementsCollection = () => database.get<StockMovementRecord>("stock_movements");

const defaultTaxTypes = [
  { name: "No Tax", code: "NO_TAX", rate: 0 },
  { name: "VAT", code: "VAT", rate: 16 },
  { name: "Zero Rated", code: "ZERO_RATED", rate: 0 },
  { name: "Exempt", code: "EXEMPT", rate: 0 },
];

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

export const toDraftDto = (draft: DraftRecord) => ({
  id: draft.id,
  name: draft.name,
  created_at: draft.createdAt,
  updated_at: draft.updatedAt,
});

export const toBatchDto = (batch: BatchRecord) => ({
  id: batch.id,
  vendor_id: batch.vendorId,
  payment_method: batch.paymentMethod,
  total_amount: batch.totalAmount,
  amount_paid: batch.amountPaid,
  balance: batch.balance,
  vendor: batch.vendor,
  status: batch.status,
  updated_at: batch.updatedAt,
  created_at: batch.createdAt,
});

export const toBatchPaymentDto = async (payment: BatchPaymentRecord,) => {
  const batch = await batchesCollection().find(payment.batchId);

  return {
    id: payment.id,
    batch: toBatchDto(batch),
    payment_method: payment.paymentMethod,
    amount: payment.amount,
    reference: payment.reference,
    created_at: payment.createdAt,
  };
};

export const toVendorCreditDto = async (
  credit: VendorCreditRecord,
) => {
  const batch = await batchesCollection().find(credit.batchId);

  return {
    id: credit.id,
    vendor_id: credit.vendorId,
    batch: toBatchDto(batch),
    original_amount: credit.originalAmount,
    amount_paid: credit.amountPaid,
    balance: credit.balance,
    status: credit.status,
    created_at: credit.createdAt,
    settled_at: credit.settledAt,
  };
};

export const toVendorCreditPaymentDto = async (
  payment: VendorCreditPaymentRecord,
) => {
  const [vendorCredit, batchPayment] = await Promise.all([
    vendorCreditsCollection().find(payment.vendorCreditId),
    payment.batchPaymentId
      ? findRecord<BatchPaymentRecord>(
          batchPaymentsCollection(),
          payment.batchPaymentId,
        )
      : undefined,
  ]);

  return {
    id: payment.id,
    vendor_credit: await toVendorCreditDto(vendorCredit),
    batch_payment: batchPayment
      ? await toBatchPaymentDto(batchPayment)
      : undefined,
    payment_method: payment.paymentMethod,
    amount: payment.amount,
    reference: payment.reference,
    created_at: payment.createdAt,
  };
};

export const toTaxTypeDto = (taxType: TaxTypeRecord) => ({
  id: taxType.id,
  name: taxType.name,
  code: taxType.code,
  rate: taxType.rate,
  active: taxType.active,
  created_at: taxType.createdAt,
  updated_at: taxType.updatedAt,
});

const getTaxTypeDto = async (
  taxTypeId?: string,
) => {
  if (!taxTypeId) return undefined;
  const taxType = await findRecord<TaxTypeRecord>(
    taxTypesCollection(),
    taxTypeId,
  );
  return taxType ? toTaxTypeDto(taxType) : undefined;
};

export const toDraftItemDto = async (
  item: DraftItemRecord,
) => {
  const [draft, product, taxType] = await Promise.all([
    draftsCollection().find(item.draftId),
    productsCollection().find(item.productId),
    getTaxTypeDto(item.taxTypeId),
  ]);

  return {
    id: item.id,
    draft: toDraftDto(draft),
    product: await toProductDto(product),
    quantity: item.quantity,
    expiry: item.expiry,
    price: item.price,
    vat: item.vat,
    tax_type_id: item.taxTypeId,
    tax_type: taxType,
    exercise_duty: item.exerciseDuty,
    profit: item.profit,
    updated_at: item.updatedAt,
  };
};

export const toBatchItemDto = async (
  item: BatchItemRecord,
) => {
  const [batch, product, taxType] = await Promise.all([
    batchesCollection().find(item.batchId),
    productsCollection().find(item.productId),
    getTaxTypeDto(item.taxTypeId),
  ]);

  return {
    id: item.id,
    batch: toBatchDto(batch),
    product: await toProductDto(product),
    quantity: item.quantity,
    expiry: item.expiry,
    price: item.price,
    vat: item.vat,
    tax_type_id: item.taxTypeId,
    tax_type: taxType,
    exercise_duty: item.exerciseDuty,
    profit: item.profit,
    updated_at: item.updatedAt,
  };
};

export type DraftBatch = ReturnType<typeof toDraftDto>;
export type Batch = ReturnType<typeof toBatchDto>;
export type BatchPayment = Awaited<ReturnType<typeof toBatchPaymentDto>>;
export type VendorCredit = Awaited<ReturnType<typeof toVendorCreditDto>>;
export type VendorCreditPayment = Awaited<
  ReturnType<typeof toVendorCreditPaymentDto>
>;
export type TaxType = ReturnType<typeof toTaxTypeDto>;
export type DraftItem = Awaited<ReturnType<typeof toDraftItemDto>>;
export type BatchItem = Awaited<ReturnType<typeof toBatchItemDto>>;

const ensureDefaultTaxTypes = async (): Promise<void> => {
  const existing = await taxTypesCollection().query().fetch();
  if (existing.length > 0) return;

  await database.write(async () => {
    const timestamp = now();
    await database.batch(
      defaultTaxTypes.map((taxType) =>
        taxTypesCollection().prepareCreate((record) => {
          record.name = taxType.name;
          record.code = taxType.code;
          record.rate = taxType.rate;
          record.active = true;
          record.createdAt = timestamp;
          record.updatedAt = timestamp;
        }),
      ),
    );
  });
};

export const BatchRepo = {
  listTaxTypes: async (): Promise<TaxType[]> => {
    await ensureDefaultTaxTypes();
    const taxTypes = await taxTypesCollection()
      .query(Q.where("active", true))
      .fetch();
    return taxTypes.map(toTaxTypeDto);
  },
  createTaxType: async (
    taxType: Omit<TaxType, "id" | "created_at" | "updated_at">,
  ): Promise<TaxType> =>
    database.write(async () => {
      const timestamp = now();
      const record = await taxTypesCollection().create((newTaxType) => {
        newTaxType.name = taxType.name;
        newTaxType.code = taxType.code;
        newTaxType.rate = taxType.rate;
        newTaxType.active = taxType.active;
        newTaxType.createdAt = timestamp;
        newTaxType.updatedAt = timestamp;
      });
      return toTaxTypeDto(record);
    }),
  updateTaxType: async (
    id: string,
    updates: Partial<Omit<TaxType, "id" | "created_at" | "updated_at">>,
  ): Promise<TaxType | undefined> =>
    database.write(async () => {
      const taxType = await findRecord<TaxTypeRecord>(taxTypesCollection(), id);
      if (!taxType) return undefined;
      await taxType.update((record) => {
        if (updates.name !== undefined) record.name = updates.name;
        if (updates.code !== undefined) record.code = updates.code;
        if (updates.rate !== undefined) record.rate = updates.rate;
        if (updates.active !== undefined) record.active = updates.active;
        record.updatedAt = now();
      });
      return toTaxTypeDto(taxType);
    }),
  listDrafts: async (): Promise<DraftBatch[]> => {
    const drafts = await draftsCollection().query().fetch();
    return drafts.map(toDraftDto);
  },
  getDraftById: async (id: string): Promise<DraftBatch | undefined> => {
    const draft = await findRecord<DraftRecord>(draftsCollection(), id);
    return draft ? toDraftDto(draft) : undefined;
  },
  createDraft: async (name = createDraftName()): Promise<DraftBatch> =>
    database.write(async () => {
      const timestamp = now();
      const record = await draftsCollection().create((draft) => {
        draft.name = name;
        draft.createdAt = timestamp;
        draft.updatedAt = timestamp;
      });
      return toDraftDto(record);
    }),
  updateDraft: async (
    id: string,
    updates: Partial<Omit<DraftBatch, "id" | "created_at" | "updated_at">>,
  ): Promise<DraftBatch | undefined> =>
    database.write(async () => {
      const draft = await findRecord<DraftRecord>(draftsCollection(), id);
      if (!draft) return undefined;
      await draft.update((record) => {
        if (updates.name !== undefined) record.name = updates.name;
        record.updatedAt = now();
      });
      return toDraftDto(draft);
    }),
  deleteDraft: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const draft = await findRecord<DraftRecord>(draftsCollection(), id);
      if (!draft) return false;
      const items = await draftItemsCollection()
        .query(Q.where("draft_id", id))
        .fetch();
      await database.batch(
        items.map((item) => item.prepareDestroyPermanently()),
        draft.prepareDestroyPermanently(),
      );
      return true;
    }),
  listDraftItems: async (draftId: string): Promise<DraftItem[]> => {
    const items = await draftItemsCollection()
      .query(Q.where("draft_id", draftId))
      .fetch();
    return Promise.all(items.map(toDraftItemDto));
  },
  getDraftItemById: async (id: string): Promise<DraftItem | undefined> => {
    const item = await findRecord<DraftItemRecord>(draftItemsCollection(), id);
    return item ? toDraftItemDto(item) : undefined;
  },
  deleteDraftItem: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const item = await findRecord<DraftItemRecord>(draftItemsCollection(), id);
      if (!item) return false;
      await item.destroyPermanently();
      return true;
    }),
  clearDraftItems: async (
    draftId: string,
    draftItemIds?: string[],
  ): Promise<number> =>
    database.write(async () => {
      const items =
        draftItemIds && draftItemIds.length > 0
          ? (
              await Promise.all(
                draftItemIds.map((id) =>
                  findRecord<DraftItemRecord>(draftItemsCollection(), id),
                ),
              )
            ).filter((item): item is DraftItemRecord => Boolean(item))
          : await draftItemsCollection()
              .query(Q.where("draft_id", draftId))
              .fetch();

      await database.batch(
        items.map((item) => item.prepareDestroyPermanently()),
      );
      return items.length;
    }),
  addProductToDraft: async (
    draft: DraftBatch,
    productId: string,
  ): Promise<DraftItem> => {
    const existingItems = await draftItemsCollection()
      .query(Q.where("draft_id", draft.id), Q.where("product_id", productId))
      .fetch();
    if (existingItems[0]) return toDraftItemDto(existingItems[0]);

    const product = await toProductDto(await productsCollection().find(productId));
    return database.write(async () => {
      const record = await draftItemsCollection().create((item) => {
        item.draftId = draft.id;
        item.productId = product.id;
        item.quantity = 0;
        item.purchaseUnit = "UNIT";
        item.unitsPerPack = 1;
        item.unitCost = 0;
        item.unitSellingPrice = 0;
        item.profitAmount = 0;
        item.profitScope = "UNIT";
        item.price = 0;
        item.exerciseDuty = 0;
        item.profit = 0;
        item.updatedAt = now();
      });
      return toDraftItemDto(record);
    });
  },
  updateDraftItem: async (
    id: string,
    updates: Partial<Omit<DraftItem, "id" | "draft" | "product">>,
  ): Promise<DraftItem | undefined> =>
    database.write(async () => {
      const item = await findRecord<DraftItemRecord>(draftItemsCollection(), id);
      if (!item) return undefined;
      await item.update((record) => {
        if (updates.quantity !== undefined) record.quantity = updates.quantity;
        if ("expiry" in updates) record.expiry = updates.expiry;
        if (updates.price !== undefined) {
          record.price = updates.price;
          record.unitCost = updates.price;
        }
        if ("vat" in updates) record.vat = updates.vat;
        if ("tax_type_id" in updates) record.taxTypeId = updates.tax_type_id;
        if (updates.exercise_duty !== undefined) {
          record.exerciseDuty = updates.exercise_duty;
        }
        if (updates.profit !== undefined) {
          record.profit = updates.profit;
          record.unitSellingPrice = updates.profit;
        }
        record.updatedAt = updates.updated_at ?? now();
      });
      return toDraftItemDto(item);
    }),
  completeDraft: async (
    draftId: string,
    batchDetails: {
      payment_method?: string;
      payment?: string;
      vendor?: string;
      vendor_id?: string;
    } = {},
  ): Promise<Batch | undefined> =>
    database.write(async () => {
      const draft = await findRecord<DraftRecord>(draftsCollection(), draftId);
      if (!draft) return undefined;
      const draftItems = await draftItemsCollection()
        .query(Q.where("draft_id", draftId))
        .fetch();
      if (draftItems.length === 0) return undefined;

      const totalPrice = draftItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      );
      const timestamp = now();
      const batch = await batchesCollection().create((record) => {
        record.vendorId = batchDetails.vendor_id;
        record.paymentMethod = batchDetails.payment_method ?? "";
        record.totalAmount = totalPrice;
        record.amountPaid = Number(batchDetails.payment ?? 0);
        record.balance = Math.max(0, totalPrice - Number(batchDetails.payment ?? 0));
        record.vendor = batchDetails.vendor ?? draft.name;
        record.status = "completed";
        record.createdAt = timestamp;
        record.updatedAt = timestamp;
      });

      const batchItems = draftItems.map((draftItem) =>
        batchItemsCollection().prepareCreate((item) => {
          item.batchId = batch.id;
          item.productId = draftItem.productId;
          item.quantity = draftItem.quantity;
          item.purchaseUnit = draftItem.purchaseUnit || "UNIT";
          item.unitsPerPack = draftItem.unitsPerPack || 1;
          item.expiry = draftItem.expiry;
          item.unitCost = draftItem.unitCost || draftItem.price;
          item.unitSellingPrice = draftItem.unitSellingPrice || draftItem.profit;
          item.profitAmount = draftItem.profitAmount;
          item.profitScope = draftItem.profitScope || "UNIT";
          item.price = draftItem.price;
          item.vat = draftItem.vat;
          item.taxTypeId = draftItem.taxTypeId;
          item.exerciseDuty = draftItem.exerciseDuty;
          item.profit = draftItem.profit;
          item.updatedAt = timestamp;
        }),
      );
      const productUpdates = await Promise.all(
        draftItems.map(async (draftItem) => {
          const product = await productsCollection().find(draftItem.productId);
          return product.prepareUpdate((record) => {
            record.currentStock = product.currentStock + draftItem.quantity;
            record.totalPurchased = product.totalPurchased + draftItem.quantity;
        record.currentBatchId = batch.id;
            record.batchCount = (product.batchCount ?? 0) + 1;
            record.updatedAt = timestamp;
          });
        }),
      );
      const stockMovements = draftItems.map((draftItem) =>
        stockMovementsCollection().prepareCreate((movement) => {
          movement.productId = draftItem.productId;
          movement.quantityDelta = draftItem.quantity;
          movement.reasonType = "batch";
          movement.reasonId = batch.id;
          movement.unitCost = draftItem.unitCost || draftItem.price;
          movement.unitSellingPrice = draftItem.unitSellingPrice || draftItem.profit;
          movement.createdAt = timestamp;
        }),
      );

      const initialPayment = Number(batchDetails.payment ?? 0);
      const batchBalance = Math.max(0, totalPrice - initialPayment);
      const batchPayments =
        initialPayment > 0
          ? [
              batchPaymentsCollection().prepareCreate((payment) => {
                payment.batchId = batch.id;
                payment.paymentMethod = batchDetails.payment_method ?? "";
                payment.amount = initialPayment;
                payment.createdAt = timestamp;
              }),
            ]
          : [];
      const vendorCredits =
        batchBalance > 0
          ? [
              vendorCreditsCollection().prepareCreate((credit) => {
                credit.vendorId = batchDetails.vendor_id ?? "";
                credit.batchId = batch.id;
                credit.originalAmount = batchBalance;
                credit.amountPaid = 0;
                credit.balance = batchBalance;
                credit.status = "open";
                credit.createdAt = timestamp;
              }),
            ]
          : [];

      await database.batch(
        batchItems,
        productUpdates,
        stockMovements,
        batchPayments,
        vendorCredits,
      );
      return toBatchDto(batch);
    }),

  listBatches: async (): Promise<Batch[]> => {
    const batches = await batchesCollection().query().fetch();
    return batches.map(toBatchDto);
  },
  listSavedBatches: async (): Promise<Batch[]> => BatchRepo.listBatches(),
  getBatchById: async (id: string): Promise<Batch | undefined> => {
    const batch = await findRecord<BatchRecord>(batchesCollection(), id);
    return batch ? toBatchDto(batch) : undefined;
  },
  createBatch: async (
    batch: Omit<Batch, "id" | "created_at" | "updated_at">,
  ): Promise<Batch> =>
    database.write(async () => {
      const timestamp = now();
      const record = await batchesCollection().create((newBatch) => {
        newBatch.vendorId = batch.vendor_id;
        newBatch.paymentMethod = batch.payment_method;
        newBatch.totalAmount = batch.total_amount ?? 0;
        newBatch.amountPaid = batch.amount_paid ?? 0;
        newBatch.balance =
          batch.balance ?? Math.max(0, newBatch.totalAmount - newBatch.amountPaid);
        newBatch.vendor = batch.vendor;
        newBatch.status = batch.status ?? "completed";
        newBatch.createdAt = timestamp;
        newBatch.updatedAt = timestamp;
      });
      if ((record.balance ?? 0) > 0) {
        await vendorCreditsCollection().create((credit) => {
          credit.vendorId = batch.vendor_id ?? "";
          credit.batchId = record.id;
          credit.originalAmount = record.balance;
          credit.amountPaid = 0;
          credit.balance = record.balance;
          credit.status = "open";
          credit.createdAt = timestamp;
        });
      }
      return toBatchDto(record);
    }),
  updateBatch: async (
    id: string,
    updates: Partial<Omit<Batch, "id" | "created_at" | "updated_at">>,
  ): Promise<Batch | undefined> =>
    database.write(async () => {
      const batch = await findRecord<BatchRecord>(batchesCollection(), id);
      if (!batch) return undefined;
      await batch.update((record) => {
        if (updates.vendor_id !== undefined) record.vendorId = updates.vendor_id;
        if (updates.payment_method !== undefined) {
          record.paymentMethod = updates.payment_method;
        }
        if (updates.total_amount !== undefined) record.totalAmount = updates.total_amount;
        if (updates.amount_paid !== undefined) record.amountPaid = updates.amount_paid;
        if (updates.balance !== undefined) record.balance = updates.balance;
        if (updates.vendor !== undefined) record.vendor = updates.vendor;
        if (updates.status !== undefined) record.status = updates.status;
        record.updatedAt = now();
      });
      return toBatchDto(batch);
    }),
  deleteBatch: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const batch = await findRecord<BatchRecord>(batchesCollection(), id);
      if (!batch) return false;
      const [items, payments] = await Promise.all([
        batchItemsCollection().query(Q.where("batch_id", id)).fetch(),
        batchPaymentsCollection().query(Q.where("batch_id", id)).fetch(),
      ]);
      const vendorCredits = await vendorCreditsCollection()
        .query(Q.where("batch_id", id))
        .fetch();
      const vendorCreditPayments = await Promise.all(
        vendorCredits.map((credit) =>
          vendorCreditPaymentsCollection()
            .query(Q.where("vendor_credit_id", credit.id))
            .fetch(),
        ),
      );
      await database.batch(
        items.map((item) => item.prepareDestroyPermanently()),
        payments.map((payment) => payment.prepareDestroyPermanently()),
        vendorCreditPayments
          .flat()
          .map((payment) => payment.prepareDestroyPermanently()),
        vendorCredits.map((credit) => credit.prepareDestroyPermanently()),
        batch.prepareDestroyPermanently(),
      );
      return true;
    }),

  listBatchItems: async (): Promise<BatchItem[]> => {
    const items = await batchItemsCollection().query().fetch();
    return Promise.all(items.map(toBatchItemDto));
  },
  listBatchItemsByBatch: async (batchId: string): Promise<BatchItem[]> => {
    const items = await batchItemsCollection()
      .query(Q.where("batch_id", batchId))
      .fetch();
    return Promise.all(items.map(toBatchItemDto));
  },
  getBatchItemById: async (id: string): Promise<BatchItem | undefined> => {
    const item = await findRecord<BatchItemRecord>(batchItemsCollection(), id);
    return item ? toBatchItemDto(item) : undefined;
  },
  createBatchItem: async (item: Omit<BatchItem, "id">): Promise<BatchItem> =>
    database.write(async () => {
      const record = await batchItemsCollection().create((newItem) => {
        newItem.batchId = item.batch.id;
        newItem.productId = item.product.id;
        newItem.quantity = item.quantity;
        newItem.purchaseUnit = "UNIT";
        newItem.unitsPerPack = 1;
        newItem.expiry = item.expiry;
        newItem.unitCost = item.price;
        newItem.unitSellingPrice = item.profit;
        newItem.profitAmount = Math.max(0, item.profit - item.price);
        newItem.profitScope = "UNIT";
        newItem.price = item.price;
        newItem.vat = item.vat;
        newItem.taxTypeId = item.tax_type_id;
        newItem.exerciseDuty = item.exercise_duty;
        newItem.profit = item.profit;
        newItem.updatedAt = item.updated_at;
      });
      return toBatchItemDto(record);
    }),
  updateBatchItem: async (
    id: string,
    updates: Partial<Omit<BatchItem, "id">>,
  ): Promise<BatchItem | undefined> =>
    database.write(async () => {
      const item = await findRecord<BatchItemRecord>(batchItemsCollection(), id);
      if (!item) return undefined;
      await item.update((record) => {
        if (updates.batch !== undefined) record.batchId = updates.batch.id;
        if (updates.product !== undefined) record.productId = updates.product.id;
        if (updates.quantity !== undefined) record.quantity = updates.quantity;
        if ("expiry" in updates) record.expiry = updates.expiry;
        if (updates.price !== undefined) {
          record.price = updates.price;
          record.unitCost = updates.price;
        }
        if ("vat" in updates) record.vat = updates.vat;
        if ("tax_type_id" in updates) record.taxTypeId = updates.tax_type_id;
        if (updates.exercise_duty !== undefined) {
          record.exerciseDuty = updates.exercise_duty;
        }
        if (updates.profit !== undefined) {
          record.profit = updates.profit;
          record.unitSellingPrice = updates.profit;
        }
        record.updatedAt = updates.updated_at ?? now();
      });
      return toBatchItemDto(item);
    }),
  deleteBatchItem: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const item = await findRecord<BatchItemRecord>(batchItemsCollection(), id);
      if (!item) return false;
      await item.destroyPermanently();
      return true;
    }),

  listBatchPayments: async (): Promise<BatchPayment[]> => {
    const payments = await batchPaymentsCollection().query().fetch();
    return Promise.all(payments.map(toBatchPaymentDto));
  },
  listBatchPaymentsByBatch: async (
    batchId: string,
  ): Promise<BatchPayment[]> => {
    const payments = await batchPaymentsCollection()
      .query(Q.where("batch_id", batchId))
      .fetch();
    return Promise.all(payments.map(toBatchPaymentDto));
  },
  getBatchPaymentById: async (
    id: string,
  ): Promise<BatchPayment | undefined> => {
    const payment = await findRecord<BatchPaymentRecord>(
      batchPaymentsCollection(),
      id,
    );
    return payment ? toBatchPaymentDto(payment) : undefined;
  },
  createBatchPayment: async (
    payment: Omit<BatchPayment, "id" | "created_at">,
  ): Promise<BatchPayment> =>
    database.write(async () => {
      const timestamp = now();
      const batch = await batchesCollection().find(payment.batch.id);
      const record = await batchPaymentsCollection().create((newPayment) => {
        newPayment.batchId = payment.batch.id;
        newPayment.paymentMethod = payment.payment_method;
        newPayment.amount = payment.amount;
        newPayment.reference = payment.reference;
        newPayment.createdAt = timestamp;
      });
      await batch.update((recordBatch) => {
        recordBatch.amountPaid = batch.amountPaid + payment.amount;
        recordBatch.balance = Math.max(
          0,
          recordBatch.totalAmount - recordBatch.amountPaid,
        );
        recordBatch.paymentMethod = payment.payment_method;
        recordBatch.updatedAt = timestamp;
      });
      const vendorCredits = await vendorCreditsCollection()
        .query(Q.where("batch_id", batch.id))
        .fetch();
      const openVendorCredit = vendorCredits.find(
        (credit) => credit.status !== "paid" && credit.status !== "cancelled",
      );
      if (openVendorCredit) {
        await vendorCreditPaymentsCollection().create((creditPayment) => {
          creditPayment.vendorCreditId = openVendorCredit.id;
          creditPayment.batchPaymentId = record.id;
          creditPayment.paymentMethod = payment.payment_method;
          creditPayment.amount = payment.amount;
          creditPayment.reference = payment.reference;
          creditPayment.createdAt = timestamp;
        });
        await openVendorCredit.update((credit) => {
          credit.amountPaid = openVendorCredit.amountPaid + payment.amount;
          credit.balance = Math.max(0, openVendorCredit.originalAmount - credit.amountPaid);
          credit.status = credit.balance > 0 ? "partially_paid" : "paid";
          credit.settledAt = credit.balance > 0 ? undefined : timestamp;
        });
      }
      return toBatchPaymentDto(record);
    }),
  updateBatchPayment: async (
    id: string,
    updates: Partial<Omit<BatchPayment, "id" | "batch" | "created_at">>,
  ): Promise<BatchPayment | undefined> =>
    database.write(async () => {
      const payment = await findRecord<BatchPaymentRecord>(
        batchPaymentsCollection(),
        id,
      );
      if (!payment) return undefined;
      const previousAmount = payment.amount;
      const batch = await batchesCollection().find(payment.batchId);
      await payment.update((record) => {
        if (updates.payment_method !== undefined) {
          record.paymentMethod = updates.payment_method;
        }
        if (updates.amount !== undefined) record.amount = updates.amount;
        if ("reference" in updates) record.reference = updates.reference;
      });
      if (updates.amount !== undefined) {
        const delta = updates.amount - previousAmount;
        await batch.update((recordBatch) => {
          recordBatch.amountPaid = Math.max(0, recordBatch.amountPaid + delta);
          recordBatch.balance = Math.max(
            0,
            recordBatch.totalAmount - recordBatch.amountPaid,
          );
          recordBatch.updatedAt = now();
        });
      }
      return toBatchPaymentDto(payment);
    }),
  deleteBatchPayment: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const payment = await findRecord<BatchPaymentRecord>(
        batchPaymentsCollection(),
        id,
      );
      if (!payment) return false;
      const batch = await batchesCollection().find(payment.batchId);
      await batch.update((recordBatch) => {
        recordBatch.amountPaid = Math.max(0, recordBatch.amountPaid - payment.amount);
        recordBatch.balance = Math.max(
          0,
          recordBatch.totalAmount - recordBatch.amountPaid,
        );
        recordBatch.updatedAt = now();
      });
      await payment.destroyPermanently();
      return true;
    }),

  listVendorCredits: async (): Promise<VendorCredit[]> => {
    const credits = await vendorCreditsCollection().query().fetch();
    return Promise.all(credits.map(toVendorCreditDto));
  },
  listVendorCreditsByBatch: async (batchId: string): Promise<VendorCredit[]> => {
    const credits = await vendorCreditsCollection()
      .query(Q.where("batch_id", batchId))
      .fetch();
    return Promise.all(credits.map(toVendorCreditDto));
  },
  getVendorCreditById: async (id: string): Promise<VendorCredit | undefined> => {
    const credit = await findRecord<VendorCreditRecord>(
      vendorCreditsCollection(),
      id,
    );
    return credit ? toVendorCreditDto(credit) : undefined;
  },
  createVendorCreditPayment: async (
    payment: Omit<VendorCreditPayment, "id" | "created_at" | "vendor_credit"> & {
      vendor_credit: VendorCredit;
    },
  ): Promise<VendorCreditPayment> =>
    database.write(async () => {
      const timestamp = now();
      const vendorCredit = await vendorCreditsCollection().find(
        payment.vendor_credit.id,
      );
      const batch = await batchesCollection().find(vendorCredit.batchId);
      const batchPayment = await batchPaymentsCollection().create((record) => {
        record.batchId = vendorCredit.batchId;
        record.paymentMethod = payment.payment_method;
        record.amount = payment.amount;
        record.reference = payment.reference;
        record.createdAt = timestamp;
      });
      const creditPayment = await vendorCreditPaymentsCollection().create((record) => {
        record.vendorCreditId = vendorCredit.id;
        record.batchPaymentId = batchPayment.id;
        record.paymentMethod = payment.payment_method;
        record.amount = payment.amount;
        record.reference = payment.reference;
        record.createdAt = timestamp;
      });
      await batch.update((recordBatch) => {
        recordBatch.amountPaid = batch.amountPaid + payment.amount;
        recordBatch.balance = Math.max(
          0,
          recordBatch.totalAmount - recordBatch.amountPaid,
        );
        recordBatch.paymentMethod = payment.payment_method;
        recordBatch.updatedAt = timestamp;
      });
      await vendorCredit.update((record) => {
        record.amountPaid = vendorCredit.amountPaid + payment.amount;
        record.balance = Math.max(0, vendorCredit.originalAmount - record.amountPaid);
        record.status = record.balance > 0 ? "partially_paid" : "paid";
        record.settledAt = record.balance > 0 ? undefined : timestamp;
      });
      return toVendorCreditPaymentDto(creditPayment);
    }),
};
