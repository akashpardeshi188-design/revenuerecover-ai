/**
 * Return a same-app email confirmation landing URL for the current environment.
 * Preview always targets the specific Vercel deployment, never a Production URL.
 */
export function getAuthConfirmationRedirectTo(): string | null {
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    const host = process.env.VERCEL_URL;
    if (/^[a-z0-9.-]+$/i.test(host) && !host.includes('..')) {
      return `https://${host}/auth/confirmed`;
    }
  }

  const configuredBase = process.env.APP_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredBase) {
    try {
      const url = new URL(configuredBase);
      const localDevelopmentHost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
      if (
        url.protocol === 'https:' ||
        (process.env.NODE_ENV !== 'production' && url.protocol === 'http:' && localDevelopmentHost)
      ) {
        return new URL('/auth/confirmed', url.origin).toString();
      }
    } catch {
      // Ignore an invalid optional URL and use the environment-safe fallback below.
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000/auth/confirmed';
  }
  return null;
}
