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
  `batch_payments`, `vendor_credits`, `vendor_credit_payments`
- Sales: `sales`, `sales_items`, `sale_payments`
- Customer credit: `creditors`, `creditor_sales`, `creditor_repayments`
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
  Superseded: vendor credit should be rebuilt as first-class vendor debt tables,
  not restored as the old generic `credits` and `credit_batches` design.

## Completed Scope

- Catalog tables are done: `shops`, `categories`, `types`, `products`.
- Restocking tables are done: `drafts`, `draft_items`, `batches`,
  `batch_items`, `batch_payments`.
- Vendor and tax configuration tables are done: `vendors`, `tax_types`.
- Sales schema/model pass is done for `sales`, `sales_items`, and
  `sale_payments`.
- Customer credit schema/model pass is done for `creditors`, `creditor_sales`,
  and `creditor_repayments`.
- Vendor credit schema/model pass is done for `vendor_credits` and
  `vendor_credit_payments`.
- Repository workflows are intentionally not done yet.

## Next Pass: Schema Decisions First

- Review and rebuild sales tables: `sales`, `sales_items`, customer credit, and
  sale payment handling.
- Add a `sale_payments` table for money received on sales. Keep summary fields on
  `sales`, but store each payment line separately with `sale_id`,
  `payment_method`, `amount`, optional `reference`, and `created_at`. Example: if
  a user pays KSh 100 cash and KSh 250 by M-Pesa for one sale, save two
  `sale_payments` rows for that same `sale_id`.
- Completed sales should deduct stock from the specific batch items that supplied
  the sold units. Each deduction must write a `stock_movements` row with a
  traceable sale reason.
- For the pilot, save `sales_items` at the stock-source level: one row should
  represent one product sold from one `batch_item`. If a cashier sells 5 units of
  one product and the stock comes from two batches, split that into two
  `sales_items` rows behind the scenes. The receipt can still show one combined
  product line, but the database keeps the batch cost and profit exact.
- Sales should preserve the batch cost snapshot used for each sold item so gross
  profit can be calculated from the completed sale without depending on later
  product or batch edits.
- Do not edit `databases/repositories/` during this pass. First settle the table
  shapes, model fields, and business invariants. Repository workflows come after
  suggestions 1-8 are clear.

## Proposed `sales` Fields

- `receipt_number`: local human-readable sale number. Used for receipts, search,
  and shopkeeper support. It must be generated offline.
- `customer_name_snapshot`: optional buyer name entered at sale time. Used for
  receipts and casual lookup even when the buyer is not saved as a creditor.
- `creditor_id`: optional link to the customer who owes money when the sale is
  partly paid or unpaid.
- `subtotal`: total before discount and tax in integer KSH.
- `discount`: discount amount in integer KSH.
- `tax`: tax amount in integer KSH. Keep for future tax configuration even if the
  pilot mostly uses zero tax.
- `total`: final amount due in integer KSH.
- `amount_paid`: total received across `sale_payments` in integer KSH.
- `balance`: amount still owed in integer KSH. `0` means fully paid.
- `cost_total`: total cost of goods sold in integer KSH, calculated from
  `sales_items.line_cost`.
- `gross_profit`: `total - cost_total` in integer KSH. Stored so today's sales
  and profit reports do not depend on later product or batch edits.
- `status`: sale state, such as `draft`, `completed`, `partially_paid`,
  `cancelled`, or `reversed`.
- `reversal_of_sale_id`: optional link to the original sale when this row
  reverses a completed sale.
- `reversal_reason`: optional reason explaining a reversal or cancellation.
- `created_at`: timestamp for when the sale was created.
- `completed_at`: timestamp for when the sale became final.
- `updated_at`: timestamp for the latest allowed metadata update.

Notes:

- `payment` and `payment_method` should move out of `sales` and into
  `sale_payments`.
- `price` and `done` should not be kept as final schema fields unless a concrete
  UI need remains. `total` and `status` carry the real business meaning better.

## Proposed `sale_payments` Fields

