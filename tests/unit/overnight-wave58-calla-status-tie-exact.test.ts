/**
 * Wave 58 leftover after #262 (retry #273 RED) — Calla tie banner exact copy.
 * Distinct from getPhaseMessage "It's a tie!". Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderStatus } from '../../src/games/calla/board-ui';

describe('Wave 58 calla — status tie exact', () => {
  it('renders exact handshake tie banner with status-winner', () => {
    const state = {
      ...createInitialState(),
      phase: 'gameOver' as const,
      winner: 'tie' as const,
    };
    const el = document.createElement('div');
    renderStatus(state, el);
    const turn = el.querySelector('.status-turn');
    expect(turn?.classList.contains('status-winner')).toBe(true);
    expect(turn?.textContent).toBe("🤝 It's a Tie! 🤝");
  });
});
