/**
 * Wave 67 leftover after tip/#324 — Hex-a-Gone block-name/count fonts. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 hexagone — style block name count fonts', () => {
  it('block-name 0.7rem + block-count 0.65rem exact', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.block-name\s*\{[^}]*font-size:\s*0\.7rem/s);
    expect(css).toMatch(/\.block-count\s*\{[^}]*font-size:\s*0\.65rem/s);
  });
});
