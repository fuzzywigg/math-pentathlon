/**
 * Overnight HEAVY leftover — Calla renderBoard last-sown pit class.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/calla/types';
import { makeMove } from '../../src/games/calla/rules';
import { renderBoard } from '../../src/games/calla/board-ui';

describe('Overnight wave50 calla — last-sown class', () => {
  it('marks lastSown own pit with calla-pit-last after a non-calla land', () => {
    const next = makeMove(createInitialState(), 0);
    const el = document.createElement('div');
    renderBoard(next, el);
    const last = el.querySelector('.calla-pit-last');
    expect(last).toBeTruthy();
    expect(last?.getAttribute('data-side')).toBe(next.lastSownPit?.side);
    expect(last?.getAttribute('data-pit-index')).toBe(
      String(next.lastSownPit?.index)
    );

    const callaLand = document.createElement('div');
    renderBoard(makeMove(createInitialState(), 2), callaLand);
    expect(callaLand.querySelector('.calla-pit-last')).toBeNull();
  });
});
