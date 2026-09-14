/**
 * Wave 59 leftover after #279 — Ramrod occupied slot aria includes Ncm rod.
 * Distinct from wave58 empty Sum N slot K aria. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/ramrod/rules';
import { renderBoard } from '../../src/games/ramrod/board-ui';
import type { Rod } from '../../src/games/ramrod/types';

describe('Wave 59 ramrod — occupied aria cm rod', () => {
  it('labels occupied slot with length cm rod piece', () => {
    const state = createInitialState();
    const box = state.boxes.get('box-0-0')!;
    const rod: Rod = {
      id: 'test-rod-3',
      length: 3,
      owner: 'player1',
    };
    box.rods[0] = rod;

    const board = renderBoard(state, () => undefined);
    const firstBox = board.querySelector('.ramrod-box')!;
    const slot0 = firstBox.querySelectorAll('.ramrod-slot')[0];
    expect(slot0.getAttribute('aria-label')).toContain('3cm rod');
  });
});
