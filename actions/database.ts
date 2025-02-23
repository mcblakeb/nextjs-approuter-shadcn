"use server";

import { insertCardCategory } from "@/lib/database";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createCategoryAction(prevState: any, formData: FormData) {
  const schema = z.object({
    CategoryName: z.string().nonempty(),
  });

  const data = schema.parse(Object.fromEntries(formData));

  await insertCardCategory(data.CategoryName, "test description");

  revalidatePath("/admin");
  return { message: "Category created" };
}
