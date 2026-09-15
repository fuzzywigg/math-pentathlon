/**
 * Wave 67 leftover after tip/#323/#324 — last-move pad + font.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style last-move pad font', () => {
  it('last-move pads and sizes 0.9rem / weight 500', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-last-move\s*\{[^}]*padding:\s*0\.6rem 1\.25rem/s);
    expect(css).toMatch(/\.calla-last-move\s*\{[^}]*font-size:\s*0\.9rem/s);
    expect(css).toMatch(/\.calla-last-move\s*\{[^}]*font-weight:\s*500/s);
  });
});
