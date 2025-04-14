// IGNORE THIS FILE - IT IS AUTO-GENERATED
// db/schema.ts
import {
  mysqlTable,
  serial,
  int,
  varchar,
  primaryKey,
  unique,
} from "drizzle-orm/mysql-core";

export const cardCategory = mysqlTable(
  "CardCategory",
  {
    id: serial().notNull(),
    categoryName: varchar("category_name", { length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "CardCategory_id" }),
    unique("id").on(table.id),
  ]
);

export const cardWord = mysqlTable(
  "CardWord",
  {
    id: serial().notNull(),
    english: varchar({ length: 255 }).notNull(),
    spanish: varchar({ length: 255 }).notNull(),
    categoryId: int("category_id").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "CardWord_id" }),
    unique("id").on(table.id),
  ]
);
