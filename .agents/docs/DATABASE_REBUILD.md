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
- Restocking: `drafts`, `draft_items`, `batches`, `batch_items`
- Vendor credit: `credits`, `credit_batches`
- Sales: `sales`, `sales_items`
- Customer credit: `creditors`, `creditor_sales`
- Tax configuration: `tax_types`
- Stock ledger: `stock_movements`

## First Pass Completed

- Reset Watermelon schema to version `1`.
- Emptied schema migrations for a clean dev database wipe.
- Added integer-money columns for batches, credits, and sales.
- Added vendor IDs and statuses to batches.
- Added product `active` flag.
- Added explicit pack/profit fields to draft and batch items:
  `purchase_unit`, `units_per_pack`, `unit_cost`, `unit_selling_price`,
  `profit_amount`, `profit_scope`.
- Added `stock_movements`.
- Restock completion now creates stock movement rows when increasing stock.

## Next Pass

- Update `ProductDets` to save pack/profit fields directly instead of using
  compatibility `price` and `profit` only.
- Build real sale completion in `SalesRepo` that creates sale items, deducts
  stock, and writes stock movement rows atomically.
- Replace permanent deletion for completed sales with reversal status/records.
