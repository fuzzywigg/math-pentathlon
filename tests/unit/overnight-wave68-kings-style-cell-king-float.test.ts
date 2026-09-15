/**
 * Wave 68 leftover after tip/#336 — Kings cell-king float anim exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 kings — style cell-king float', () => {
  it('cell-king font-size 32px + kingFloat 3s', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.cell-king\s*\{[^}]*font-size:\s*32px/s);
    expect(css).toContain('animation: kingFloat 3s ease-in-out infinite');
    expect(css).toContain('transform: translateY(-2px)');
  });
});
