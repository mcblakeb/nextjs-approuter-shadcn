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
  RetroNote,
  UserToRetro,
  Retro,
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

async function addUserToRetro(
  userId: number,
  retroId: number,
  role: string = "member"
): Promise<void> {
  // prevent adding the same user to the same retro multiple times
  const existingUser = await db.query.usersToRetros.findFirst({
    where: (usersToRetros, { eq }) =>
      eq(usersToRetros.userId, userId) && eq(usersToRetros.retroId, retroId),
  });
  if (existingUser) {
    return;
  }

  await db.insert(usersToRetros).values({
    userId,
    retroId,
    role: role as "owner" | "member",
    createdAt: new Date(),
  });
}

async function getLatestUserRetro(
  userId: number
): Promise<NewRetro | undefined> {
  const latestRetro = await db.query.retros.findFirst({
    where: eq(retros.createdById, userId),
    orderBy: (retros, { desc }) => [desc(retros.createdAt)],
  });

  return latestRetro;
}
export type RetroSlugResponse = {
  retro: NewRetro;
  users: UserToRetro[];
  notes: RetroNote[];
};
async function getUserRetroBySlug(slug: string): Promise<RetroSlugResponse> {
  const retro = await db.query.retros.findFirst({
    where: eq(retros.slug, slug),
    with: {
      notes: {
        with: {
          user: true, // Include the user who created the note
        },
      },
      users: true, // Include the users associated with the retro
    },
  });

  if (!retro) {
    throw new Error(`Retro with slug "${slug}" not found`);
  }

  return {
    retro,
    users: retro.users,
    notes: retro.notes,
  };
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

async function deleteRetroNote(id: number) {
  await db.delete(retroNotes).where(eq(retroNotes.id, id));
}

async function createRetroNote(retroNote: NewRetroNote) {
  const [created] = await db.insert(retroNotes).values(retroNote).execute();

  // Update last update on the retro
  await db
    .update(retros)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(retros.id, retroNote.retroId))
    .execute();

  return created;
}

async function updateRetroNote(id: number, updates: Partial<NewRetroNote>) {
  const [updated] = await db
    .update(retroNotes)
    .set(updates)
    .where(eq(retroNotes.id, id))
    .execute();
  return updated;
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
  user.guid = crypto.randomUUID();
  const [created] = await db.insert(users).values(user).execute();
  return created;
}

async function getRetroById(id: number) {
  return await db.select().from(retros).where(eq(retros.id, id));
}

export {
  addUserToRetro,
  createRetro,
  createRetroNote,
  createUser,
  deleteRetro,
  deleteRetroNote,
  getLatestUserRetro,
  getRetroById,
  getUserByEmail,
  getUserRetroBySlug,
  getUserRetros,
  updateRetro,
  updateRetroNote,
};
