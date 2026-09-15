/**
 * Wave 68 leftover after tip/#333 — pit-circle gradient url.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style pit gradient url', () => {
  it('pit-circle fills url calla-pit-gradient', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('url(#calla-pit-gradient)');
    expect(css).toMatch(/\.calla-pit-circle\s*\{[^}]*fill:\s*url\(#calla-pit-gradient\)/s);
  });
});
