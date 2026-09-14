/**
 * Wave 49 leftover after #221/#226/#227 — Kings renderStatus opening phase. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 kings — renderStatus', () => {
  it('shows supplies and phase message for human mode', () => {
    const container = document.createElement('div');
    const state = createInitialGameState();
    renderStatus(state, container);
    expect(container.querySelector('.status')).toBeTruthy();
    expect(container.querySelector('.status-supplies')).toBeTruthy();
    expect(container.textContent).toMatch(/P1|P2|\d+/);
  });
});
