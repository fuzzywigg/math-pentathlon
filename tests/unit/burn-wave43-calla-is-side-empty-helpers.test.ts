/**
 * Wave 43 — Calla isSideEmpty after forged empty. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  isSideEmpty,
  getSideTotalCubes,
} from '../../src/games/calla/types';

describe('Wave 43 calla — isSideEmpty helpers', () => {
  it('detects empty side and zero total', () => {
    const s = {
      ...createInitialState(),
      player2Pits: [0, 0, 0, 0, 0],
    };
    expect(isSideEmpty(s, 'player2')).toBe(true);
    expect(getSideTotalCubes(s, 'player2')).toBe(0);
    expect(isSideEmpty(s, 'player1')).toBe(false);
  });
});
