import { NextResponse } from 'next/server';
import { getUserRetroBySlug } from '@/lib/retro';
import { getServerSession } from 'next-auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getServerSession();
  // TODO: security here!
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const retro = await getUserRetroBySlug(slug);
    return NextResponse.json(retro);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch retro' },
      { status: 500 }
    );
  }
}
