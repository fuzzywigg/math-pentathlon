/**
 * Wave 66 leftover after tip/#316 — Calla store-count/label font chrome.
 * Soft store labels existed; lock 28px/#ffd700 + 16px leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 66 calla — style store count label', () => {
  it('store-count 28px #ffd700 and label 16px/500', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-store-count\s*\{[^}]*font-size:\s*28px/s);
    expect(css).toMatch(/\.calla-store-count\s*\{[^}]*fill:\s*#ffd700/s);
    expect(css).toMatch(/\.calla-store-label\s*\{[^}]*font-size:\s*16px/s);
    expect(css).toMatch(/\.calla-store-label\s*\{[^}]*font-weight:\s*500/s);
  });
});
