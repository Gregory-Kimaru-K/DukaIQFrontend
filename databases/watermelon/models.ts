import { Model } from "@nozbe/watermelondb";

class DukaModel extends Model {
  protected getString(column: string): string {
    return (this._getRaw(column) as string | null) ?? "";
  }

  protected getOptionalString(column: string): string | undefined {
    return (this._getRaw(column) as string | null) ?? undefined;
  }

  protected getNumber(column: string): number {
    return Number(this._getRaw(column) ?? 0);
  }

  protected getOptionalNumber(column: string): number | undefined {
    const value = this._getRaw(column);
    return value === null || value === undefined ? undefined : Number(value);
  }

  protected getTimestamp(column: string): string {
    const value = this._getRaw(column);
    return new Date(typeof value === "number" ? value : Number(value ?? 0)).toISOString();
  }

  protected setTimestamp(column: string, value: string | number) {
    this._setRaw(column, typeof value === "number" ? value : Date.parse(value));
  }

  protected getBoolean(column: string): boolean {
    return Boolean(this._getRaw(column));
  }

  protected setValue(column: string, value: string | number | boolean | null) {
    this._setRaw(column, value);
  }
}

export class ShopRecord extends DukaModel {
  static table = "shops";

  get name() { return this.getString("name"); }
  set name(value: string) { this.setValue("name", value); }
  get createdAt(): string { return this.getTimestamp("created_at"); }
  set createdAt(value: string) { this.setTimestamp("created_at", value); }
  get updatedAt(): string { return this.getTimestamp("updated_at"); }
  set updatedAt(value: string) { this.setTimestamp("updated_at", value); }
}

export class CategoryRecord extends DukaModel {
  static table = "categories";

  get name() { return this.getString("name"); }
  set name(value: string) { this.setValue("name", value); }
  get shopId() { return this.getString("shop_id"); }
  set shopId(value: string) { this.setValue("shop_id", value); }
  get createdAt(): string { return this.getTimestamp("created_at"); }
  set createdAt(value: string) { this.setTimestamp("created_at", value); }
  get updatedAt(): string { return this.getTimestamp("updated_at"); }
  set updatedAt(value: string) { this.setTimestamp("updated_at", value); }
}

export class TypeRecord extends DukaModel {
  static table = "types";

  get name() { return this.getString("name"); }
  set name(value: string) { this.setValue("name", value); }
  get categoryId() { return this.getString("category_id"); }
  set categoryId(value: string) { this.setValue("category_id", value); }
  get createdAt(): string { return this.getTimestamp("created_at"); }
  set createdAt(value: string) { this.setTimestamp("created_at", value); }
  get updatedAt(): string { return this.getTimestamp("updated_at"); }
  set updatedAt(value: string) { this.setTimestamp("updated_at", value); }
}

export class VendorRecord extends DukaModel {
  static table = "vendors";

  get name() { return this.getString("name"); }
  set name(value: string) { this.setValue("name", value); }
  get phoneNumber() { return this.getString("phone_number"); }
  set phoneNumber(value: string) { this.setValue("phone_number", value); }
}

export class ProductRecord extends DukaModel {
  static table = "products";

  get barcode() { return this.getOptionalString("barcode"); }
  set barcode(value: string | undefined) { this.setValue("barcode", value ?? null); }
  get name() { return this.getString("name"); }
  set name(value: string) { this.setValue("name", value); }
  get shopId() { return this.getString("shop_id"); }
  set shopId(value: string) { this.setValue("shop_id", value); }
  get categoryId() { return this.getString("category_id"); }
  set categoryId(value: string) { this.setValue("category_id", value); }
  get typeId() { return this.getString("type_id"); }
  set typeId(value: string) { this.setValue("type_id", value); }
  get createdAt(): string { return this.getTimestamp("created_at"); }
  set createdAt(value: string) { this.setTimestamp("created_at", value); }
  get updatedAt(): string { return this.getTimestamp("updated_at"); }
  set updatedAt(value: string) { this.setTimestamp("updated_at", value); }
  get currentStock() { return this.getNumber("current_stock"); }
  set currentStock(value: number) { this.setValue("current_stock", value); }
  get totalPurchased() { return this.getNumber("total_purchased"); }
  set totalPurchased(value: number) { this.setValue("total_purchased", value); }
  get totalSold() { return this.getNumber("total_sold"); }
  set totalSold(value: number) { this.setValue("total_sold", value); }
  get currentBatchId() { return this.getOptionalString("current_batch_id"); }
  set currentBatchId(value: string | undefined) { this.setValue("current_batch_id", value ?? null); }
  get batchCount() { return this.getOptionalNumber("batch_count"); }
  set batchCount(value: number | undefined) { this.setValue("batch_count", value ?? null); }
  get unit() { return this.getString("unit"); }
  set unit(value: string) { this.setValue("unit", value); }
}

export class BatchRecord extends DukaModel {
  static table = "batches";

  get draftId() { return this.getOptionalString("draft_id"); }
  set draftId(value: string | undefined) { this.setValue("draft_id", value ?? null); }
  get paymentMethod() { return this.getString("payment_method"); }
  set paymentMethod(value: string) { this.setValue("payment_method", value); }
  get price() { return this.getString("price"); }
  set price(value: string) { this.setValue("price", value); }
  get payment() { return this.getString("payment"); }
  set payment(value: string) { this.setValue("payment", value); }
  get vendor() { return this.getString("vendor"); }
  set vendor(value: string) { this.setValue("vendor", value); }
  get updatedAt(): string { return this.getTimestamp("updated_at"); }
  set updatedAt(value: string) { this.setTimestamp("updated_at", value); }
  get createdAt(): string { return this.getTimestamp("created_at"); }
  set createdAt(value: string) { this.setTimestamp("created_at", value); }
}

