/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone block-icon 40px + 18px. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hexagone — style block-icon 40px', () => {
  it('block-icon width/height 40px + font-size 18px', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.block-icon\s*\{[^}]*width:\s*40px/s);
    expect(css).toMatch(/\.block-icon\s*\{[^}]*height:\s*40px/s);
    expect(css).toMatch(/\.block-icon\s*\{[^}]*font-size:\s*18px/s);
  });
});