- `sale_id`: links the payment to the sale.
- `payment_method`: payment channel, such as `cash`, `mpesa`, or `credit`.
- `amount`: amount received in integer KSH.
- `reference`: optional M-Pesa confirmation code, receipt number, or note.
- `status`: payment state, such as `completed`, `cancelled`, or `reversed`.
- `created_at`: timestamp for when the payment was recorded.
- `reversed_at`: timestamp for when the payment was reversed, when applicable.

Notes:

- Credit should be represented by the sale balance and customer credit tables,
  not as fake money received.
- A mixed sale should have one row per real payment line. Example: KSh 100 cash
  and KSh 250 M-Pesa creates two `sale_payments` rows.

## Proposed Customer Credit Tables

Keep `creditors` for customer identity, but make the credit transaction itself
clear and traceable.

Proposed `creditors` fields:

- `name`: customer name.
- `phone_number`: optional phone number.
- `location`: optional location or shopkeeper note.
- `created_at`: timestamp for when the customer was created.
- `updated_at`: timestamp for the latest customer detail update.

Proposed `creditor_sales` fields:

- `creditor_id`: links the debt to the customer.
- `sale_id`: links the debt to the completed sale that created it.
- `original_amount`: amount put on credit in integer KSH when the sale completed.
- `amount_paid`: total repayments recorded against this credit in integer KSH.
- `balance`: amount still owed in integer KSH.
- `status`: credit state, such as `open`, `partially_paid`, `paid`, or
  `cancelled`.
- `created_at`: timestamp for when the credit was created.
- `settled_at`: timestamp for when the credit became fully paid, when applicable.

Proposed `creditor_repayments` fields:

- `creditor_sale_id`: links the repayment to the customer credit record.
- `sale_payment_id`: optional link to a `sale_payments` row when the repayment is
  recorded as money received against the original sale.
- `payment_method`: payment channel, such as cash or M-Pesa.
- `amount`: repayment amount in integer KSH.
- `reference`: optional M-Pesa code, receipt number, or note.
- `created_at`: timestamp for when the repayment was recorded.

Why: the shop owner needs to see who owes money, which sale created the debt,
which repayments happened, and what balance remains. This mirrors the vendor
credit direction and avoids hiding debt inside a generic `sales.balance` only.

## Vendor Credit Direction

If the shop buys stock and does not fully pay the vendor, save the debt in its
own vendor credit table. Do not hide vendor debt only inside `batches.balance`.
The batch can keep summary fields, but the credit record should explain the real
payable.

Proposed tables:

- `vendor_credits`: one payable created when a completed batch has an unpaid
  balance.
- `vendor_credit_payments`: repayment rows against a vendor credit. These should
  also be reflected in `batch_payments` when the repayment is for a stock batch.

Why: vendor credit is a real shop workflow, just like customer credit. The owner
needs to know which supplier is owed, which stock purchase created the debt, how
much was originally owed, which repayments have been made, and what balance
remains.

Proposed `vendor_credits` fields:

- `vendor_id`: links the debt to the supplier.
- `batch_id`: links the debt to the completed stock purchase that created it.
- `original_amount`: unpaid amount in integer KSH when the credit was created.
- `amount_paid`: total repayments recorded against this credit in integer KSH.
- `balance`: amount still owed in integer KSH.
- `status`: current state, such as `open`, `partially_paid`, `paid`, or
  `cancelled`.
- `created_at`: timestamp for when the vendor credit was created.
- `settled_at`: timestamp for when the debt became fully paid, when applicable.

Proposed `vendor_credit_payments` fields:

- `vendor_credit_id`: links the repayment to the vendor credit.
- `batch_payment_id`: links to the matching `batch_payments` row, when the
  repayment is tied to a stock batch payment.
- `payment_method`: payment channel, such as cash or M-Pesa.
- `amount`: repayment amount in integer KSH.
- `reference`: optional M-Pesa code, receipt number, or note.
- `created_at`: timestamp for when the repayment was recorded.

## Implementation Order

Finish the core data model and business rules from suggestions 1-8 before
building the repository layer from suggestion 9.

