# App Work Log

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
