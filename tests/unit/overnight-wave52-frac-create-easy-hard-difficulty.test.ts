/**
 * Overnight HEAVY leftover after #234 — createInitialState easy/hard difficulty field.
 * Wave42 types only asserted medium. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';

describe('Wave 52 frac — createInitialState difficulty', () => {
  it('persists easy and hard on difficulty', () => {
    expect(createInitialState('easy').difficulty).toBe('easy');
    expect(createInitialState('hard').difficulty).toBe('hard');
  });
});
