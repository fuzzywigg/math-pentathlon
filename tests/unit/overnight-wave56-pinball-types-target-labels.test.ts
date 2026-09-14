/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball target labels catalog.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';

describe('Wave 56 pinball types — target labels', () => {
  it('labels are 10/20/30/50/100 leftover', () => {
    expect(createInitialState().targets.map((t) => t.label)).toEqual([
      '10',
      '20',
      '30',
      '50',
      '100',
    ]);
  });
});