export class BatchItemRecord extends DukaModel {
  static table = "batch_items";

  get batchId() { return this.getString("batch_id"); }
  set batchId(value: string) { this.setValue("batch_id", value); }
  get productId() { return this.getString("product_id"); }
  set productId(value: string) { this.setValue("product_id", value); }
  get quantity() { return this.getNumber("quantity"); }
  set quantity(value: number) { this.setValue("quantity", value); }
  get expiry() { return this.getOptionalString("expiry"); }
  set expiry(value: string | undefined) { this.setValue("expiry", value ?? null); }
  get price() { return this.getNumber("price"); }
  set price(value: number) { this.setValue("price", value); }
  get vat() { return this.getOptionalNumber("vat"); }
  set vat(value: number | undefined) { this.setValue("vat", value ?? null); }
  get exerciseDuty() { return this.getNumber("exercise_duty"); }
  set exerciseDuty(value: number) { this.setValue("exercise_duty", value); }
  get profit() { return this.getNumber("profit"); }
  set profit(value: number) { this.setValue("profit", value); }
  get updatedAt(): string { return this.getTimestamp("updated_at"); }
  set updatedAt(value: string) { this.setTimestamp("updated_at", value); }
}

export class DraftRecord extends DukaModel {
  static table = "drafts";

  get name() { return this.getString("name"); }
  set name(value: string) { this.setValue("name", value); }
  get createdAt(): string { return this.getTimestamp("created_at"); }
  set createdAt(value: string) { this.setTimestamp("created_at", value); }
  get updatedAt(): string { return this.getTimestamp("updated_at"); }
  set updatedAt(value: string) { this.setTimestamp("updated_at", value); }
}

export class DraftItemRecord extends DukaModel {
  static table = "draft_items";

  get draftId() { return this.getString("draft_id"); }
  set draftId(value: string) { this.setValue("draft_id", value); }
  get productId() { return this.getString("product_id"); }
  set productId(value: string) { this.setValue("product_id", value); }
  get quantity() { return this.getNumber("quantity"); }
  set quantity(value: number) { this.setValue("quantity", value); }
  get expiry() { return this.getOptionalString("expiry"); }
  set expiry(value: string | undefined) { this.setValue("expiry", value ?? null); }
  get price() { return this.getNumber("price"); }
  set price(value: number) { this.setValue("price", value); }
  get vat() { return this.getOptionalNumber("vat"); }
  set vat(value: number | undefined) { this.setValue("vat", value ?? null); }
  get exerciseDuty() { return this.getNumber("exercise_duty"); }
  set exerciseDuty(value: number) { this.setValue("exercise_duty", value); }
  get profit() { return this.getNumber("profit"); }
  set profit(value: number) { this.setValue("profit", value); }
  get updatedAt(): string { return this.getTimestamp("updated_at"); }
  set updatedAt(value: string) { this.setTimestamp("updated_at", value); }
}

export class CreditRecord extends DukaModel {
  static table = "credits";

  get vendorId() { return this.getString("vendor_id"); }
  set vendorId(value: string) { this.setValue("vendor_id", value); }
}

export class CreditBatchRecord extends DukaModel {
  static table = "credit_batches";

  get creditId() { return this.getString("credit_id"); }
  set creditId(value: string) { this.setValue("credit_id", value); }
  get batchId() { return this.getString("batch_id"); }
  set batchId(value: string) { this.setValue("batch_id", value); }
}

export class SalesRecord extends DukaModel {
  static table = "sales";

  get payment() { return this.getString("payment"); }
  set payment(value: string) { this.setValue("payment", value); }
  get paymentMethod() { return this.getString("payment_method"); }
  set paymentMethod(value: string) { this.setValue("payment_method", value); }
  get price() { return this.getString("price"); }
  set price(value: string) { this.setValue("price", value); }
  get done() { return this.getBoolean("done"); }
  set done(value: boolean) { this.setValue("done", value); }
  get payee() { return this.getString("payee"); }
  set payee(value: string) { this.setValue("payee", value); }
}

export class SalesItemRecord extends DukaModel {
  static table = "sales_items";

  get productId() { return this.getString("product_id"); }
  set productId(value: string) { this.setValue("product_id", value); }
  get saleId() { return this.getString("sale_id"); }
  set saleId(value: string) { this.setValue("sale_id", value); }
  get quantity() { return this.getNumber("quantity"); }
  set quantity(value: number) { this.setValue("quantity", value); }
  get price() { return this.getNumber("price"); }
  set price(value: number) { this.setValue("price", value); }
}

export class CreditorRecord extends DukaModel {
  static table = "creditors";

  get name() { return this.getString("name"); }
  set name(value: string) { this.setValue("name", value); }
  get phoneNumber() { return this.getString("phone_number"); }
  set phoneNumber(value: string) { this.setValue("phone_number", value); }
  get location() { return this.getString("location"); }
  set location(value: string) { this.setValue("location", value); }
}

export class CreditorSaleRecord extends DukaModel {
  static table = "creditor_sales";

  get creditorId() { return this.getString("creditor_id"); }
  set creditorId(value: string) { this.setValue("creditor_id", value); }
  get saleId() { return this.getString("sale_id"); }
  set saleId(value: string) { this.setValue("sale_id", value); }
}

export const modelClasses = [
  ShopRecord,
  CategoryRecord,
  TypeRecord,
  VendorRecord,
  DraftRecord,
  DraftItemRecord,
  ProductRecord,
  BatchRecord,
  BatchItemRecord,
  CreditRecord,
  CreditBatchRecord,
  SalesRecord,
  SalesItemRecord,
  CreditorRecord,
  CreditorSaleRecord,
];
