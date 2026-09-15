/**
 * Wave 68 leftover after tip/#333 — cube gradient url.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style cube gradient url', () => {
  it('cube fills url calla-cube-gradient', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('url(#calla-cube-gradient)');
    expect(css).toMatch(/\.calla-cube\s*\{[^}]*fill:\s*url\(#calla-cube-gradient\)/s);
  });
});
