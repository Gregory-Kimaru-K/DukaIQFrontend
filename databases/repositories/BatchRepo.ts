import { Q } from "@nozbe/watermelondb";
import type Collection from "@nozbe/watermelondb/Collection";

import { Credit } from "../models/products/Credit";
import { Batch } from "../models/stock/Batch";
import { BatchItem } from "../models/stock/BatchItem";
import { database } from "../watermelon/database";
import {
  BatchItemRecord,
  BatchRecord,
  CreditBatchRecord,
  CreditRecord,
  ProductRecord,
  VendorRecord,
} from "../watermelon/models";
import { toProductDto, toVendorDto } from "./ProductRepo";

const now = () => new Date().toISOString();

const batchesCollection = () => database.get<BatchRecord>("batches");
const batchItemsCollection = () => database.get<BatchItemRecord>("batch_items");
const creditsCollection = () => database.get<CreditRecord>("credits");
const creditBatchesCollection = () =>
  database.get<CreditBatchRecord>("credit_batches");
const vendorsCollection = () => database.get<VendorRecord>("vendors");
const productsCollection = () => database.get<ProductRecord>("products");

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

export const toBatchDto = (batch: BatchRecord): Batch => ({
  id: batch.id,
  payment_method: batch.paymentMethod,
  price: batch.price,
  payment: batch.payment,
  vendor: batch.vendor,
  updated_at: batch.updatedAt,
  created_at: batch.createdAt,
  draft: batch.draft,
  drafted_at: batch.draftedAt,
});

export const toBatchItemDto = async (
  item: BatchItemRecord,
): Promise<BatchItem> => {
  const [batch, product] = await Promise.all([
    batchesCollection().find(item.batchId),
    productsCollection().find(item.productId),
  ]);

  return {
    id: item.id,
    batch: toBatchDto(batch),
    product: await toProductDto(product),
    quantity: item.quantity,
    expiry: item.expiry,
    price: item.price,
    vat: item.vat,
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

export const BatchRepo = {
  listBatches: async (): Promise<Batch[]> => {
    const batches = await batchesCollection().query().fetch();
    return batches.map(toBatchDto);
  },
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
        newBatch.paymentMethod = batch.payment_method;
        newBatch.price = batch.price;
        newBatch.payment = batch.payment;
        newBatch.vendor = batch.vendor;
        newBatch.createdAt = timestamp;
        newBatch.updatedAt = timestamp;
        newBatch.draft = batch.draft;
        newBatch.draftedAt = batch.drafted_at;
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
        if (updates.payment_method !== undefined) {
          record.paymentMethod = updates.payment_method;
        }
        if (updates.price !== undefined) record.price = updates.price;
        if (updates.payment !== undefined) record.payment = updates.payment;
        if (updates.vendor !== undefined) record.vendor = updates.vendor;
        if (updates.draft !== undefined) record.draft = updates.draft;
        if (updates.drafted_at !== undefined) record.draftedAt = updates.drafted_at;
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
      const item = await findRecord<BatchItemRecord>(
        batchItemsCollection(),
        id,
      );
      if (!item) return undefined;
      await item.update((record) => {
        if (updates.batch !== undefined) record.batchId = updates.batch.id;
        if (updates.product !== undefined) record.productId = updates.product.id;
        if (updates.quantity !== undefined) record.quantity = updates.quantity;
        if (updates.expiry !== undefined) record.expiry = updates.expiry;
        if (updates.price !== undefined) record.price = updates.price;
        if (updates.vat !== undefined) record.vat = updates.vat;
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
