import { getUser } from '@/lib/user';
import { getUserRetroBySlug, getUserRetros, addUserToRetro } from '@/lib/retro';
import { redirect } from 'next/navigation';
import { RetroPageWrapper } from './retro-page-wrapper';
import { createDbConnection } from '@/lib/database';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) {
    throw new Error('Slug is required');
  }

  const user = await getUser();
  if (!user) {
    redirect('/auth/signin');
  }

  const db = await createDbConnection();
  const currentRetro = await getUserRetroBySlug(slug, db);
  const allRetros = await getUserRetros(user!.id!, db);

  // Add user to retro if they're not already a member
  const isMember = currentRetro.users.some((u) => u.userId === user!.id!);
  if (!isMember) {
    await addUserToRetro(user!.id!, currentRetro.retro.id!, 'member', db);
  }

  return (
    <RetroPageWrapper
      initialRetro={currentRetro}
      allRetros={allRetros}
      user={user}
    />
  );
}
