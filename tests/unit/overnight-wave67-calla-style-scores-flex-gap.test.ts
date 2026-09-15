/**
 * Wave 67 leftover after tip/#316 — Calla scores flex/gap chrome.
 * Soft scores row existed; lock justify + gap 2rem leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style scores flex gap', () => {
  it('scores row uses flex center and gap 2rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-scores\s*\{[^}]*display:\s*flex/s);
    expect(css).toMatch(/\.calla-scores\s*\{[^}]*justify-content:\s*center/s);
    expect(css).toMatch(/\.calla-scores\s*\{[^}]*gap:\s*2rem/s);
  });
});
