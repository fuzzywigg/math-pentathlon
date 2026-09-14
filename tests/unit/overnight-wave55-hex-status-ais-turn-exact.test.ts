/**
 * Wave 55 leftover after #250 — Hex HvA AI seat turn copy. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderStatus } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hex — AI turn copy', () => {
  it("shows AI's turn when P2 to move and not thinking", () => {
    const el = document.createElement('div');
    renderStatus(
      { ...createInitialState(5), currentPlayer: 'player2' },
      el,
      'human-vs-ai',
      false
    );
    expect(el.querySelector('.status-turn')?.textContent).toBe("AI's turn - Click to place");
  });
});
