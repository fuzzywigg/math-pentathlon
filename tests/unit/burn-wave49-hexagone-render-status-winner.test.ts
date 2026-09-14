/**
 * Wave 49 leftover after #221/#226/#227 — Hex-a-Gone winner banner. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderStatus } from '../../src/games/hex-a-gone/board-ui';

describe('Wave 49 hexagone — winner', () => {
  it('shows Blue Wins for player1', () => {
    const container = document.createElement('div');
    renderStatus({ ...createInitialState(), winner: 'player1' }, container);
    expect(container.querySelector('.status-winner')?.textContent).toMatch(/Blue Wins/);
  });
});
