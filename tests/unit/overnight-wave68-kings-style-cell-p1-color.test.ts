/**
 * Wave 68 leftover after tip/#336 — Kings cell-p1 color exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 kings — style cell-p1 color', () => {
  it('cell-p1 color 1e88e5 + drop-shadow', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.cell-p1\s*\{[^}]*color:\s*#1e88e5/s);
    expect(css).toContain('drop-shadow(0 2px 3px rgba(30, 136, 229, 0.4))');
  });
});
