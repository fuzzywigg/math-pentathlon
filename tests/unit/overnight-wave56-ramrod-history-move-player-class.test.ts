/**
 * Wave 56 leftover after #256 — Ramrod history move seat class chrome.
 * Distinct from wave55 last-six capture trim. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderMoveHistory } from '../../src/games/ramrod/board-ui';
import type { RamrodMove, Rod } from '../../src/games/ramrod/types';

describe('Wave 56 ramrod — history move player class', () => {
  it('stamps .player1/.player2 on capture rows with Blue/Red copy', () => {
    const s = createInitialState();
    const rod: Rod = {
      id: 'c',
      length: 5,
      color: '#0',
      owner: 'player1',
      position: null,
    };
    const moves: RamrodMove[] = [
      {
        player: 'player1',
        rod,
        boxId: 'box-0-0',
        slot: 0,
        capturedBox: true,
        pointsScored: 4,
        moveNumber: 1,
      },
      {
        player: 'player2',
        rod: { ...rod, id: 'd', owner: 'player2' },
        boxId: 'box-0-1',
        slot: 1,
        capturedBox: true,
        pointsScored: 11,
        moveNumber: 2,
      },
    ];
    const el = renderMoveHistory({ ...s, moveHistory: moves });
    const rows = [...el.querySelectorAll('.ramrod-history-move')];
    expect(rows.length).toBe(2);
    expect(rows[0].classList.contains('player1')).toBe(true);
    expect(rows[1].classList.contains('player2')).toBe(true);
    expect(rows[0].textContent).toMatch(/Blue.*captured 4cm/);
    expect(rows[1].textContent).toMatch(/Red.*captured 11cm/);
  });
});
