/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Hex empty hover + stroke chrome.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 58 hex — style empty hover stroke', () => {
  it('pins empty hover fill and base stroke leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell-empty:hover');
    expect(css).toContain('fill: #e8e8c8');
    expect(css).toContain('stroke: #8b7355');
    expect(css).toContain('@keyframes hexCellPlace');
  });
});
