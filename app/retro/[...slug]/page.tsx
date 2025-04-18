import { getUser } from '@/lib/user';
import { getUserRetroBySlug, getUserRetros, addUserToRetro } from '@/lib/retro';
import { redirect } from 'next/navigation';
import { RetroPageWrapper } from './retro-page-wrapper';

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

  const currentRetro = await getUserRetroBySlug(slug);
  const allRetros = await getUserRetros(user!.id!);

  if (!currentRetro.users.some((u) => u.id === user.id)) {
    await addUserToRetro(user.id!, currentRetro.retro.id!);
  }


  return (
    <RetroPageWrapper
      initialRetro={currentRetro}
      allRetros={allRetros}
      user={user}
      slug={slug}
    />
  );
}