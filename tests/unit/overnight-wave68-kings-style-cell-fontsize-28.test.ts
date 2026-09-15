/**
 * Wave 68 leftover after tip/#336 — Kings .cell font-size 28px. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 kings — style cell fontsize 28', () => {
  it('cell font-size 28px exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.cell\s*\{[^}]*font-size:\s*28px/s);
  });
});
