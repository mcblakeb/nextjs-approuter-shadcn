"use server";
import { createRetro, createRetroNote } from "@/lib/retro";
import { generateRandomSlug } from "@/lib/utils";

type CreateRetroActionParams = {
  title: string;
  description: string;
  email: string;
  date: string;
};

async function createRetroAction(params: CreateRetroActionParams) {
  const { title, description, email, date } = params;
  const created = await createRetro({
    name: title,
    description,
    email: email,
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
  createdByName: string;
  createdByEmail: string;
  category: string;
}) {
  const { retroId, content, createdByName, createdByEmail, category } = params;
  const created = await createRetroNote({
    retroId,
    content,
    createdByName,
    createdByEmail,
    category,
    createdAt: new Date(),
    categoryId: 0,
  });
  return created;
}

export { createRetroAction, createRetroNoteAction };
