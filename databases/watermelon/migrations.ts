import {
  addColumns,
  createTable,
  schemaMigrations,
} from "@nozbe/watermelondb/Schema/migrations";

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        createTable({
          name: "drafts",
          columns: [
            { name: "name", type: "string" },
            { name: "created_at", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),
        createTable({
          name: "draft_items",
          columns: [
            { name: "draft_id", type: "string", isIndexed: true },
            { name: "product_id", type: "string", isIndexed: true },
            { name: "quantity", type: "number" },
            { name: "expiry", type: "string", isOptional: true },
            { name: "price", type: "number" },
            { name: "vat", type: "number", isOptional: true },
            { name: "exercise_duty", type: "number" },
            { name: "profit", type: "number" },
            { name: "updated_at", type: "number" },
          ],
        }),
        addColumns({
          table: "batches",
          columns: [
            { name: "draft_id", type: "string", isOptional: true, isIndexed: true },
          ],
        }),
      ],
    },
  ],
});
