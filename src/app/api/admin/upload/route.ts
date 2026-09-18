import { NextResponse, type NextRequest } from 'next/server';
import { getSession } from '@/lib/auth';
import { storeUpload, validateUpload, type UploadKind } from '@/lib/storage';

export const runtime = 'nodejs';

/** POST /api/admin/upload — multipart form with `file` and optional `kind`. */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authorised.' }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Expected a multipart form.' },
      { status: 400 },
    );
  }

  const file = form.get('file');
  const kind = (form.get('kind') === 'file' ? 'file' : 'image') as UploadKind;

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
  }

  const invalid = validateUpload({ type: file.type, size: file.size }, kind);
  if (invalid) return NextResponse.json({ error: invalid }, { status: 400 });

  try {
    const result = await storeUpload(file, kind);
    return NextResponse.json(result);
  } catch (error) {
    console.error('[upload] failed:', error);
    return NextResponse.json(
      { error: 'Upload failed. Check storage configuration.' },
      { status: 500 },
    );
  }
}
