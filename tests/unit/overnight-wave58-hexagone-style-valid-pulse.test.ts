/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Hex-a-Gone valid pulse CSS.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 58 hexagone — style valid pulse', () => {
  it('pins valid cell stroke and hexValidPulse leftover', () => {
    const css = readFileSync(resolve(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toContain('.hex-a-gone-cell-valid');
    expect(css).toContain('stroke: #4caf50');
    expect(css).toContain('@keyframes hexValidPulse');
  });
});
