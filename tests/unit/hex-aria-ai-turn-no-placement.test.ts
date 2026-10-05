/**
 * #383 — empty Hex cells must not say "valid placement" on the computer's turn.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { makeMove } from '../../src/games/hex/rules';
import { renderBoard } from '../../src/games/hex/board-ui';
import {
  applyGameModeChrome,
  clearGameModeChrome,
} from '../../src/ui/player-colors';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Hex a11y during AI turn', () => {
  it('omits valid placement on empty cells while it is the AI seat', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    applyGameModeChrome(app, 'human-vs-ai', 'player2');

    let state = createInitialState(5);
    state = makeMove(state, { row: 2, col: 2 });
    expect(state.currentPlayer).toBe('player2');

    const el = document.createElement('div');
    renderBoard(state, el, () => undefined);
    const empty = el.querySelector(
      '.hex-cell-group[data-row="0"][data-col="0"]'
    );
    const label = empty?.getAttribute('aria-label') ?? '';
    expect(label).toMatch(/empty/);
    expect(label).not.toMatch(/valid placement/);
    expect((empty as SVGElement | null)?.style.cursor).not.toBe('pointer');

    clearGameModeChrome(app);
  });

  it('still announces valid placement on the human turn vs AI', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
    applyGameModeChrome(app, 'human-vs-ai', 'player2');

    const state = createInitialState(5);
    expect(state.currentPlayer).toBe('player1');

    const el = document.createElement('div');
    renderBoard(state, el, () => undefined);
    const empty = el.querySelector(
      '.hex-cell-group[data-row="0"][data-col="0"]'
    );
    expect(empty?.getAttribute('aria-label') ?? '').toMatch(/valid placement/);

    clearGameModeChrome(app);
  });
});
