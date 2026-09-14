/**
 * Wave 57 leftover after #267 — Sum board row count 11. Tests-only.
 * Mirrors wave53 contig-row-count.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { CONFIG } from '../../src/games/sum-dominoes/types';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 57 sum — row count', () => {
  it('renders BOARD_SIZE rows', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    expect(el.querySelectorAll('.sd-row')).toHaveLength(CONFIG.BOARD_SIZE);
  });
});
