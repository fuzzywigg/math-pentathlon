/**
 * Wave 67 leftover after tip/#316 — Calla score pad/bg + strong size.
 * Soft score chrome existed; lock pad/gradient/strong leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style score pad bg strong', () => {
  it('score uses pad/radius/gradient and strong 1.35rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-score\s*\{[^}]*padding:\s*0\.6rem 1\.25rem/s);
    expect(css).toMatch(/\.calla-score\s*\{[^}]*border-radius:\s*10px/s);
    expect(css).toContain('linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)');
    expect(css).toMatch(/\.calla-score strong\s*\{[^}]*font-size:\s*1\.35rem/s);
  });
});
