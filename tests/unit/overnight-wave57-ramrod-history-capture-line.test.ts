/**
 * Wave 57 leftover after #262 — Ramrod history capture line exact.
 * Distinct from formatMove Rod Ncm. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { createRod } from '../../src/games/ramrod/types';
import { renderMoveHistory } from '../../src/games/ramrod/board-ui';

describe('Wave 57 ramrod — history capture line', () => {
  it('renders Blue captured Ncm box for a capture move', () => {
    const state = createInitialState();
    state.moveHistory = [
      {
        player: 'player1',
        rod: createRod('r1', 3),
        boxId: 'box-0-0',
        slot: 0,
        capturedBox: true,
        pointsScored: 7,
        moveNumber: 1,
      },
    ];
    const el = renderMoveHistory(state);
    expect(el.querySelector('.ramrod-history-move')?.innerHTML).toBe(
      '<strong>Blue</strong> captured 7cm box'
    );
    expect(el.querySelector('h4')?.textContent).toBe('Recent Captures');
  });
});
