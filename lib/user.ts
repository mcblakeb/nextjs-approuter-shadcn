'use server';
import { cookies } from 'next/headers';
import { getUserByEmail } from './retro';

async function getUser() {
  const cookieStore = await cookies();
  const dataRaw = await cookieStore.get('sr.userData')?.value;

  if (!dataRaw) {
    return null;
  }

  try {
    const dataParsed = JSON.parse(dataRaw);
    if (!dataParsed.email) {
      return null;
    }
    return await getUserByEmail(dataParsed.email);
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
}

export { getUser };
