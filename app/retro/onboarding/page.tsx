// app/retro/onboarding/route.ts
import { createDbConnection } from "@/lib/database";
import { redirect } from "next/navigation";
import { NewUser } from "@/lib/schema";
import {
  createRetro,
  createRetroNote,
  createUser,
  getUserByEmail,
  getUserRetroBySlug,
} from "@/lib/retro";
import { generateRandomSlug } from "@/lib/utils";
import { cookies } from "next/headers";

export default async function Onboarding() {
  const cookieStore = await cookies();
  const dataRaw = await cookieStore.get("sr.userData")?.value;
  const dataParsed = JSON.parse(dataRaw! || "{}");
  const db = await createDbConnection();

  // Get a user
  let user = await getUserByEmail(dataParsed.email!);

  if (!user) {
    // Create a new user if it doesn't exist
    await createUser({
      name: dataParsed.name,
      email: dataParsed.email,
      image: dataParsed.image,
      googleId: dataParsed.id,
    } as NewUser);
    user = await getUserByEmail(dataParsed.email!);
  }

  // Check if user has any retros
  const userRetros = await db.query.usersToRetros.findMany({
    where: (usersToRetros, { eq }) => eq(usersToRetros.userId, user!.id!),
  });

  if (userRetros.length > 0) {
    // Redirect to most recent retro
    const mostRecent = await db.query.retros.findFirst({
      where: (retros, { inArray }) =>
        inArray(
          retros.id,
          userRetros.map((r) => r.retroId)
        ),
      orderBy: (retros, { desc }) => [desc(retros.createdAt)],
    });
    return redirect(`/retro/${mostRecent?.slug}`);
  }

  const newRetro = {
    name: "Welcome to SuperRetro",
    slug: generateRandomSlug(),
    date: new Date(),
  };

  var slug = generateRandomSlug();
  const retro = await createRetro({
    name: newRetro.name,
    slug: slug,
    date: newRetro.date,
    createdById: user!.id!,
  });

  // Add tutorial items
  const tutorialNotes = [
    { content: "Things that went well this sprint", categoryId: 0 },
    { content: "Areas we could improve", categoryId: 1 },
    { content: "Specific action items to implement", categoryId: 2 },
  ];

  for (const item of tutorialNotes) {
    await createRetroNote({
      retroId: retro!.id!,
      userId: user!.id!,
      content: item.content,
      categoryId: item.categoryId,
    });
  }

  return redirect(`/retro/${retro!.slug}`);
}
