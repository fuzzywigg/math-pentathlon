/**
 * Overnight HEAVY leftover after #229 — Pent board SVG size + interaction grid. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, BOARD_SIZE } from '../../src/games/pent-em-in/types';
import { renderBoard } from '../../src/games/pent-em-in/board-ui';

describe('Wave 50 pent — board grid', () => {
  it('renders pent-board with BOARD_SIZE² interaction cells', () => {
    const svg = renderBoard(createInitialState(), () => undefined, () => undefined);
    expect(svg.classList.contains('pent-board')).toBe(true);
    expect(svg.querySelectorAll('.interaction [data-row][data-col]').length).toBe(
      BOARD_SIZE * BOARD_SIZE
    );
    expect(svg.getAttribute('viewBox')).toMatch(/^0 0 /);
  });
});
