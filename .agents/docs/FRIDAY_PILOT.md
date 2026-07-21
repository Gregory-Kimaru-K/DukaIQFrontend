# Friday Pilot Tracker

Target: Friday, July 24, 2026

## Definition of success

One shopkeeper can record at least 30 real sales without:

- An application crash
- Lost records
- Incorrect totals
- Incorrect stock deductions
- Constant developer assistance

## Current status

- [x] Product creation works
- [ ] Product editing works
- [x] Opening stock works
- [ ] Cash sale works
- [ ] M-Pesa sale works
- [ ] Completed sale reduces stock
- [ ] Customer credit sale works
- [ ] Credit repayment works
- [ ] Today's totals are correct
- [ ] Sale correction/reversal works
- [ ] Data survives application restart
- [ ] Application works in airplane mode
- [ ] APK installs on the pilot phone
- [ ] Existing data survives an APK update
- [ ] Manual backup/export works

## Draft and batch restocking

- [x] Drafts can be saved
- [x] Products can be added to a draft
- [x] Draft items can be deleted
- [x] All draft items can be cleared without deleting the draft
- [x] Drafts can be deleted with their draft items
- [x] A batch can be created from a draft
- [x] Batch creation copies draft items into saved batch items
- [x] Batch creation increases product stock
- [ ] Draft-to-batch flow has been tested on the pilot phone
- [ ] Repeated batch creation from the same draft has a clear user confirmation

## Blockers

### Biggest remaining blocker

Sales are still not pilot-ready. Evidence from the code:

- `app/(apps)/sales/(other)/index.tsx` renders placeholder products instead of WatermelonDB products.
- `components/drawerssale/Checkout.tsx` and `components/drawerssale/Payments.tsx` use hard-coded totals/items.
- `databases/repositories/SalesRepo.ts` can create sales and sales items, but it does not complete a sale atomically with stock deduction.
- `SalesRepo.deleteSale` permanently deletes sales, which conflicts with the pilot rule to reverse/cancel completed sales instead of silently deleting them.

### Fixed on 2026-07-21

- TypeScript compile gate now passes with `npx tsc --noEmit`.
- Expo lint now exits successfully with `npm run lint`. Remaining lint output is warnings only.
- Removed app-side TypeScript blockers in sales screens and credit dropdown typing.
- Replaced the compiling dependency on `react-native-country-codes-picker` in the pilot phone input with a local `+254` control, avoiding third-party TSX package errors during validation.

### Evidence for checked items

- Product creation: `components/drawerproduct/ProductAdd.tsx` writes products through `ProductRepo.createProduct`, and products are stored in WatermelonDB.
- Opening stock: draft restocking writes saved batches through `BatchRepo.completeDraft`, creates `batch_items`, and updates product `currentStock` / `totalPurchased`.
- Draft saving: `BatchRepo.createDraft` writes to the `drafts` WatermelonDB table.
- Adding draft products: `BatchRepo.addProductToDraft` writes to `draft_items` and prevents duplicate product rows in the same draft.
- Draft item deletion/clearing: `BatchRepo.deleteDraftItem` and `BatchRepo.clearDraftItems` remove selected draft items or all items in a draft.
- Draft deletion: `BatchRepo.deleteDraft` deletes the draft and its draft items.
- Draft-to-batch creation: `BatchRepo.completeDraft` creates a saved batch, copies draft items into `batch_items`, and updates product stock fields.

## Deferred until after pilot

- Cloud synchronization
- Licensing and payments
- Self-hosting
- Advanced analytics
- Advanced tax/eTIMS
- Expenses
- Multi-device support
