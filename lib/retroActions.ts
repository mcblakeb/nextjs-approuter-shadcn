'use server';
import {
  createRetro,
  createRetroNote,
  deleteRetroNote,
  updateRetroNote,
  addRetroNoteLike,
  removeRetroNoteLike,
  getRetroNotes,
} from '@/lib/retro';
import { generateRandomSlug } from '@/lib/utils';

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
  const retroNotes = await getRetroNotes(retroId);
  return retroNotes;
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
  await deleteRetroNote(noteId);
  return noteId;
}

async function updateRetroNoteAction(noteId: number, content: string) {
  await updateRetroNote(noteId, {
    content,
  });
}

type AddRetroNoteLikeActionParams = {
  retroNoteId: number;
  userId: number;
};

async function addRetroNoteLikeAction(params: AddRetroNoteLikeActionParams) {
  const { retroNoteId, userId } = params;
  const result = await addRetroNoteLike({
    retroNoteId,
    userId,
    createdAt: new Date(),
  });

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
  await removeRetroNoteLike(retroNoteId, userId);
  return { retroNoteId, userId };
}

export {
  createRetroAction,
  createRetroNoteAction,
  deleteRetroNoteAction,
  getRetroNotesByIdAction,
  updateRetroNoteAction,
  addRetroNoteLikeAction,
  removeRetroNoteLikeAction,
};