Order:

1. Sale completion as one ledger transaction.
2. Separate payment tables for sales and stock purchases.
3. Batch-level stock deductions for sales.
4. Cost and profit snapshots on completed sale items.
5. `stock_movements` as the stock audit ledger.
6. Reversal/cancellation records instead of silent mutation.
7. Draft state kept separate from permanent stock records.
8. First-class credit flows for both customer credit and vendor credit.
9. Repository-level workflows after the above rules are settled.

Why: repositories should enforce the final business rules, not guess them while
the data model is still changing. Once 1-8 are clear, repositories can safely own
operations like complete sale, reverse sale, complete restock, record customer
repayment, record vendor repayment, and correct stock.

Do first, without touching repositories:

- Update WatermelonDB schema table definitions for `sales`, `sales_items`,
  `sale_payments`, `creditor_sales`, `creditor_repayments`, `vendor_credits`,
  and `vendor_credit_payments`.
- Update WatermelonDB model classes/getters for those fields.
- Keep the existing repository files unchanged until the schema is settled.
- Check that all money fields are integer KSH numbers.
- Check that completed sale and credit records have enough snapshot fields to
  survive later product, batch, customer, or vendor edits.

Do later, after the schema/model pass:

- Build repository workflows for complete sale, reverse sale, complete restock,
  record customer repayment, record vendor repayment, and correct stock.
- Move UI screens to call those repository workflows instead of assembling
  business writes directly.
- Add focused tests for complete sale, partial payment, customer credit, vendor
  credit, reversal, and stock movement creation.

## Repository Type Direction

Avoid importing separate DTO/interface files into repositories when the same
shape can be derived from the repository mapper functions. The Watermelon model
classes in `databases/watermelon/models.ts` should be the database-facing source
for fields, and repository mappers should convert those records into plain
objects for the UI.

Preferred pattern:

- Use Watermelon record classes for collection access and writes, such as
  `BatchRecord`, `BatchItemRecord`, and `VendorCreditRecord`.
- Let mapper functions like `toBatchDto`, `toBatchItemDto`, and
  `toVendorCreditDto` define the plain object shape returned by the repository.
- Export local repository types with `ReturnType` or `Awaited<ReturnType<...>>`
  from those mappers instead of importing separate DTO interfaces that can drift
  from the schema.
- Do not return raw Watermelon records to UI code. Repositories should still
  return plain objects so screens do not become coupled to Watermelon internals.

Why: the schema/model layer is the durable database contract. Separate DTO files
are easy to forget when schema fields change. Mapper-derived types keep the
repository return shape close to the actual conversion code while still
protecting the UI from database record objects.

## Proposed `sales_items` Fields

- `sale_id`: links the item to the completed sale header.
- `product_id`: links back to the product that was sold. Used for product
  reports and lookups.
- `batch_id`: links to the stock batch that supplied the sold units. Used to
  trace which restock purchase the sale consumed.
- `batch_item_id`: links to the exact batch item row that was deducted. This is
  the main field for batch-level stock deduction and cost tracing.
- `product_name_snapshot`: stores the product name at sale time. Used for
  receipts and historical reports even if the product is renamed later.
- `product_barcode_snapshot`: stores the barcode at sale time, when available.
  Used for audit/search without depending on later product edits.
- `quantity`: number of base units sold from this `batch_item`.
- `unit_selling_price`: selling price per unit in integer KSH at the time of
  sale.
- `line_total`: `quantity * unit_selling_price` in integer KSH. Used for sale
  totals and reports without recalculating from mutable product data.
- `unit_cost`: cost per unit in integer KSH from the consumed batch item. Used to
  calculate profit.
- `line_cost`: `quantity * unit_cost` in integer KSH. Used for gross profit and
  cost-of-goods reporting.
- `gross_profit`: `line_total - line_cost` in integer KSH. Stored so completed
  sale profit remains stable after later product or batch edits.
- `stock_movement_id`: links to the `stock_movements` row created for this
  deduction. Used to audit why stock reduced.
- `created_at`: timestamp for when the sale item was written.
