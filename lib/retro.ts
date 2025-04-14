import { eq } from "drizzle-orm";
import { createDbConnection } from "./database";
import {
  NewRetro,
  NewRetroNote,
  retros,
  retroNotes,
  usersToRetros,
  NewUser,
  users,
  User,
} from "./schema";

const db = await createDbConnection();

async function deleteRetro(id: number) {
  await db.delete(retros).where(eq(retros.id, id));
}

export type UserRetroResponse = {
  retro: NewRetro;
  user: NewUser;
}[];

async function getUserRetros(userId: number): Promise<UserRetroResponse> {
  return await db.query.usersToRetros.findMany({
    where: eq(usersToRetros.userId, userId),
    with: {
      retro: true, // Include full retro data
      user: true, // Include user data if needed
    },
  });
}

async function getUserRetroBySlug(slug: string) {
  const retro = await db.query.retros.findFirst({
    where: eq(retros.slug, slug),
    with: {
      notes: {
        with: {
          user: true, // Include the user who created the note
        },
      },
    },
  });

  if (!retro) {
    throw new Error(`Retro with slug "${slug}" not found`);
  }

  return retro;
}

async function createRetro(retro: NewRetro) {
  const [created] = await db.insert(retros).values(retro).execute();

  // get latest retro for by userId
  const latestRetro = await db.query.retros.findFirst({
    where: eq(retros.createdById, retro.createdById),
    orderBy: (retros, { desc }) => [desc(retros.createdAt)],
  });

  // Create the mapping for the user to the retro
  await db
    .insert(usersToRetros)
    .values({
      userId: retro.createdById,
      retroId: latestRetro!.id,
      role: "owner",
      createdAt: new Date(),
    })
    .execute();

  return latestRetro;
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

async function getUserByEmail(email: string): Promise<NewUser | null> {
  return await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)
    .then((rows) => rows[0] || null);
}

async function createUser(user: NewUser) {
  const [created] = await db.insert(users).values(user).execute();
  return created;
}

async function getRetroById(id: number) {
  return await db.select().from(retros).where(eq(retros.id, id));
}

export {
  getUserRetroBySlug,
  createUser,
  getUserByEmail,
  deleteRetro,
  getUserRetros,
  createRetro,
  updateRetro,
  getRetroById,
  createRetroNote,
};
