/**
 * Wave 67 leftover after tip/#323/#324 — store-active stroke-width 4.
 * Soft mount existed; lock CSS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style store-active sw4', () => {
  it('active store uses stroke-width 4', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-store-active \.calla-store-rect\s*\{[^}]*stroke-width:\s*4/s);
  });
});
