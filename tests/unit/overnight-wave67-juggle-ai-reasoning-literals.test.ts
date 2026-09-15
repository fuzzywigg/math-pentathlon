/**
 * Wave 67 leftover after tip/#316 — Juggle AI private reasoning literals.
 * Calla analyzeMoves exact-locked; Juggle private reasons never hit on alpha. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Wave 67 juggle — AI reasoning literals', () => {
  it('pins private reason string leftovers in ai.ts', () => {
    const src = readFileSync(
      resolve(process.cwd(), 'src/games/juggle/ai.ts'),
      'utf8'
    );
    expect(src).toContain('Larger shape fills board faster');
    expect(src).toContain('No valid placements available');
    expect(src).toContain('Shape might be too big for remaining space');
    expect(src).toContain('Creates isolated holes');
    expect(src).toContain('Fills a corner');
    expect(src).toContain('Good position near existing pieces');
    expect(src).toContain('Standard choice');
    expect(src).toContain('Valid placement');
  });
});
