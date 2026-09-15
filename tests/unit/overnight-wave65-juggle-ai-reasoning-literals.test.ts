/**
 * Wave 65 leftover after tip/#315 — Juggle AI private reasoning literals.
 * Calla analyzeMoves exact-locked; Juggle private reasons never hit. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 65 juggle — AI reasoning literals', () => {
  it('pins private reason string leftovers in ai.ts', () => {
    const src = readFileSync(
      resolve(process.cwd(), 'src/games/juggle/ai.ts'),
      'utf8'
    );
    expect(src).toContain('Larger shape fills board faster');
    expect(src).toContain('No valid placements available');
    expect(src).toContain('Standard choice');
    expect(src).toContain('Valid placement');
    expect(src).toContain('Fills a corner');
    expect(src).toContain('Good position near existing pieces');
  });
});
