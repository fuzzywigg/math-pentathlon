/**
 * Wave 58 leftover after #267 — Prime valid-placement aria after dice.
 * Distinct from wave50 valid class leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderBoard } from '../../src/games/prime-gold/board-ui';

describe('Wave 58 prime — valid placement aria', () => {
  it('valid cell aria ends with valid placement', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      diceRoll: { die1: 2, die2: 3, die3: 5 },
    };
    const el = renderBoard(state, () => undefined);
    const valid = el.querySelector('.pg-cell.valid')!;
    expect(valid).toBeTruthy();
    expect(valid.getAttribute('aria-label') ?? '').toMatch(/valid placement$/);
  });
});
