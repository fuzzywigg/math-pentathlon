/**
 * Wave 49 leftover after #221/#226/#227 — Star Track winner banner. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/star-track/types';
import { renderStatus } from '../../src/games/star-track/board-ui';

describe('Wave 49 star-track — winner status', () => {
  it('shows Blue Wins when player1 winner', () => {
    const container = document.createElement('div');
    const state = { ...createInitialState(), winner: 'player1' as const };
    renderStatus(state, container);
    expect(container.querySelector('.status-winner')?.textContent).toMatch(/Blue Wins/);
  });
});
