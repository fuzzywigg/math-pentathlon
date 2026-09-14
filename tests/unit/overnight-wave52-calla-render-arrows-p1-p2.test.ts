/**
 * Overnight HEAVY leftover after #234 — Calla sow-direction arrows chrome. Tests-only.
 * Distinct from open #235/#236 hex/par/kwatro niches and wave48 calla status/pits.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Wave 52 calla — sow arrows', () => {
  it('mounts p1 and p2 direction arrows with arrowhead markers', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    expect(el.querySelector('.calla-arrows')).toBeTruthy();
    expect(el.querySelector('.calla-arrow-p1')).toBeTruthy();
    expect(el.querySelector('.calla-arrow-p2')).toBeTruthy();
    expect(el.querySelector('#arrowhead-p1')).toBeTruthy();
    expect(el.querySelector('#arrowhead-p2')).toBeTruthy();
  });
});
