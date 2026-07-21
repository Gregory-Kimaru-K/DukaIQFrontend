# DukaIQ

DukaIQ is an offline-first POS application for small Kenyan shops.

## Stack

- Expo and React Native
- TypeScript
- Expo Router
- WatermelonDB
- Android-first
- Offline operation is mandatory

## Friday pilot

Target date: Friday, July 24, 2026.

The objective is not to complete the entire product. The objective is to let
one real shop reliably record products, stock, sales, and customer credit.

## Pilot scope

Must work:

- Create and edit products
- Add opening stock
- Record cash and M-Pesa sales
- Reduce stock after a completed sale
- Record customer credit
- Record credit repayments
- View today's sales
- Correct or reverse mistakes
- Preserve data after app restart
- Operate completely offline

Not required for the pilot:

- Cloud synchronization
- Subscription and licensing
- Self-hosting
- Advanced analytics
- Expenses
- Tax/eTIMS
- AI features
- Perfect animations
- Multi-device support

## Engineering rules

- Preserve completed-sale snapshots.
- Store money as integers.
- Every stock change must have a traceable reason.
- Do not silently delete completed sales; reverse or cancel them.
- Never make internet access necessary to complete a sale.
- Prioritize data correctness and reliability over visual polish.
- Do not introduce large architectural changes without explaining the risk.