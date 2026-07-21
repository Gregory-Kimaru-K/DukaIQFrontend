import { Q } from "@nozbe/watermelondb";
import type Collection from "@nozbe/watermelondb/Collection";

import { Credit } from "../models/products/Credit";
import { Batch } from "../models/stock/Batch";
import { BatchItem } from "../models/stock/BatchItem";
import { DraftBatch } from "../models/stock/Draft";
import { DraftItem } from "../models/stock/DraftItem";
import { TaxType } from "../models/stock/TaxType";
import { database } from "../watermelon/database";
import {
  BatchItemRecord,
  BatchRecord,
  CreditBatchRecord,
  CreditRecord,
  DraftItemRecord,
  DraftRecord,
  ProductRecord,
  TaxTypeRecord,
  VendorRecord,
} from "../watermelon/models";
import { toProductDto, toVendorDto } from "./ProductRepo";

const now = () => new Date().toISOString();
const createDraftName = () => `DRAFT-${Date.now().toString().slice(-6)}`;

const draftsCollection = () => database.get<DraftRecord>("drafts");
const draftItemsCollection = () => database.get<DraftItemRecord>("draft_items");
const batchesCollection = () => database.get<BatchRecord>("batches");
const batchItemsCollection = () => database.get<BatchItemRecord>("batch_items");
const creditsCollection = () => database.get<CreditRecord>("credits");
const creditBatchesCollection = () =>
  database.get<CreditBatchRecord>("credit_batches");
const vendorsCollection = () => database.get<VendorRecord>("vendors");
const productsCollection = () => database.get<ProductRecord>("products");
const taxTypesCollection = () => database.get<TaxTypeRecord>("tax_types");

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

export const toDraftDto = (draft: DraftRecord): DraftBatch => ({
  id: draft.id,
  name: draft.name,
  created_at: draft.createdAt,
  updated_at: draft.updatedAt,
});

export const toBatchDto = (batch: BatchRecord): Batch => ({
  id: batch.id,
  draft_id: batch.draftId,
  payment_method: batch.paymentMethod,
  price: batch.price,
  payment: batch.payment,
  vendor: batch.vendor,
  updated_at: batch.updatedAt,
  created_at: batch.createdAt,
});

