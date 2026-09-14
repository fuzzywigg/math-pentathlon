/**
 * Wave 48 — Ramrod history captures-only last-6 slice. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderMoveHistory } from '../../src/games/ramrod/board-ui';
import type { RamrodMove, Rod } from '../../src/games/ramrod/types';

describe('Wave 48 ramrod — history captures slice', () => {
  it('lists only captures and keeps last 6', () => {
    const rod: Rod = { id: 'r', length: 5, color: '#fdd835', owner: 'player1', position: null };
    const moves: RamrodMove[] = [];
    for (let i = 1; i <= 8; i++) {
      moves.push({
        player: i % 2 ? 'player1' : 'player2',
        rod,
        boxId: 'box-0-0',
        slot: 0,
        capturedBox: i % 2 === 1,
        pointsScored: i % 2 === 1 ? i : 0,
        moveNumber: i,
      });
    }
    const el = renderMoveHistory({ ...createInitialState(), moveHistory: moves });
    const rows = el.querySelectorAll('.ramrod-history-move');
    expect(rows.length).toBe(4); // 4 captures among 8, all ≤6
    expect(el.textContent).toContain('Recent Captures');
    expect(el.textContent).toMatch(/Blue/);
  });

  it('caps at 6 capture rows', () => {
    const rod: Rod = { id: 'r', length: 5, color: '#fdd835', owner: 'player1', position: null };
    const moves: RamrodMove[] = Array.from({ length: 10 }, (_, i) => ({
      player: 'player1' as const,
      rod,
      boxId: 'box-0-0',
      slot: 0,
      capturedBox: true,
      pointsScored: 5,
      moveNumber: i + 1,
    }));
    const el = renderMoveHistory({ ...createInitialState(), moveHistory: moves });
    expect(el.querySelectorAll('.ramrod-history-move')).toHaveLength(6);
  });
});
