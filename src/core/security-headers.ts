/**
 * Shared security header values for Cloudflare Pages (`public/_headers`)
 * and the Vite dev/preview plugin (so Chromium e2e sees the same posture).
 *
 * CSP starts in Report-Only so we can measure violations without breaking play.
 */

/** Production / preview CSP (no Vite HMR). */
export const CSP_REPORT_ONLY_PRODUCTION = [
  "default-src 'self'",
  "script-src 'self' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

/**
 * Dev-server CSP: Vite HMR needs `unsafe-eval` + websocket connect.
 * Still Report-Only; production `_headers` stays tighter.
 */
export const CSP_REPORT_ONLY_DEV = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' ws: wss:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

export const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-Frame-Options': 'DENY',
};

export function securityHeadersForEnv(
  mode: 'development' | 'production' | string
): Record<string, string> {
  const csp =
    mode === 'development'
      ? CSP_REPORT_ONLY_DEV
      : CSP_REPORT_ONLY_PRODUCTION;
  return {
    ...SECURITY_HEADERS,
    'Content-Security-Policy-Report-Only': csp,
  };
}
