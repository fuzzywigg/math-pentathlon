/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball target-4 id for 100pts.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';

describe('Wave 56 pinball types — target-4 id', () => {
  it('last target is target-4 with value 100 leftover', () => {
    const t = createInitialState().targets[4];
    expect(t.id).toBe('target-4');
    expect(t.value).toBe(100);
  });
});
