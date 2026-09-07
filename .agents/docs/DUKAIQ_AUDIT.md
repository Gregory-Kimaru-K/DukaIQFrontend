# DukaIQ implementation audit — September 7, 2026

## Update — compilation baseline completed September 7

Missing-import cleanup is complete. TypeScript now passes; ESLint reports zero errors and 49 warnings. Product DTO types derive from repository converters; batch detail uses BatchRepo DTOs; preserved sales API contracts live beside SalesRepo. No database schema or financial write behavior changed.

Android JS/Hermes export succeeds. The existing development app loaded the updated bundle on the authorized USB phone and displayed its home screen. WatermelonDB logged a JSI-unavailable warning and asynchronous fallback. Stock, restart persistence, transactions and Daraja still require verification.

Local Expo server is running on localhost:8081 with USB forwarding, in CI mode (automatic reload disabled). Next block: persist all draft-item metadata and repair restock completion with repeated-submission and interrupted-write checks. WEEK_PLAN.md was absent when recording this update; it has not been recreated.

The original audit below remains a record of the starting state.

## Assessment

The repository contains a UI prototype and a partially connected inventory implementation. It is not yet an end-to-end shop POS. Sales, credit, and payment integration need substantial implementation, not just polish.

Scope: inspected application routes/components, all repositories, schema/models/adapters/migrations, and build configuration; ran TypeScript and ESLint. No Android runtime, restart, failure-injection, or Daraja sandbox tests were performed. “Implemented” below means code exists, not runtime acceptance.

Checks: `tsc --noEmit`: 18 errors (16 missing model imports, two implicit-any errors). `eslint .`: 16 errors and 52 warnings. Missing imports overlap between the checks; these are not 34 independent defects. package.json has no test script. Existing user changes were preserved. This audit changes documentation only.

## Workflow inventory

| Area | Existing implementation | Remaining work |
| --- | --- | --- |
| Navigation | Expo Router routes and drawers for inventory, sales, creditors | Finish real data/actions; remove misleading sample content and inactive controls |
| Persistence | WatermelonDB models/schema; SQLite on native, Loki/IndexedDB on web | Android initialization/restart/build verification; explicit error recovery; upgrade strategy (schema v1, empty migrations) |
| Product creation | Form creates shops/categories/types/products; barcode camera capture; repository-backed list | Fix missing DTO imports; loading/error/submission states; validate shop/category/type relationships |
| Product editing | updateProduct repository method | Wire product selection to an edit form; list currently passes no onPress callback; archive safely |
| Product search | Shared Search input | Connect query to filtering; current input has no outward callback |
| Stock entry | Draft creation, item details, restock summary, saved batch list/detail | Fix repeat completion, atomicity, amounts, units, vendor/payment handling and persistent quantity editing |
| Sale/cart | Sale/checkout components and schema | Replace sample products/items/totals with shared cart state and real prices; stock limits; real receipt detail |
| Cash sale | Repository primitives, cash button | Button has no handler; implement one completion operation for sale/items/payment/stock/credit |
| M-Pesa | Payment form shell | Entire Daraja sandbox bridge, requests, durable payment attempts/results, reconciliation, app state and offline fallback |
| Stock deduction | Stock movement table; batch receipt movements | No sale-side stock decrement or stock movement creation found |
| Customer credit | Creditor/link/repayment methods in SalesRepo | Creditor screens are placeholders; connect customer creation/selection, credit sale, balances and repayment history |
| Repayment | Creates repayment and updates creditor-sale balance | Atomically reconcile sale payment and sale balance; validation, duplicate protection, corrections |
| Today's sales | Sales listing repository | Screens render sample rows; date filtering, totals by payment method, reversal treatment |
| Corrections | Reversal fields; deleteSale sets cancelled | Complete reversal workflow with reason, stock and credit reconciliation; protect completed rows/items |
| Supplier credit | Vendor-credit records and payment methods | Not core customer-credit work; repair automatic invalid records created by current restocking path |
| Statistics | Routes/scaffolding | Defer advanced analytics; today's sales remains mandatory |
| Release | EAS preview APK profile | Actual build/install/smoke test and operator instructions |

## Priority defects and evidence

### P0 — blocks a correct pilot

1. **Compilation is broken.** Missing `databases/models/...` imports in ProductRepo, SalesRepo, ProductAdd, DropDown and batch detail. Restore coherent DTO types without replacing the existing database architecture.
2. **No real checkout.** `components/drawerssale/Payments.tsx` has no onPress on payment action buttons; `Checkout.tsx` renders sample CheckItems; sale creation uses sample products. No SalesRepo calls were found in the app/components. Complete-sale behavior must be implemented and connected.
3. **Sales do not update stock.** SalesRepo.createSale/createSalesItem only create their own records. Build a validated, atomic operation covering immutable snapshots, payment, stock totals/movements and credit where applicable. Specify batch allocation and fractional Kg/Litre quantity rules.
4. **Restock can run twice for one draft.** `BatchRepo.completeDraft` leaves draft/items available and stores no completion link/status. The caller reloads the same draft. Repeating completion can add stock again. Introduce persisted one-time completion, not just a disabled button.
5. **Restock writes are split.** completeDraft creates the batch before preparing/committing related items and stock. A later failure can leave a batch without its intended records. Prepare all mutations and commit together; verify with a failing operation test.
6. **Money lacks an integer contract.** Raw numeric values are stored throughout; productDetailsUtils.calculateTaxAmount returns decimal values. Decide integer minor units, validate at repository boundaries, format at the UI boundary and explicitly convert for Daraja. Existing data needs an explicit conversion decision before changing semantics.
7. **Completed history is mutable.** SalesRepo.updateSale/updateSalesItem permit changes without completion guards; deleteSalesItem permanently deletes. deleteSale only changes status, with no stock/payment/credit reversal. Implement auditable reversal and draft-only editing/deletion.
8. **Repayment ledgers can diverge.** createCreditorRepayment updates the credit link but not sale totals or a corresponding sale payment. createSalePayment adds amount regardless of supplied payment status and does not update creditor links. Use one validated payment-posting operation; rejected/pending payments must not count as paid.
9. **Credit history can be orphaned.** updateCreditor replaces existing credit links; deleteCreditor destroys links without handling repayments. Prevent destructive changes to customers with history and preserve linked records.
10. **Stock history can be bypassed.** ProductRepo.updateProduct accepts stock totals directly; deleteBatch/deleteBatchItem remove stock source records without compensating stock changes. Route stock changes through reasoned movements; block unsafe deletion.

