/**
 * Wave 49 — Handshake kings status + history mount. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { renderStatus, renderMoveHistory } from '../../src/games/kings-quadraphages/board-ui';

describe('Wave 49 handshake — kings chrome', () => {
  it('status and history mount', () => {
    const s = createInitialGameState();
    const status = document.createElement('div');
    const history = document.createElement('div');
    renderStatus(s, status);
    renderMoveHistory(s, history);
    expect(status.querySelector('.status')).toBeTruthy();
    expect(history.querySelector('.move-history-title')?.textContent).toBe('Moves');
  });
});
