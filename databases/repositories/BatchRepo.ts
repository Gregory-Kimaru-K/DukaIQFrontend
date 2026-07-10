import { Batches, BatchItems, Credits } from "../FakeDatabase";
import { Credit } from "../models/products/Credit";
import { Batch } from "../models/stock/Batch";
import { BatchItem } from "../models/stock/BatchItem";

const now = () => new Date().toISOString();
const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const BatchRepo = {
  listBatches: () => Batches,
  getBatchById: (id: string) => Batches.find((batch) => batch.id === id),
  createBatch: (
    batch: Omit<Batch, "id" | "created_at" | "updated_at">,
  ): Batch => {
    const newBatch: Batch = {
      id: generateId(),
      created_at: now(),
      updated_at: now(),
      ...batch,
    };
    Batches.push(newBatch);
    return newBatch;
  },
  updateBatch: (
    id: string,
    updates: Partial<Omit<Batch, "id" | "created_at" | "updated_at">>,
  ): Batch | undefined => {
    const index = Batches.findIndex((batch) => batch.id === id);
    if (index === -1) return undefined;
    Batches[index] = {
      ...Batches[index],
      ...updates,
      updated_at: now(),
    };
    return Batches[index];
  },
  deleteBatch: (id: string): boolean => {
    const index = Batches.findIndex((batch) => batch.id === id);
    if (index === -1) return false;
    Batches.splice(index, 1);
    return true;
  },

  listBatchItems: () => BatchItems,
  getBatchItemById: (id: string) => BatchItems.find((item) => item.id === id),
  createBatchItem: (item: Omit<BatchItem, "id">): BatchItem => {
    const newItem: BatchItem = {
      id: generateId(),
      ...item,
    };
    BatchItems.push(newItem);
    return newItem;
  },
  updateBatchItem: (
    id: string,
    updates: Partial<Omit<BatchItem, "id">>,
  ): BatchItem | undefined => {
    const index = BatchItems.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    BatchItems[index] = {
      ...BatchItems[index],
      ...updates,
    };
    return BatchItems[index];
  },
  deleteBatchItem: (id: string): boolean => {
    const index = BatchItems.findIndex((item) => item.id === id);
    if (index === -1) return false;
    BatchItems.splice(index, 1);
    return true;
  },

  listCredits: () => Credits,
  getCreditById: (id: string) => Credits.find((credit) => credit.id === id),
  createCredit: (credit: Omit<Credit, "id">): Credit => {
    const newCredit: Credit = {
      id: generateId(),
      ...credit,
    };
    Credits.push(newCredit);
    return newCredit;
  },
  updateCredit: (
    id: string,
    updates: Partial<Omit<Credit, "id">>,
  ): Credit | undefined => {
    const index = Credits.findIndex((credit) => credit.id === id);
    if (index === -1) return undefined;
    Credits[index] = {
      ...Credits[index],
      ...updates,
    };
    return Credits[index];
  },
  deleteCredit: (id: string): boolean => {
    const index = Credits.findIndex((credit) => credit.id === id);
    if (index === -1) return false;
    Credits.splice(index, 1);
    return true;
  },
};
