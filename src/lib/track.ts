import { PROCESS_STEPS } from '@/lib/seo/process';

/** The six client-facing milestones, shared by the tracker and the admin. */
export const TRACK_STEPS = PROCESS_STEPS.map((s, i) => ({
  step: i + 1,
  name: s.name,
  text: s.text,
}));

export const PROJECT_STATUSES = [
  { key: 'active', label: 'In progress' },
  { key: 'on-hold', label: 'On hold' },
  { key: 'completed', label: 'Completed' },
] as const;

export function statusLabel(key: string): string {
  return PROJECT_STATUSES.find((s) => s.key === key)?.label ?? key;
}

/** Normalises what a client types: "ss 4k7q2m" → "SS-4K7Q2M". */
export function normaliseAccessCode(input: string): string {
  const raw = input.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (!raw) return '';
  const body = raw.startsWith('SS') ? raw.slice(2) : raw;
  return `SS-${body}`;
}

export interface TrackedUpdate {
  id: string;
  title: string;
  body?: string;
  imageUrl?: string;
  step?: number;
  createdAt: string;
}

export interface TrackedProject {
  clientName: string;
  title: string;
  city?: string;
  currentStep: number;
  status: string;
  startDate?: string;
  expectedHandover?: string;
  projectManager?: string;
  notes?: string;
  updates: TrackedUpdate[];
}
