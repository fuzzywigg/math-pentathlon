/**
 * Overnight HEAVY leftover after #241 — score panel Blue/Red copy. Tests-only.
 * Distinct from wave48 active-seat class.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderScores } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — score names', () => {
  it('player1/player2 name nodes are Blue and Red', () => {
    const el = renderScores(createInitialState());
    expect(el.querySelector('.player1 .remainder-player-name')?.textContent).toBe('Blue');
    expect(el.querySelector('.player2 .remainder-player-name')?.textContent).toBe('Red');
  });
});
