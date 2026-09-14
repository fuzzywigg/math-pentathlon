/**
 * Wave 43 — Ramrod reject place into completed box. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState, isValidPlacement } from '../../src/games/ramrod/rules';
import { createBoxId } from '../../src/games/ramrod/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 ramrod — completed box reject', () => {
  it('completedBy set → placement false', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const s = createInitialState();
    const boxId = createBoxId(0, 1);
    const box = s.boxes.get(boxId)!;
    const boxes = new Map(s.boxes);
    boxes.set(boxId, { ...box, completedBy: 'player2' });
    const forged = { ...s, boxes };
    const rodId = s.playerRods.player1[0];
    expect(isValidPlacement(forged, rodId, boxId, 0)).toBe(false);
  });
});
