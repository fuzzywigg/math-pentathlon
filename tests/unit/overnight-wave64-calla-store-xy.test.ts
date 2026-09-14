/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Calla store rect x/y.
 * Wave60 locked 50×140 size only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 64 calla — store rect xy', () => {
  it('locks P2 store at 10,30 and P1 store at 440,30', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const p2 = el.querySelector('.calla-store-p2 .calla-store-rect');
    const p1 = el.querySelector('.calla-store-p1 .calla-store-rect');
    expect(p2?.getAttribute('x')).toBe('10');
    expect(p2?.getAttribute('y')).toBe('30');
    expect(p1?.getAttribute('x')).toBe('440');
    expect(p1?.getAttribute('y')).toBe('30');
  });
});
