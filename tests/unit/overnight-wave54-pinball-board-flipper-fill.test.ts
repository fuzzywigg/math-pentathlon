/**
 * Wave 54 leftover after #240 — Pinball flipper chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { renderPinballBoard } from '../../src/games/fraction-pinball/board-ui';

describe('Wave 54 pinball — flippers', () => {
  it('renders two #ff9800 flipper rects', () => {
    const svg = renderPinballBoard(createInitialState());
    const flippers = [...svg.querySelectorAll('rect')].filter(
      (r) => r.getAttribute('fill') === '#ff9800'
    );
    expect(flippers.length).toBe(2);
    expect(flippers.every((r) => r.getAttribute('height') === '10')).toBe(true);
  });
});