export const toTaxTypeDto = (taxType: TaxTypeRecord): TaxType => ({
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
): Promise<TaxType | undefined> => {
  if (!taxTypeId) return undefined;
  const taxType = await findRecord<TaxTypeRecord>(
    taxTypesCollection(),
    taxTypeId,
  );
  return taxType ? toTaxTypeDto(taxType) : undefined;
};

export const toDraftItemDto = async (
  item: DraftItemRecord,
): Promise<DraftItem> => {
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
): Promise<BatchItem> => {
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

const toCreditDto = async (credit: CreditRecord): Promise<Credit> => {
  const [vendor, creditBatchLinks] = await Promise.all([
    vendorsCollection().find(credit.vendorId),
    creditBatchesCollection()
      .query(Q.where("credit_id", credit.id))
      .fetch(),
  ]);
  const batches = await Promise.all(
    creditBatchLinks.map(async (link) =>
      toBatchDto(await batchesCollection().find(link.batchId)),
    ),
  );

  return {
    id: credit.id,
    vendor: toVendorDto(vendor),
    batch: batches,
  };
};

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
        if (updates.price !== undefined) record.price = updates.price;
        if ("vat" in updates) record.vat = updates.vat;
        if ("tax_type_id" in updates) record.taxTypeId = updates.tax_type_id;
        if (updates.exercise_duty !== undefined) {
          record.exerciseDuty = updates.exercise_duty;
        }
        if (updates.profit !== undefined) record.profit = updates.profit;
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
        record.draftId = draft.id;
        record.paymentMethod = batchDetails.payment_method ?? "";
        record.price = totalPrice.toString();
        record.payment = batchDetails.payment ?? "0";
        record.vendor = batchDetails.vendor ?? draft.name;
        record.createdAt = timestamp;
        record.updatedAt = timestamp;
      });

      const batchItems = draftItems.map((draftItem) =>
        batchItemsCollection().prepareCreate((item) => {
          item.batchId = batch.id;
          item.productId = draftItem.productId;
          item.quantity = draftItem.quantity;
          item.expiry = draftItem.expiry;
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

      await database.batch(batchItems, productUpdates);
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
        newBatch.draftId = batch.draft_id;
        newBatch.paymentMethod = batch.payment_method;
        newBatch.price = batch.price;
        newBatch.payment = batch.payment;
        newBatch.vendor = batch.vendor;
        newBatch.createdAt = timestamp;
        newBatch.updatedAt = timestamp;
      });
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
        if (updates.draft_id !== undefined) record.draftId = updates.draft_id;
        if (updates.payment_method !== undefined) {
          record.paymentMethod = updates.payment_method;
        }
        if (updates.price !== undefined) record.price = updates.price;
        if (updates.payment !== undefined) record.payment = updates.payment;
        if (updates.vendor !== undefined) record.vendor = updates.vendor;
        record.updatedAt = now();
      });
      return toBatchDto(batch);
    }),
  deleteBatch: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const batch = await findRecord<BatchRecord>(batchesCollection(), id);
      if (!batch) return false;
      await batch.destroyPermanently();
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
        newItem.expiry = item.expiry;
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
        if (updates.price !== undefined) record.price = updates.price;
        if ("vat" in updates) record.vat = updates.vat;
        if ("tax_type_id" in updates) record.taxTypeId = updates.tax_type_id;
        if (updates.exercise_duty !== undefined) {
          record.exerciseDuty = updates.exercise_duty;
        }
        if (updates.profit !== undefined) record.profit = updates.profit;
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

  listCredits: async (): Promise<Credit[]> => {
    const credits = await creditsCollection().query().fetch();
    return Promise.all(credits.map(toCreditDto));
  },
  getCreditById: async (id: string): Promise<Credit | undefined> => {
    const credit = await findRecord<CreditRecord>(creditsCollection(), id);
    return credit ? toCreditDto(credit) : undefined;
  },
  createCredit: async (credit: Omit<Credit, "id">): Promise<Credit> =>
    database.write(async () => {
      const record = await creditsCollection().create((newCredit) => {
        newCredit.vendorId = credit.vendor.id;
      });
      const links = credit.batch.map((batch) =>
        creditBatchesCollection().prepareCreate((link) => {
          link.creditId = record.id;
          link.batchId = batch.id;
        }),
      );
      await database.batch(links);
      return toCreditDto(record);
    }),
  updateCredit: async (
    id: string,
    updates: Partial<Omit<Credit, "id">>,
  ): Promise<Credit | undefined> =>
    database.write(async () => {
      const credit = await findRecord<CreditRecord>(creditsCollection(), id);
      if (!credit) return undefined;
      await credit.update((record) => {
        if (updates.vendor !== undefined) record.vendorId = updates.vendor.id;
      });
      if (updates.batch !== undefined) {
        const currentLinks = await creditBatchesCollection()
          .query(Q.where("credit_id", credit.id))
          .fetch();
        await database.batch(
          currentLinks.map((link) => link.prepareDestroyPermanently()),
          updates.batch.map((batch) =>
            creditBatchesCollection().prepareCreate((link) => {
              link.creditId = credit.id;
              link.batchId = batch.id;
            }),
          ),
        );
      }
      return toCreditDto(credit);
    }),
  deleteCredit: async (id: string): Promise<boolean> =>
    database.write(async () => {
      const credit = await findRecord<CreditRecord>(creditsCollection(), id);
      if (!credit) return false;
      const links = await creditBatchesCollection()
        .query(Q.where("credit_id", credit.id))
        .fetch();
      await database.batch(
        links.map((link) => link.prepareDestroyPermanently()),
        credit.prepareDestroyPermanently(),
      );
      return true;
    }),
};
