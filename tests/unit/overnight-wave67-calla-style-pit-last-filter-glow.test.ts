/**
 * Wave 67 leftover after tip/#316 — Calla last-pit orange glow filter.
 * Wave66 locked #ed8936 stroke; lock drop-shadow leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 calla — style pit last filter glow', () => {
  it('last pit uses orange drop-shadow filter', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('drop-shadow(0 0 6px rgba(237, 137, 54, 0.5))');
  });
});
