import { mysqlTable, serial, text, int, varchar } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// CardCategory table (Ensure id is explicitly int)
export const CardCategory = mysqlTable("CardCategory", {
  id: int("id").autoincrement().primaryKey(), // Changed from serial() to int()
  categoryName: varchar("category_name", { length: 255 }).notNull(),
  categoryDesc: varchar("category_desc", { length: 255 }).notNull(),
});

// CardWord table with a foreign key to CardCategory
export const CardWord = mysqlTable("CardWord", {
  id: int("id").autoincrement().primaryKey(), // Ensure consistency
  english: varchar("english", { length: 255 }).notNull(),
  spanish: varchar("spanish", { length: 255 }).notNull(),
  categoryId: int("category_id")
    .notNull()
    .references(() => CardCategory.id),
});

// Define relations
export const CardCategoryRelations = relations(CardCategory, ({ many }) => ({
  words: many(CardWord),
}));

export const CardWordRelations = relations(CardWord, ({ one }) => ({
  category: one(CardCategory, {
    fields: [CardWord.categoryId],
    references: [CardCategory.id],
  }),
}));
