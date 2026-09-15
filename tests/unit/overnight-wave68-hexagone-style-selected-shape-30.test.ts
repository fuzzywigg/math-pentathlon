/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone selected-shape 30px. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 68 hexagone — style selected-shape 30', () => {
  it('selected-shape width/height 30px + font-size 16px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.selected-shape\s*\{[^}]*width:\s*30px/s);
    expect(css).toMatch(/\.selected-shape\s*\{[^}]*height:\s*30px/s);
    expect(css).toMatch(/\.selected-shape\s*\{[^}]*font-size:\s*16px/s);
  });
});
