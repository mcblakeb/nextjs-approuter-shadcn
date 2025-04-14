import { getLatestUserRetro, getUserByEmail, getUserRetros } from '@/lib/retro';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/user';

export default async function Retro() {
  const user = await getUser();
  if (!user) {
    redirect('/auth/signin');
  }
  const latest = await getLatestUserRetro(user!.id!);

  // redirect to slug page if latest retro exists
  if (latest) {
    redirect(`/retro/${latest.slug}`);
  }

  // Add create retro logic here as a fallback
  // For now, just redirect to the retros page
  redirect('/retro/onboarding');
}
