'use server';

import { headers } from 'next/headers';
import { prisma, isDatabaseConfigured } from '@/lib/db/client';
import { checkFormRateLimit, clientIpFromHeaders } from '@/lib/auth/form-guard';
import { normaliseAccessCode, type TrackedProject } from '@/lib/track';

export interface TrackState {
  error?: string;
  project?: TrackedProject;
}

/**
 * Looks a project up by access code + last four digits of the client's
 * phone. Rate limited per IP so codes cannot be brute-forced.
 */
export async function lookupProject(
  _prev: TrackState,
  form: FormData,
): Promise<TrackState> {
  const code = normaliseAccessCode(String(form.get('accessCode') ?? ''));
  const last4 = String(form.get('phoneLast4') ?? '').replace(/\D/g, '');

  if (!code || code.length < 6)
    return { error: 'Enter the project code from your welcome message.' };
  if (last4.length !== 4)
    return {
      error: 'Enter the last four digits of your registered phone number.',
    };

  const limited = checkFormRateLimit(clientIpFromHeaders(await headers()));
  if (limited) return { error: limited };
  if (!isDatabaseConfigured)
    return {
      error: 'The tracker is temporarily unavailable. Please call us instead.',
    };

  try {
    const row = await prisma.clientProject.findFirst({
      where: { accessCode: code, phoneLast4: last4 },
      include: { updates: { orderBy: { createdAt: 'desc' } } },
    });
    if (!row)
      return {
        error:
          'We could not find a project with those details. Check the code and phone digits, or call us.',
      };

    return {
      project: {
        clientName: row.clientName,
        title: row.title,
        city: row.city ?? undefined,
        currentStep: row.currentStep,
        status: row.status,
        startDate: row.startDate?.toISOString(),
        expectedHandover: row.expectedHandover?.toISOString(),
        projectManager: row.projectManager ?? undefined,
        notes: row.notes ?? undefined,
        updates: row.updates.map((u) => ({
          id: u.id,
          title: u.title,
          body: u.body ?? undefined,
          imageUrl: u.imageUrl ?? undefined,
          step: u.step ?? undefined,
          createdAt: u.createdAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    console.error('[track] lookup failed:', error);
    return { error: 'Something went wrong. Please try again in a moment.' };
  }
}
