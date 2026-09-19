import { NextResponse, type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

/**
 * POST /api/revalidate?path=/blog
 *
 * Manual cache refresh. Authorised either by an admin session (a signed-in
 * editor) or by the REVALIDATE_SECRET, so it can also be called from scripts
 * and deploy hooks.
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  const expected = process.env.REVALIDATE_SECRET;
  const session = await getSession();

  const authorised = Boolean(session) || (expected && secret === expected);
  if (!authorised) {
    return NextResponse.json({ message: 'Not authorised.' }, { status: 401 });
  }

  const path = req.nextUrl.searchParams.get('path');

  try {
    if (path && path.startsWith('/')) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: [path], now: Date.now() });
    }

    const paths = [
      '/',
      '/blog',
      '/residential-projects',
      '/commercial-projects',
    ];
    for (const p of paths) revalidatePath(p);
    return NextResponse.json({ revalidated: paths, now: Date.now() });
  } catch (error) {
    console.error('[revalidate] failed:', error);
    return NextResponse.json(
      { message: 'Error revalidating' },
      { status: 500 },
    );
  }
}
