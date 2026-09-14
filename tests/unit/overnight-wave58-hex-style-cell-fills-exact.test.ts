/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Hex cell fill chrome in style.css.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 58 hex — style cell fills', () => {
  it('pins empty/p1/p2 cell fill leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell');
    expect(css).toContain('fill: #f5f5dc');
    expect(css).toContain('.hex-cell-p1');
    expect(css).toContain('fill: #42a5f5');
    expect(css).toContain('.hex-cell-p2');
    expect(css).toContain('fill: #ef5350');
  });
});
