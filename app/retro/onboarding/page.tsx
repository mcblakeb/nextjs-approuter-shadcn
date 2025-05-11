// app/retro/onboarding/route.ts
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { handleOnboarding } from '@/lib/retroActions';

export default async function Onboarding() {
  const cookieStore = await cookies();
  const dataRaw = await cookieStore.get('sr.userData')?.value;
  const dataParsed = JSON.parse(dataRaw! || '{}');

  const result = await handleOnboarding(dataParsed);
  return redirect(result.redirect);
}
