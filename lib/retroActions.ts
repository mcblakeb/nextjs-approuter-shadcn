'use server';
import { createRetro, createRetroNote } from '@/lib/retro';
import { generateRandomSlug } from '@/lib/utils';

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

type CreateRetroNoteActionParams = {
  retroId: number;
  content: string;
  userId: number;
  category: string;
  categoryId: number;
};

async function createRetroNoteAction(params: CreateRetroNoteActionParams) {
  const { retroId, content, userId, category, categoryId } = params;
  const created = await createRetroNote({
    retroId,
    content,
    userId,
    category,
    createdAt: new Date(),
    categoryId: categoryId,
  });

  return created;
}

export { createRetroAction, createRetroNoteAction };
