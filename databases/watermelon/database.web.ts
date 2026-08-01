import { Database } from "@nozbe/watermelondb";
import LokiJSAdapter from "@nozbe/watermelondb/adapters/lokijs";

import { migrations } from "./migrations";
import { modelClasses } from "./models";
import { databaseSchema } from "./schema";

const adapter = new LokiJSAdapter({
  dbName: "dukaiq",
  schema: databaseSchema,
  migrations,
  useWebWorker: false,
  useIncrementalIndexedDB: true,
  onSetUpError: (error) => {
    console.error("WatermelonDB web setup failed", error);
  },
});

export const database = new Database({
  adapter,
  modelClasses,
});
