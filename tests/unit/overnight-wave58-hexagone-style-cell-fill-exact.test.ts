/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Hex-a-Gone empty cell fill.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 58 hexagone — style cell fill', () => {
  it('pins empty cell fill #f0f0f0 leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-cell');
    expect(css).toContain('fill: #f0f0f0');
    expect(css).toContain('stroke: #bbb');
  });
});
