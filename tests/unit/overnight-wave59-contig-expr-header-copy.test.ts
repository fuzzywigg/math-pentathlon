/**
 * Wave 59 Contig/SD residual — Contig expr header copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderExpressionSelector } from '../../src/games/contig-60/board-ui';

describe('Wave 59 contig — expr header', () => {
  it('shows Choose a number header when moves exist', () => {
    const el = renderExpressionSelector(
      {
        ...createInitialState(),
        phase: 'calculating',
        currentDice: [1, 2, 3],
      },
      () => undefined,
      () => undefined
    );
    expect(el.querySelector('.contig-expr-header')?.textContent).toBe(
      'Choose a number to place:'
    );
  });
});
