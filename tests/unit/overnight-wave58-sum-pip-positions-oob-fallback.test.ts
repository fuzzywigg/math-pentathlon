/**
 * Wave 58 Contig/SD residual — Sum pip OOB face yields zero pips. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderHand } from '../../src/games/sum-dominoes/board-ui';
import { createInitialState } from '../../src/games/sum-dominoes/rules';

describe('Wave 58 sum — pip OOB fallback', () => {
  it('face value 7 renders zero pips on hand domino', () => {
    const base = createInitialState();
    const weird = {
      id: 'weird-7',
      face1: 7,
      face2: 7,
      owner: 'player1' as const,
      orientation: 'horizontal' as const,
    };
    const state = {
      ...base,
      hands: { ...base.hands, player1: [weird] },
    };
    const el = renderHand(state, 'player1', () => undefined);
    expect(el.querySelectorAll('.sd-pip').length).toBe(0);
  });
});
