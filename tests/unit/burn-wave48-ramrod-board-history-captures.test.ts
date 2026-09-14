/**
 * Wave 48 — Ramrod renderMoveHistory capture lines. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderMoveHistory } from '../../src/games/ramrod/board-ui';
import type { RamrodMove, Rod } from '../../src/games/ramrod/types';

describe('Wave 48 ramrod — history captures', () => {
  it('lists only captured moves with points', () => {
    const s = createInitialState();
    const rod: Rod = { id: 'x', length: 4, color: '#0', owner: 'player1', position: null };
    const moves: RamrodMove[] = [
      { player: 'player1', rod, boxId: 'box-0-0', slot: 0, capturedBox: false, pointsScored: 0, moveNumber: 1 },
      { player: 'player2', rod, boxId: 'box-0-1', slot: 1, capturedBox: true, pointsScored: 9, moveNumber: 2 },
    ];
    const el = renderMoveHistory({ ...s, moveHistory: moves });
    expect(el.textContent).toMatch(/Recent Captures/);
    expect(el.querySelectorAll('.ramrod-history-move').length).toBe(1);
    expect(el.textContent).toMatch(/9cm/);
    expect(el.textContent).toMatch(/Red/);
  });
});
