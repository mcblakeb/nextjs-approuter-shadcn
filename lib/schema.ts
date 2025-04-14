// db/schema.ts
import {
  mysqlTable,
  serial,
  text,
  date,
  datetime,
  int,
  varchar,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// Retro table
const retros = mysqlTable("retros", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  email: text("email").notNull(),
  date: date("date").notNull(),
  slug: text("slug").notNull(),
  createdAt: datetime("created_at").default(new Date()).notNull(),
  updatedAt: datetime("updated_at").$onUpdateFn(() => new Date()),
});

// RetroNote table
const retroNotes = mysqlTable("retro_notes", {
  id: serial("id").primaryKey(),
  retroId: int("retro_id").notNull(),
  content: text("content").notNull(),
  createdByName: text("created_by_name").notNull(),
  createdByEmail: text("created_by_email").notNull(),
  category: text("category"),
  categoryId: int("category_id").notNull(),
  createdAt: datetime("created_at").default(new Date()).notNull(),
});

// Define relations
const retroRelations = relations(retros, ({ many }) => ({
  notes: many(retroNotes),
}));

const retroNoteRelations = relations(retroNotes, ({ one }) => ({
  retro: one(retros, {
    fields: [retroNotes.retroId],
    references: [retros.id],
  }),
}));

// Types
type Retro = typeof retros.$inferSelect;
type NewRetro = typeof retros.$inferInsert;
type RetroNote = typeof retroNotes.$inferSelect;
type NewRetroNote = typeof retroNotes.$inferInsert;

// CardCategory table (Ensure id is explicitly int)
const CardCategory = mysqlTable("CardCategory", {
  id: int("id").autoincrement().primaryKey(), // Changed from serial() to int()
  categoryName: varchar("category_name", { length: 255 }).notNull(),
  categoryDesc: varchar("category_desc", { length: 255 }).notNull(),
});

// CardWord table with a foreign key to CardCategory
const CardWord = mysqlTable("CardWord", {
  id: int("id").autoincrement().primaryKey(), // Ensure consistency
  english: varchar("english", { length: 255 }).notNull(),
  spanish: varchar("spanish", { length: 255 }).notNull(),
  categoryId: int("category_id")
    .notNull()
    .references(() => CardCategory.id),
});

// Define relations
const CardCategoryRelations = relations(CardCategory, ({ many }) => ({
  words: many(CardWord),
}));

const CardWordRelations = relations(CardWord, ({ one }) => ({
  category: one(CardCategory, {
    fields: [CardWord.categoryId],
    references: [CardCategory.id],
  }),
}));

export {
  retros,
  retroNotes,
  retroRelations,
  retroNoteRelations,
  type Retro,
  type NewRetro,
  type RetroNote,
  type NewRetroNote,
  CardCategory,
  CardWord,
  CardCategoryRelations,
  CardWordRelations,
};
