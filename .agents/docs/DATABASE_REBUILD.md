# Database Rebuild

Started: 2026-07-22

## Intent

This is a clean development baseline for the Friday pilot. It assumes local
WatermelonDB app data will be cleared before launch. It is not a migration plan
for preserving existing experimental records.

## Rules

- Store money as integer KSH values.
- Keep completed batches and sales immutable; use reversal/cancellation records
  instead of silent deletion.
- Every stock change must write a `stock_movements` record.
- Preserve snapshots for completed batches and sales items.
- Keep the app offline-first.

## Baseline Tables

- Catalog: `shops`, `categories`, `types`, `products`
- Parties: `vendors`, `creditors`
- Restocking: `drafts`, `draft_items`, `batches`, `batch_items`,
  `batch_payments`
- Sales: `sales`, `sales_items`
- Customer credit: `creditors`, `creditor_sales`
- Tax configuration: `tax_types`
- Stock ledger: `stock_movements`

## First Pass Completed

- Reset Watermelon schema to version `1`.
- Emptied schema migrations for a clean dev database wipe.
- Added integer-money columns for batches and sales.
- Added vendor IDs and statuses to batches.
- Added product `active` flag.
- Added explicit pack/profit fields to draft and batch items:
  `purchase_unit`, `units_per_pack`, `unit_cost`, `unit_selling_price`,
  `profit_amount`, `profit_scope`.
- Added `stock_movements`.
- Restock completion now creates stock movement rows when increasing stock.
- Removed `draft_id` from `batches`. A batch should represent only the purchased
  subset of draft items, not inherit the whole draft. For example, if 2 items
  are purchased from a draft of 10, save a batch containing those 2
  `batch_items`; if 9 items are purchased from a larger draft, save a batch
  containing those 9 `batch_items`. The permanent stock record should be
  `batch -> batch_items -> products`, while drafts remain preparation state.
- Added a `batch_payments` table for money paid out on stock purchases. Keep the
  summary fields on `batches`, but store each payment line separately with
  `batch_id`, `payment_method`, `amount`, optional `reference`, and
  `created_at`. Example: if a user pays KSh 30 cash and KSh 200 by M-Pesa for
  one batch, save two `batch_payments` rows for that same `batch_id`.
- Deleted the vendor credit tables `credits` and `credit_batches`. Vendor debt
  should be derived from `batches.balance` and the related `batch_payments`
  instead of maintaining a separate credit record/link table.

## Next Pass

- TBD.
