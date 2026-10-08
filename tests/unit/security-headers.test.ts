import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  CSP_REPORT_ONLY_DEV,
  CSP_REPORT_ONLY_PRODUCTION,
  SECURITY_HEADERS,
  securityHeadersForEnv,
} from '../../src/core/security-headers';

describe('security headers (burn-1008)', () => {
  it('production CSP is Report-Only friendly and blocks framing', () => {
    expect(CSP_REPORT_ONLY_PRODUCTION).toContain("default-src 'self'");
    expect(CSP_REPORT_ONLY_PRODUCTION).toContain("frame-ancestors 'none'");
    expect(CSP_REPORT_ONLY_PRODUCTION).toContain("object-src 'none'");
    expect(CSP_REPORT_ONLY_PRODUCTION).toContain("worker-src 'self' blob:");
    // Prefer not to allow classic `unsafe-eval` (wasm-unsafe-eval is fine).
    expect(CSP_REPORT_ONLY_PRODUCTION).not.toMatch(/(^|[^-])unsafe-eval/);
  });

  it('dev CSP allows Vite HMR eval + websockets', () => {
    expect(CSP_REPORT_ONLY_DEV).toContain('unsafe-eval');
    expect(CSP_REPORT_ONLY_DEV).toContain('ws:');
  });

  it('companion headers match hosting expectations', () => {
    expect(SECURITY_HEADERS['X-Content-Type-Options']).toBe('nosniff');
    expect(SECURITY_HEADERS['Referrer-Policy']).toBe(
      'strict-origin-when-cross-origin'
    );
    expect(SECURITY_HEADERS['Permissions-Policy']).toMatch(/camera=\(\)/);
    expect(SECURITY_HEADERS['X-Frame-Options']).toBe('DENY');
  });

  it('public/_headers ships Report-Only CSP + companions', () => {
    const text = readFileSync(resolve('public/_headers'), 'utf8');
    expect(text).toMatch(/Content-Security-Policy-Report-Only:/);
    expect(text).toMatch(/frame-ancestors 'none'/);
    expect(text).toMatch(/X-Content-Type-Options: nosniff/);
    expect(text).toMatch(/Referrer-Policy: strict-origin-when-cross-origin/);
    expect(text).toMatch(/Permissions-Policy:/);
  });

  it('securityHeadersForEnv selects the right CSP', () => {
    expect(
      securityHeadersForEnv('development')[
        'Content-Security-Policy-Report-Only'
      ]
    ).toBe(CSP_REPORT_ONLY_DEV);
    expect(
      securityHeadersForEnv('production')[
        'Content-Security-Policy-Report-Only'
      ]
    ).toBe(CSP_REPORT_ONLY_PRODUCTION);
  });
});
