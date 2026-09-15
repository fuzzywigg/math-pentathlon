/**
 * Wave 67 leftover after tip/#323/#324 — cube stroke-width 1.5.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style cube sw15', () => {
  it('cube uses stroke-width 1.5', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-cube\s*\{[^}]*stroke-width:\s*1\.5/s);
  });
});
