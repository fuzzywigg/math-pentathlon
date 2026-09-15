/**
 * Wave 65 leftover after tip/#315 — Calla last-move CSS color #c05621.
 * Complements border lock; deepen color leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 calla — style last-move color', () => {
  it('pins calla-last-move color #c05621', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.calla-last-move\s*\{[\s\S]*?color:\s*#c05621/);
  });
});
