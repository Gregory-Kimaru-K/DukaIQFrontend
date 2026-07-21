import { appSchema, tableSchema } from "@nozbe/watermelondb";

export const databaseSchema = appSchema({
  version: 3,
  tables: [
    tableSchema({
      name: "shops",
      columns: [
        { name: "name", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "categories",
      columns: [
        { name: "name", type: "string" },
        { name: "shop_id", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "types",
      columns: [
        { name: "name", type: "string" },
        { name: "category_id", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "vendors",
      columns: [
        { name: "name", type: "string" },
        { name: "phone_number", type: "string" },
      ],
    }),
    tableSchema({
      name: "tax_types",
      columns: [
        { name: "name", type: "string" },
        { name: "code", type: "string" },
        { name: "rate", type: "number" },
        { name: "active", type: "boolean" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "products",
      columns: [
        { name: "barcode", type: "string", isOptional: true },
        { name: "name", type: "string" },
        { name: "shop_id", type: "string", isIndexed: true },
        { name: "category_id", type: "string", isIndexed: true },
        { name: "type_id", type: "string", isIndexed: true },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
        { name: "current_stock", type: "number" },
        { name: "total_purchased", type: "number" },
        { name: "total_sold", type: "number" },
        { name: "current_batch_id", type: "string", isOptional: true },
        { name: "batch_count", type: "number", isOptional: true },
        { name: "unit", type: "string" },
      ],
    }),
    tableSchema({
      name: "drafts",
      columns: [
        { name: "name", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "draft_items",
      columns: [
        { name: "draft_id", type: "string", isIndexed: true },
        { name: "product_id", type: "string", isIndexed: true },
        { name: "quantity", type: "number" },
        { name: "expiry", type: "string", isOptional: true },
        { name: "price", type: "number" },
        { name: "vat", type: "number", isOptional: true },
        { name: "tax_type_id", type: "string", isIndexed: true, isOptional: true },
        { name: "exercise_duty", type: "number" },
        { name: "profit", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "batches",
      columns: [
        { name: "draft_id", type: "string", isIndexed: true, isOptional: true },
        { name: "payment_method", type: "string" },
        { name: "price", type: "string" },
        { name: "payment", type: "string" },
        { name: "vendor", type: "string" },
        { name: "created_at", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "batch_items",
      columns: [
        { name: "batch_id", type: "string", isIndexed: true },
        { name: "product_id", type: "string", isIndexed: true },
        { name: "quantity", type: "number" },
        { name: "expiry", type: "string", isOptional: true },
        { name: "price", type: "number" },
        { name: "vat", type: "number", isOptional: true },
        { name: "tax_type_id", type: "string", isIndexed: true, isOptional: true },
        { name: "exercise_duty", type: "number" },
        { name: "profit", type: "number" },
        { name: "updated_at", type: "number" },
      ],
    }),
    tableSchema({
      name: "credits",
      columns: [{ name: "vendor_id", type: "string", isIndexed: true }],
    }),
    tableSchema({
      name: "credit_batches",
      columns: [
        { name: "credit_id", type: "string", isIndexed: true },
        { name: "batch_id", type: "string", isIndexed: true },
      ],
    }),
    tableSchema({
      name: "sales",
      columns: [
        { name: "payment", type: "string" },
        { name: "payment_method", type: "string" },
        { name: "price", type: "string" },
        { name: "done", type: "boolean" },
        { name: "payee", type: "string" },
      ],
    }),
    tableSchema({
      name: "sales_items",
      columns: [
        { name: "product_id", type: "string", isIndexed: true },
        { name: "sale_id", type: "string", isIndexed: true },
        { name: "quantity", type: "number" },
        { name: "price", type: "number" },
      ],
    }),
    tableSchema({
      name: "creditors",
      columns: [
        { name: "name", type: "string" },
        { name: "phone_number", type: "string" },
        { name: "location", type: "string" },
      ],
    }),
    tableSchema({
      name: "creditor_sales",
      columns: [
        { name: "creditor_id", type: "string", isIndexed: true },
        { name: "sale_id", type: "string", isIndexed: true },
      ],
    }),
  ],
});
