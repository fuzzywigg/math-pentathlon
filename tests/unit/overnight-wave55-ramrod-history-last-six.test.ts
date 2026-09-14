/**
 * Wave 55 leftover after #250 — Ramrod history keeps last 6 captures.
 * Distinct from wave48 single capture line. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderMoveHistory } from '../../src/games/ramrod/board-ui';
import type { RamrodMove, Rod } from '../../src/games/ramrod/types';

describe('Wave 55 ramrod — history last six', () => {
  it('drops the oldest capture when more than six exist', () => {
    const s = createInitialState();
    const rod: Rod = {
      id: 'h',
      length: 4,
      color: '#0',
      owner: 'player1',
      position: null,
    };
    const captures: RamrodMove[] = Array.from({ length: 8 }, (_, i) => ({
      player: i % 2 === 0 ? 'player1' : 'player2',
      rod,
      boxId: `box-0-${i % 4}`,
      slot: 0,
      capturedBox: true,
      pointsScored: i + 1,
      moveNumber: i + 1,
    }));
    const el = renderMoveHistory({ ...s, moveHistory: captures });
    const lines = [...el.querySelectorAll('.ramrod-history-move')];
    expect(lines.length).toBe(6);
    expect(el.textContent).not.toMatch(/captured 1cm/);
    expect(el.textContent).not.toMatch(/captured 2cm/);
    expect(el.textContent).toMatch(/captured 3cm/);
    expect(el.textContent).toMatch(/captured 8cm/);
  });
});
