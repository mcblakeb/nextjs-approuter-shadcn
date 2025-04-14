import { RetroList } from '@/components/ui/retro-list';
import Topbar from '@/components/ui/topbar';
import { AddRetroColumn } from '@/components/ui/retro-column';
import { getLatestUserRetro, getUserByEmail, getUserRetros } from '@/lib/retro';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Retro() {
  const cookieStore = await cookies();
  const dataRaw = await cookieStore.get('sr.userData')?.value;
  const dataParsed = JSON.parse(dataRaw! || '{}');
  const user = await getUserByEmail(dataParsed.email!);
  const latest = await getLatestUserRetro(user!.id!);

  // redirect to slug page if latest retro exists
  if (latest) {
    redirect(`/retro/${latest.slug}`);
  }

  // Add create retro logic here as a fallback
  // For now, just redirect to the retros page
  redirect('/retro/onboarding');
}
