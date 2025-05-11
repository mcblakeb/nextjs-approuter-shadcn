'use server';
import {
  createRetro,
  createRetroNote,
  deleteRetroNote,
  updateRetroNote,
  addRetroNoteLike,
  removeRetroNoteLike,
  getRetroNotes,
  getUserByEmail,
  createUser,
} from '@/lib/retro';
import { generateRandomSlug } from '@/lib/utils';
import { NewUser } from '@/lib/schema';
import { createDbConnection } from './database';

type CreateRetroActionParams = {
  title: string;
  description: string;
  date: string;
  createdById: number;
  guid: string;
};

async function createRetroAction(params: CreateRetroActionParams) {
  const { title, description, createdById, date, guid } = params;
  const created = await createRetro({
    name: title,
    description,
    createdById: createdById,
    slug: generateRandomSlug(),
    date: new Date(date),
    createdAt: new Date(),
    updatedAt: new Date(),
    guid,
  });
  return created;
}

async function getRetroNotesByIdAction(retroId: number) {
  const db = await createDbConnection();
  const retroNotes = await getRetroNotes(retroId, db);

  // Serialize dates to ISO strings
  return retroNotes.map((note) => ({
    ...note,
    createdAt: note.createdAt.toISOString(),
  }));
}

type CreateRetroNoteActionParams = {
  retroId: number;
  content: string;
  userId: number;
  category: string;
  categoryId: number;
  guid: string;
};

async function createRetroNoteAction(params: CreateRetroNoteActionParams) {
  const { retroId, content, userId, category, categoryId, guid } = params;
  const result = await createRetroNote({
    retroId,
    content,
    userId,
    category,
    createdAt: new Date(),
    categoryId: categoryId,
    guid,
  });

  // Return the insertId from the ResultSetHeader
  return result.insertId;
}

async function deleteRetroNoteAction(noteId: number) {
  // TODO: Need to verify user is logged in here etc
  const db = await createDbConnection();
  await deleteRetroNote(noteId, db);
  return noteId;
}

async function updateRetroNoteAction(noteId: number, content: string) {
  const db = await createDbConnection();
  await updateRetroNote(
    noteId,
    {
      content,
    },
    db
  );
}

type AddRetroNoteLikeActionParams = {
  retroNoteId: number;
  userId: number;
};

async function addRetroNoteLikeAction(params: AddRetroNoteLikeActionParams) {
  const { retroNoteId, userId } = params;
  const db = await createDbConnection();
  const result = await addRetroNoteLike(
    {
      retroNoteId,
      userId,
      createdAt: new Date(),
    },
    db
  );

  // Return a plain object without the Date
  if ('id' in result) {
    return {
      id: result.id,
      retroNoteId: result.retroNoteId,
      userId: result.userId,
    };
  }

  // If we get a ResultSetHeader, return the input params
  return {
    id: 0, // This will be replaced by the actual ID in the database
    retroNoteId,
    userId,
  };
}

type RemoveRetroNoteLikeActionParams = {
  retroNoteId: number;
  userId: number;
};

async function removeRetroNoteLikeAction(
  params: RemoveRetroNoteLikeActionParams
) {
  const { retroNoteId, userId } = params;
  const db = await createDbConnection();
  await removeRetroNoteLike(retroNoteId, userId, db);
  return { retroNoteId, userId };
}

async function handleOnboarding(userData: any) {
  const db = await createDbConnection();

  // Get a user
  let user = await getUserByEmail(userData.email, db);

  if (!user) {
    // Create a new user if it doesn't exist
    await createUser(
      {
        name: userData.name,
        email: userData.email,
        image: userData.image,
        googleId: userData.id,
      } as NewUser,
      db
    );
    user = await getUserByEmail(userData.email, db);
  }

  // Check if user has any retros
  const userRetros = await db.query.usersToRetros.findMany({
    where: (usersToRetros, { eq }) => eq(usersToRetros.userId, user!.id!),
  });

  if (userRetros.length > 0) {
    // Get most recent retro
    const mostRecent = await db.query.retros.findFirst({
      where: (retros, { inArray }) =>
        inArray(
          retros.id,
          userRetros.map((r) => r.retroId)
        ),
      orderBy: (retros, { desc }) => [desc(retros.createdAt)],
    });
    return { redirect: `/retro/${mostRecent?.slug}` };
  }

  // Create new retro
  const slug = generateRandomSlug();
  const retro = await createRetro(
    {
      name: 'Welcome to SuperRetro',
      slug: slug,
      date: new Date(),
      createdById: user!.id!,
      guid: crypto.randomUUID(),
    },
    db
  );

  // Add tutorial items
  const tutorialNotes = [
    { content: 'Things that went well this sprint', categoryId: 0 },
    { content: 'Areas we could improve', categoryId: 1 },
    { content: 'Specific action items to implement', categoryId: 2 },
  ];

  for (const item of tutorialNotes) {
    await createRetroNote(
      {
        retroId: retro!.id!,
        userId: user!.id!,
        content: item.content,
        categoryId: item.categoryId,
        guid: crypto.randomUUID(),
      },
      db
    );
  }

  return { redirect: `/retro/${retro!.slug}` };
}

export {
  createRetroAction,
  createRetroNoteAction,
  deleteRetroNoteAction,
  getRetroNotesByIdAction,
  updateRetroNoteAction,
  addRetroNoteLikeAction,
  removeRetroNoteLikeAction,
  handleOnboarding,
};
