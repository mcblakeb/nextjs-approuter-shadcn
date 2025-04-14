import { eq } from "drizzle-orm";
import { createDbConnection } from "./database";
import { NewRetro, NewRetroNote, retros, retroNotes } from "./schema";

const db = await createDbConnection();

async function deleteRetro(id: number) {
  await db.delete(retros).where(eq(retros.id, id));
}
async function getAllRetros() {
  return await db.select().from(retros);
}

async function createRetro(retro: NewRetro) {
  const [created] = await db.insert(retros).values(retro).execute();
  return created;
}

async function updateRetro(id: number, updates: Partial<NewRetro>) {
  const [updated] = await db
    .update(retros)
    .set(updates)
    .where(eq(retros.id, id))
    .execute();
  return updated;
}

async function createRetroNote(retroNote: NewRetroNote) {
  const [created] = await db.insert(retroNotes).values(retroNote).execute();
  return created;
}

async function getRetroById(id: number) {
  return await db.select().from(retros).where(eq(retros.id, id));
}

export {
  deleteRetro,
  getAllRetros,
  createRetro,
  updateRetro,
  getRetroById,
  createRetroNote,
};
