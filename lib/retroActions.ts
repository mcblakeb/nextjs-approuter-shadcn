"use server";
import {
  createRetro,
  createRetroNote,
  deleteRetroNote,
  updateRetroNote,
} from "@/lib/retro";
import { generateRandomSlug } from "@/lib/utils";

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
    guid
  });
  return created;
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
  await createRetroNote({
    retroId,
    content,
    userId,
    category,
    createdAt: new Date(),
    categoryId: categoryId,
    guid
  });
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

export {
  createRetroAction,
  createRetroNoteAction,
  deleteRetroNoteAction,
  updateRetroNoteAction,
};
