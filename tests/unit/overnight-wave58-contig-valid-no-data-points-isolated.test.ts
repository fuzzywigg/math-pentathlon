/**
 * Wave 58 Contig/SD residual — isolated valid cells omit data-points. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { renderBoard } from '../../src/games/contig-60/board-ui';

describe('Wave 58 contig — isolated valid no data-points', () => {
  it('opening calculating valids lack data-points attribute', () => {
    const state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 2, 3] as [number, number, number],
    };
    const el = renderBoard(state, () => undefined);
    const valids = el.querySelectorAll('.contig-cell-valid');
    expect(valids.length).toBeGreaterThan(0);
    for (const cell of valids) {
      expect((cell as HTMLElement).dataset.points).toBeUndefined();
    }
  });
});
