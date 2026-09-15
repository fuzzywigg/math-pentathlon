/**
 * Wave 66 leftover after tip/#316 — Calla pit-count font/fill chrome.
 * Soft pit count mount existed; lock 18px/#fff leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style pit count chrome', () => {
  it('pit-count uses 18px bold white fill', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-pit-count\s*\{[^}]*font-size:\s*18px/s);
    expect(css).toMatch(/\.calla-pit-count\s*\{[^}]*font-weight:\s*700/s);
    expect(css).toMatch(/\.calla-pit-count\s*\{[^}]*fill:\s*#fff/s);
  });
});
