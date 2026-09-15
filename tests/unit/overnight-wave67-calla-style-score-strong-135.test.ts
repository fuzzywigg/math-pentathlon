/**
 * Wave 67 leftover after tip/#323/#324 — score strong 1.35rem.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style score strong 135', () => {
  it('score strong uses font-size 1.35rem', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-score strong\s*\{[^}]*font-size:\s*1\.35rem/s);
  });
});
