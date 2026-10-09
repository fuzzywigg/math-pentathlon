/**
 * Harness filter for known WebKit CSP Report-Only console noise.
 * Must not require changing vite.security-headers.ts / CSP strings.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { isBenignConsoleNoise } from '../e2e/helpers/page';

describe('e2e console noise filter (WebKit CSP)', () => {
  it('filters WebKit Report-Only missing report-to noise', () => {
    const webkitNoise =
      "[Error] The Content Security Policy directive 'Content-Security-Policy-Report-Only' " +
      "contains 'report-only' but does not use a report-to endpoint";
    // Match the phrasing Playwright WebKit typically logs:
    expect(
      isBenignConsoleNoise(
        'The Content Security Policy directive ‘report-only’ requires a report-to'
      )
    ).toBe(true);
    expect(
      isBenignConsoleNoise(
        'Content Security Policy Report-Only header has a report-to problem'
      )
    ).toBe(true);
    expect(isBenignConsoleNoise(webkitNoise)).toBe(true);
  });

  it('does not filter real CSP refusal or app errors', () => {
    expect(
      isBenignConsoleNoise(
        "Refused to execute inline script because it violates Content Security Policy"
      )
    ).toBe(false);
    expect(isBenignConsoleNoise('Uncaught TypeError: boom')).toBe(false);
  });

  it('keeps security header sources unchanged (CSP not weakened)', () => {
    const headers = readFileSync(
      resolve(process.cwd(), 'vite.security-headers.ts'),
      'utf8'
    );
    const core = readFileSync(
      resolve(process.cwd(), 'src/core/security-headers.ts'),
      'utf8'
    );
    expect(core).toContain('CSP_REPORT_ONLY_PRODUCTION');
    expect(core).toContain("default-src 'self'");
    expect(core).not.toContain('report-to');
    expect(headers).toContain('securityHeadersPlugin');
  });
});
