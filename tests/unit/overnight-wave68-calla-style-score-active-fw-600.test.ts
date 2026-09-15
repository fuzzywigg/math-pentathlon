/**
 * Wave 68 leftover after tip/#333 — score.active font-weight 600.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 calla — style score active fw 600', () => {
  it('active score uses font-weight 600', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-score\.active\s*\{[^}]*font-weight:\s*600/s);
  });
});