### P1 — finish while connecting the flows

- Restock screen calls completeDraft without vendor/payment details, so a positive total creates vendor credit with an empty vendor ID. Capture the intended payment information or explicitly distinguish opening stock from a supplier purchase.
- Restock summary includes VAT while completeDraft totals only price × quantity. Ensure displayed and committed totals agree; pilot tax features may be hidden, but existing calculations must not silently disagree.
- Product details form does not persist all pack/unit/profit-mode metadata. It also recalculates selling price from buying price on effects. Check save/reopen behavior before trusting pack stock and margins.
- CheckItem quantity controls use local state; for restock the displayed quantity comes from the item, and controls do not persist changes. Use a single source of truth.
- ProductRepo.toProductDto unconditionally resolves an optional type and omits current_batch despite the model tracking it. Sale item reads resolve live products, so permanently deleting a product can break old receipt reads despite stored snapshots.
- Repository findRecord helpers swallow all find errors as “not found”. Distinguish missing records from database failures; surface failed writes and allow safe retry.
- Validate finite positive amounts/quantities, overpayment policy, empty sales, stock availability, foreign keys and payment references at the write boundary. Guard repeated taps and interrupted writes.
- Refresh product/stock lists after returning from other routes; current product list loads on mount and after creation.
- Remove sample customer names and totals from production-facing flows. Barcode capture exists for product creation; sale barcode lookup is not wired.

## Daraja decision — sandbox first

User confirmed sandbox first. Proposed architecture: React Native app → small hosted JavaScript/TypeScript service or serverless function → Daraja. The service also receives payment results and stores them durably so the app can recover after disconnect/restart. Django is not required. A specific host, costs, and deployment have not been chosen or authorized by this audit.

Do not embed Daraja secrets in the app or public Expo environment variables. React Native's official security guidance recommends a server-side orchestration layer for secret-bearing API calls: https://reactnative.dev/docs/security#storing-sensitive-info

Safaricom's official M-Pesa Express page: https://developer.safaricom.co.ke/apis/MpesaExpressSimulate . Its public rendered page exposed only an overview during this audit, so exact current callback/query payloads and sandbox settings still need verification in the portal before implementation.

Implementation checklist:

- [ ] Sandbox app setup and server-side secret configuration.
- [ ] Authenticated payment-initiation endpoint with amount/phone validation, request limits and persistent idempotency key.
- [ ] Durable attempt record linked to the local sale; store provider request identifiers and final reference/result.
- [ ] Public HTTPS callback receiver with validation, correlation, duplicate handling and appropriate provider-result verification; untrusted callback input must not arbitrarily mark a sale paid.
- [ ] Payment status endpoint/reconciliation for missing callbacks, app restarts and uncertain requests; verify the provider query mechanism.
- [ ] App pending/success/failure/cancelled/unknown states. An accepted request is not proof of payment; a timeout is not proof of nonpayment.
- [ ] Post confirmed payment exactly once through the same local completion logic; handle late success after cancellation or a cash fallback as an exception requiring reconciliation.
- [ ] Test success, rejection, duplicate results, timeouts, network loss and restart in sandbox.
- [ ] Keep cash, credit and manually recorded M-Pesa usable offline. Manual entries must be identifiable and reconciled later, not labelled API-confirmed.

A local sale reversal does not itself refund an M-Pesa transaction. Record refund/reversal status separately; do not imply funds have moved without confirmation. Live credentials, activation and live-money tests are a later milestone.

## Work order and decision gates

1. Restore compilation and boot Android.
2. Establish money/quantity contracts and repair stock entry; prove one restock survives restart and cannot double-post.
3. Implement and test atomic cash checkout, stock movements and immutable receipt snapshots.
4. Connect customer credit, repayment posting and reversals; produce real today's-sales totals.
5. Connect the Daraja sandbox bridge to the stable sale/payment operations.
6. Run full offline/restart/failure checks and sandbox cases; build and test the preview APK.

Wednesday remains the target. Rough scheduling allowance: foundation/inventory 5–8 focused hours; cash checkout 5–8; credit/reversal/reporting 5–8; Daraja sandbox 4–8; Android acceptance/build/repairs 3–6. These are planning estimates, not measured commitments: total 22–38 hours, against approximately 22.5 daytime hours Monday–Wednesday before audit time. Full completion is therefore at risk. Re-estimate after the first passing cash sale; do not squeeze verification or mark incomplete flows done.

Monday close: compilation and Android boot pass; stock persists and cannot double-post; aim for first cash sale.
Tuesday close: cash/credit/repayment/reversal work with reconciled stock and totals; assess sandbox progress. If core flows are missing, revise Wednesday delivery expectation explicitly.
Wednesday: complete sandbox checks and release verification if preceding gates passed; otherwise report remaining blockers rather than claiming readiness.

Defer cloud sync, subscriptions, self-hosting, advanced analytics, expenses, tax/eTIMS, AI, multi-device support and animation polish. Do not expand supplier-credit features during the pilot sprint.
