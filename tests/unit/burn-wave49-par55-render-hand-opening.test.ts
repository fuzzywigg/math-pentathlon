/**
 * Wave 49 leftover after #221/#226/#227 — Par55 renderHand opening. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { CONFIG } from '../../src/games/par-55/types';
import { renderHand } from '../../src/games/par-55/board-ui';

describe('Wave 49 par55 — renderHand', () => {
  it('renders HAND_SIZE blocks for current player', () => {
    const state = createInitialState();
    const el = renderHand(state, 'player1', () => undefined);
    expect(el.classList.contains('par55-hand')).toBe(true);
    expect(el.querySelectorAll('.par55-hand-block').length).toBe(CONFIG.HAND_SIZE);
  });
});
