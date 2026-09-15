/**
 * Wave 67 leftover after tip/#323/#324 — arrow stroke-width + fill none.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style arrow sw fill', () => {
  it('arrow uses stroke-width 2.5 and fill none', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-arrow\s*\{[^}]*stroke-width:\s*2\.5/s);
    expect(css).toMatch(/\.calla-arrow\s*\{[^}]*fill:\s*none/s);
  });
});
