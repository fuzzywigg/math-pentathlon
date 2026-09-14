/**
 * Wave 58 Contig/SD residual — Sum rolling phase omits playable hand class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderHand } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 58 sum — rolling hand unmarked', () => {
  it('current player hand has no playable class while rolling', () => {
    const state = createInitialState();
    expect(state.phase).toBe('rolling');
    const el = renderHand(state, 'player1', () => undefined);
    expect(el.querySelector('.sd-hand-domino-playable')).toBeNull();
  });
});
