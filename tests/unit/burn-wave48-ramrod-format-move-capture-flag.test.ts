/**
 * Wave 48 — Ramrod formatMove capture vs place. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { formatMove } from '../../src/games/ramrod/rules';
import type { RamrodMove, Rod } from '../../src/games/ramrod/types';

describe('Wave 48 ramrod — formatMove', () => {
  it('includes capture points when captured', () => {
    const rod: Rod = { id: 'r', length: 5, color: '#0', owner: 'player1', position: null };
    const capture: RamrodMove = {
      player: 'player1', rod, boxId: 'box-0-0', slot: 0, capturedBox: true, pointsScored: 10, moveNumber: 1,
    };
    const plain: RamrodMove = { ...capture, capturedBox: false, pointsScored: 0 };
    expect(formatMove(capture)).toMatch(/10|cm|capture|\+/i);
    expect(formatMove(plain)).toBeTruthy();
  });
});
