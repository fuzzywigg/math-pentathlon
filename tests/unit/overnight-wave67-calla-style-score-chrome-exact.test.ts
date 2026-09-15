/**
 * Wave 67 leftover after tip/#323/#324 — score pad/radius/gradient/size.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style score chrome exact', () => {
  it('score uses pad radius #f7fafc gradient and 1.1rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-score\s*\{[^}]*padding:\s*0\.6rem 1\.25rem/s);
    expect(css).toMatch(/\.calla-score\s*\{[^}]*border-radius:\s*10px/s);
    expect(css).toContain('linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)');
    expect(css).toMatch(/\.calla-score\s*\{[^}]*font-size:\s*1\.1rem/s);
  });
});
