/**
 * Wave 67 leftover after tip/#323/#324 — valid hover animation none.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style pit hover anim none', () => {
  it('valid hover disables pulse animation', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-pit-valid:hover \.calla-pit-circle\s*\{[^}]*animation:\s*none/s);
  });
});
