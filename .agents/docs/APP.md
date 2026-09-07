# App Work Log

## Current Status: Products Restock Flow

Product Details and partial draft restocking are implemented. The next active
work is payments, Daraja/M-Pesa handling, and vendor credit before moving to
the Credit and Sales apps.

## 2026-07-29: Batch Draft Workflow

Calendar block: Wednesday, July 29, 2026, 12:00 PM-2:00 PM Africa/Nairobi.

Focus area:

- `app/(apps)/products/`
- `app/(apps)/products/(other)/drafts/[draftid].tsx`

Work agenda:

1. Create drafts.
2. Add products to a draft.
3. Clear draft items.
4. Complete a draft into a batch.

Execution setup:

1. Start at `app/(apps)/products/(other)/drafts/[draftid].tsx`.
2. From that draft detail screen, first verify the product-add path.
3. Product selection/addition starts through `ProductAdd`.
4. The drawer entry point for adding products is
   `components/drawerproduct/ProductDraw.tsx`.

Context: this session focuses on entering the batch creation flow from the
products app section before moving deeper into the remaining database and
repository work.

## Next Task: Save Draft Product Details

Current file:

- `components/drawerproduct/product-details/useProductDetailsForm.ts`

Objective:

- When product details are saved from a draft, persist every value required to
  correctly restock the product later.

Required behavior:

1. Support saving a product priced and stocked as individual units.
2. Support saving a product purchased or sold as packets.
3. Persist quantity, buying price, selling/profit value, stock type, profit
   mode, and quantity per packet.
4. Persist the calculated unit price when packet pricing uses the unit mode.
5. Persist the selected tax type and tax amount using the schema-backed draft
   item fields.
6. Persist an optional expiry date after validating `YYYY-MM-DD` input.
7. Reload the saved draft item and verify that the form displays the same
   values for both unit and packet workflows.
8. Ensure saving does not complete the draft or change stock; stock changes
   happen only when the draft is completed.

Verification focus:

- Confirm the saved values survive closing and reopening the draft screen.
- Confirm packet calculations do not silently replace the configured buying
  price or selling mode.
- Confirm the save path remains offline and uses the existing `BatchRepo`
  write operation.

## Next Task: Complete Restock Payments and Finish Products

Current flow:

```text
Product Details → Restock selection → Draft completion → Payments → Batch
```

Focus files:

- `components/drawerssale/Payments.tsx`
- `components/drawerproduct/RestockDraw.tsx`
- `app/(apps)/products/(other)/drafts/[draftid].tsx`
- `databases/repositories/BatchRepo.ts`

Work agenda:

1. Build the payments bottom sheet for a completed restock.
2. Support cash payment and M-Pesa payment paths.
3. Add the Daraja payment-request integration for a configured Paybill or
   Business Number, while keeping the flow usable offline for cash and
   already-recorded payments.
4. Fix `handleCompleteDraft` so the selected draft item IDs and the payment
   details reach the repository together.
5. Complete only the selected restock items, or all remaining draft items when
   no selection was made.
6. Save each stock payment in `batch_payments` and keep the batch summary fields
   (`amount_paid` and `balance`) consistent.
7. Create and update vendor credit for any unpaid restock balance, including
   later vendor-credit repayments.
8. Verify that completed items leave `draft_items`, the parent draft remains,
   and unselected items remain available for a later restock.
9. Verify the completed batch screen and its batch items after app restart.

Products-page completion criteria:

- A shop can restock selected products without completing the entire draft.
- Cash and M-Pesa payments are recorded with amount, method, and reference
  where available.
- An unpaid supplier balance becomes traceable vendor credit.
- The flow remains offline-first; internet is only needed for a Daraja request.
- No completed batch or payment is silently deleted.

## Following Task: Credit App

After the products restock and payment flow is complete:

1. Set up vendor-credit and customer-credit views needed by the pilot.
2. Add credit repayment recording and balance updates.
3. Verify credit history survives app restart and works offline.

## Later Task: Sales App

After the credit app:

1. Build sale completion as one repository-level transaction.
2. Record cash, M-Pesa, and customer-credit payments separately.
3. Deduct stock from specific batch items and write stock movements.
4. Preserve cost, selling-price, and profit snapshots on completed sales.
5. Add today's sales and reversal/correction flows.
