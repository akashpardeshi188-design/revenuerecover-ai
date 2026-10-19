import { LoginForm } from './LoginForm';

type LoginPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const code = Array.isArray(params.error) ? params.error[0] : params.error;
  const initialError = code === 'auth_config'
    ? 'Authentication is not configured yet. Please contact support.'
    : code === 'callback'
      ? 'The confirmation link is invalid or expired. Request a new one.'
      : code === 'profile_pending'
        ? 'Your account profile is still being created. Please try signing in again shortly.'
        : '';

  return <LoginForm initialError={initialError} />;
}
