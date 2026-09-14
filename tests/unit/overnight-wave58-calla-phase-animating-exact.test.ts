/**
 * Wave 58 leftover after #262 (retry #273 RED) — Calla animating phase exact copy.
 * Distinct from selectPit shield instruction. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { getPhaseMessage } from '../../src/games/calla/rules';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 58 calla — phase animating exact', () => {
  it('says Blue is distributing cubes during animating', () => {
    const state = {
      ...createInitialState(),
      phase: 'animating' as const,
      currentPlayer: 'player1' as const,
    };
    expect(getPhaseMessage(state)).toBe('Blue is distributing cubes...');
    const el = document.createElement('div');
    renderStatus(state, el);
    expect(el.querySelector('.status-turn')?.textContent).toBe(
      'Blue is distributing cubes...'
    );
  });

  it('says Red is distributing cubes for player2', () => {
    const state = {
      ...createInitialState(),
      phase: 'animating' as const,
      currentPlayer: 'player2' as const,
    };
    expect(getPhaseMessage(state)).toBe('Red is distributing cubes...');
  });
});
