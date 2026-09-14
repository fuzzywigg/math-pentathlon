/**
 * Wave 56 leftover after #243 — Sum Dominoes empty cell aria coord residual.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 56 sum — empty cell aria coord', () => {
  it('labels corner empties with chess-style coords', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    const a1 = el.querySelector('[data-row="0"][data-col="0"]');
    const k11 = el.querySelector(
      `[data-row="${CONFIG.BOARD_SIZE - 1}"][data-col="${CONFIG.BOARD_SIZE - 1}"]`
    );
    expect(a1?.getAttribute('aria-label')).toBe('A1, empty');
    expect(k11?.getAttribute('aria-label')).toBe('K11, empty');
  });
});
