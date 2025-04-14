"use server";
import { createRetro, createRetroNote } from "@/lib/retro";
import { generateRandomSlug } from "@/lib/utils";

type CreateRetroActionParams = {
  title: string;
  description: string;
  date: string;
  createdById: number;
};

async function createRetroAction(params: CreateRetroActionParams) {
  const { title, description, createdById, date } = params;
  const created = await createRetro({
    name: title,
    description,
    createdById: createdById,
    slug: generateRandomSlug(),
    date: new Date(date),
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return created;
}

async function createRetroNoteAction(params: {
  retroId: number;
  content: string;
  userId: number;
  category: string;
}) {
  const { retroId, content, userId, category } = params;
  const created = await createRetroNote({
    retroId,
    content,
    userId,
    category,
    createdAt: new Date(),
    categoryId: 0,
  });
  return created;
}

export { createRetroAction, createRetroNoteAction };
