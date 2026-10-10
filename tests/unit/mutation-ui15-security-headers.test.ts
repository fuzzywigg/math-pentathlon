/**
 * q-mp-457 mutation audit UI wave 15 — structural re-pins for
 * security-headers (first-window already 100% at tip baseline).
 * Tests only; does not change any security header or CSP value in src.
 */
import { describe, expect, it } from 'vitest';
import {
  CSP_REPORT_ONLY_DEV,
  CSP_REPORT_ONLY_PRODUCTION,
  SECURITY_HEADERS,
  securityHeadersForEnv,
} from '../../src/core/security-headers';

describe('mutation-ui15 security-headers', () => {
  it('mode === development selects DEV CSP (kills L52 === → !==)', () => {
    const dev = securityHeadersForEnv('development');
    const prod = securityHeadersForEnv('production');
    const other = securityHeadersForEnv('preview');
    expect(dev['Content-Security-Policy-Report-Only']).toBe(
      CSP_REPORT_ONLY_DEV
    );
    expect(prod['Content-Security-Policy-Report-Only']).toBe(
      CSP_REPORT_ONLY_PRODUCTION
    );
    // Non-development modes keep production CSP (!== would break this).
    expect(other['Content-Security-Policy-Report-Only']).toBe(
      CSP_REPORT_ONLY_PRODUCTION
    );
    expect(dev['Content-Security-Policy-Report-Only']).not.toBe(
      prod['Content-Security-Policy-Report-Only']
    );
  });

  it('companion header keys stay exactly four fixed names', () => {
    expect(Object.keys(SECURITY_HEADERS).sort()).toEqual(
      [
        'Permissions-Policy',
        'Referrer-Policy',
        'X-Content-Type-Options',
        'X-Frame-Options',
      ].sort()
    );
    const merged = securityHeadersForEnv('production');
    expect(merged['X-Content-Type-Options']).toBe(
      SECURITY_HEADERS['X-Content-Type-Options']
    );
    expect(merged['X-Frame-Options']).toBe(SECURITY_HEADERS['X-Frame-Options']);
    expect(merged['Referrer-Policy']).toBe(SECURITY_HEADERS['Referrer-Policy']);
    expect(merged['Permissions-Policy']).toBe(
      SECURITY_HEADERS['Permissions-Policy']
    );
  });

  it('dev vs production CSP differ on eval and websocket connect only', () => {
    // Structural posture pins (no src edits): production must not allow
    // classic unsafe-eval (wasm-unsafe-eval is fine); development must for HMR.
    expect(CSP_REPORT_ONLY_PRODUCTION).not.toMatch(/(^|[^-])unsafe-eval/);
    expect(CSP_REPORT_ONLY_DEV.includes("'unsafe-eval'")).toBe(true);
    expect(CSP_REPORT_ONLY_DEV.includes('ws:')).toBe(true);
    expect(CSP_REPORT_ONLY_PRODUCTION.includes('ws:')).toBe(false);
    expect(CSP_REPORT_ONLY_PRODUCTION.includes("frame-ancestors 'none'")).toBe(
      true
    );
    expect(CSP_REPORT_ONLY_DEV.includes("frame-ancestors 'none'")).toBe(true);
  });
});
