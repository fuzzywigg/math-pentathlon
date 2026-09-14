/**
 * Wave 49 — Sum Dominoes selected hand chrome leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderHand } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 49 sum — hand selected class', () => {
  it('adds sd-hand-domino-selected after selectDomino', () => {
    const base = createInitialState();
    const state = {
      ...base,
      phase: 'placing' as const,
      currentDice: [6, 6] as [number, number],
      selectedDomino: base.hands.player1[0]!.id,
    };
    const el = renderHand(state, 'player1', () => undefined);
    expect(el.querySelector('.sd-hand-domino-selected')).toBeTruthy();
  });
});
