import { Database } from "@nozbe/watermelondb";
import SQLiteAdapter from "@nozbe/watermelondb/adapters/sqlite";

import { modelClasses } from "./models";
import { migrations } from "./migrations";
import { databaseSchema } from "./schema";

const adapter = new SQLiteAdapter({
  dbName: "dukaiq",
  schema: databaseSchema,
  migrations,
  jsi: true,
  onSetUpError: (error) => {
    console.error("WatermelonDB setup failed", error);
  },
});

export const database = new Database({
  adapter,
  modelClasses,
});
