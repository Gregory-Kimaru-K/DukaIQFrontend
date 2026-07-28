# Suggestion Box

Context: DukaIQ is an offline-first POS for small Kenyan shops. The current
database rebuild is moving toward immutable completed sales, separate payment
tables, batch-based stock deductions, integer money, and a traceable stock
ledger.

## 1. Treat Sale Completion As A Ledger Transaction

When a cashier completes a sale, one repository method should write the whole
business event:

- `sales`
- `sales_items`
- `sale_payments`
- stock deductions from batch items
- `stock_movements`
- customer credit records, when payment is incomplete
- sale item cost/profit snapshots

Why: this is the heart of the POS. In an offline-first shop, the app cannot rely
on a server to repair partial writes. A completed sale must either be fully saved
or not saved at all. This keeps stock, payments, customer debt, and profit from
drifting apart.

## 2. Keep Payments In Separate Tables

Keep `batch_payments` for stock purchases and add `sale_payments` for customer
sales. The parent records can keep summary fields, but each payment line should
be stored separately.

Why: Kenyan shops often split payments across cash, M-Pesa, and credit. A single
`payment_method` field on `sales` is too weak. Separate payment rows make it
easy to answer questions like:

- How much cash came in today?
- How much M-Pesa came in today?
- Which sale has a missing or partial payment?
- Which M-Pesa reference belongs to this sale?

This also matches how mature systems like Odoo and Shopify model payment
transactions separately from the order/sale itself.

## 3. Deduct Sales From Specific Batch Items

Do not only reduce `products.quantity`. A sale should consume stock from one or
more `batch_items`, using a predictable costing rule such as FIFO unless we later
choose another rule explicitly.

Why: batch-level stock gives the shop owner better truth. It makes profit
calculation reliable because the app knows the actual cost of the units sold. It
also supports future questions like "which stock batch is almost finished?" or
"did this old expensive stock sell yet?"

## 4. Snapshot Cost And Profit On Completed Sale Items

Each completed `sales_items` row should keep the selling price, quantity, unit
cost, cost source, and gross profit values used at the moment of sale.

Why: product prices and batch costs can change later. Completed sales should not
change history when today’s selling price is edited tomorrow. This protects daily
sales reports, credit records, and profit calculations.

## 5. Use `stock_movements` As The Audit Ledger

Every stock change should write a `stock_movements` row. This includes opening
stock, restocking, sales, reversals, corrections, and damaged/lost stock if added
later.

Why: stock quantity by itself only tells us "what is left." The movement ledger
tells us "what happened." That is essential when a shopkeeper asks why the app
says there are 7 sodas left when they expected 10.

## 6. Reverse Instead Of Editing Completed Business Events

Completed sales and completed stock batches should not be silently deleted or
mutated. Mistakes should be corrected through cancellation, reversal, or
adjustment records.

Why: small shops still need trustworthy history. If a cashier records the wrong
sale, the system should show the correction path instead of rewriting yesterday.
This keeps stock movements, payments, and credit balances explainable.

## 7. Separate Draft State From Permanent Stock Records

Keep drafts as preparation state only. Once stock is purchased, save only the
purchased subset into `batches` and `batch_items`.

Why: a draft can contain guesses, planned items, or items that were not actually
bought. Permanent stock records should represent what entered the shop, not what
someone considered buying.

## 8. Make Customer Credit A First-Class Flow

When a sale is partially paid or unpaid, create clear customer credit records
linked to the sale and repayments. Do not hide debt inside a generic sale
balance field only.

Why: customer credit is a real workflow in Kenyan dukas. The owner needs to know
who owes money, what sale created the debt, when repayments happened, and what
balance remains.

## 9. Prefer Repository-Level Business Workflows

Use repositories for business operations such as:

- complete sale
- reverse sale
- complete restock
- record credit repayment
- correct stock

Avoid spreading those workflows across screens and components.

Why: the UI should collect intent, not own accounting rules. Repositories make it
harder for one screen to forget a payment row, stock movement, or profit
snapshot. They also make offline database writes easier to test.

## 10. Optimize For The Friday Pilot, Not The Whole ERP

Build the reliable path first:

- create product
- add opening stock
- complete sale
- take cash/M-Pesa/credit payment
- reduce batch stock
- show today’s sales
- reverse mistakes
- preserve data after restart

Why: Odoo-like flexibility can come later. For the pilot, the winning feature is
trust. The shopkeeper should be able to record the day without the app losing
money, stock, or debt history.
