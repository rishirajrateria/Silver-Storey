import type { Metadata } from 'next';
import LoginForm from './LoginForm';
import { isAdminConfigured } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Sign in | Silver Storey CMS',
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <LoginForm next={next} configured={isAdminConfigured()} />;
}
