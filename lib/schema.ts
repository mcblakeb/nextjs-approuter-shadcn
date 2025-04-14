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
// User table
const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  image: varchar("image", { length: 512 }),
  googleId: varchar("google_id", { length: 255 }).unique(),
  createdAt: datetime("created_at").default(new Date()).notNull(),
  updatedAt: datetime("updated_at").$onUpdateFn(() => new Date()),
});
// Retro table (updated)
const retros = mysqlTable("retros", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // Changed from text
  description: text("description"), // Can stay as text since it's not indexed
  date: date("date").notNull(),
  createdById: int("created_by_id").notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // Changed from text
  createdAt: datetime("created_at").default(new Date()).notNull(),
  updatedAt: datetime("updated_at").$onUpdateFn(() => new Date()),
});

// User X Retro mapping table (many-to-many)
const usersToRetros = mysqlTable("users_to_retros", {
  id: serial("id").primaryKey(),
  userId: int("user_id").notNull(),
  retroId: int("retro_id").notNull(),
  role: text("role").$type<"owner" | "member">().default("member"),
  createdAt: datetime("created_at").default(new Date()).notNull(),
});

const retroNotes = mysqlTable("retro_notes", {
  id: serial("id").primaryKey(),
  retroId: int("retro_id").notNull(),
  userId: int("user_id").notNull(),
  content: text("content").notNull(), // Left as TEXT for long content
  category: varchar("category", { length: 100 }), // Changed to VARCHAR
  categoryId: int("category_id").notNull(),
  createdAt: datetime("created_at").default(new Date()).notNull(),
});

// Define relations
const userRelations = relations(users, ({ many }) => ({
  retros: many(usersToRetros),
  notes: many(retroNotes),
}));

const retroRelations = relations(retros, ({ many }) => ({
  notes: many(retroNotes),
  users: many(usersToRetros),
}));

const usersToRetrosRelations = relations(usersToRetros, ({ one }) => ({
  retro: one(retros, {
    fields: [usersToRetros.retroId],
    references: [retros.id],
  }),
  user: one(users, {
    fields: [usersToRetros.userId],
    references: [users.id],
  }),
}));

const retroNoteRelations = relations(retroNotes, ({ one }) => ({
  retro: one(retros, {
    fields: [retroNotes.retroId],
    references: [retros.id],
  }),
  user: one(users, {
    fields: [retroNotes.userId],
    references: [users.id],
  }),
}));

// Types
type User = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;
type Retro = typeof retros.$inferSelect;
type NewRetro = typeof retros.$inferInsert;
type UserToRetro = typeof usersToRetros.$inferSelect;
type NewUserToRetro = typeof usersToRetros.$inferInsert;
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
  CardCategory,
  CardCategoryRelations,
  CardWord,
  CardWordRelations,
  retros,
  retroNotes,
  retroRelations,
  retroNoteRelations,
  users,
  usersToRetros,
  usersToRetrosRelations,
  userRelations,
  type NewRetro,
  type NewRetroNote,
  type NewUser,
  type NewUserToRetro,
  type Retro,
  type RetroNote,
  type User,
  type UserToRetro,
};
