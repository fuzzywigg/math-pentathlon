/**
 * Wave 65 leftover after tip/#313 — Hex-a-Gone .hex-a-gone-status block. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 hexagone — style status block', () => {
  it('hex-a-gone-status rule present', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-status {');
  });
});
