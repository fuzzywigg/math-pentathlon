/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Hex last-move + win pulse CSS.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 58 hex — style last-move win pulse', () => {
  it('pins last-move stroke and hexWinPulse leftovers', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-cell-last-move');
    expect(css).toContain('stroke: #ff9800');
    expect(css).toContain('@keyframes hexWinPulse');
    expect(css).toContain('.hex-cell-winning');
    expect(css).toContain('stroke: #ffd700');
  });
});
