/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Sum empty aria A1. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { renderBoard } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 56 sum — empty aria A1', () => {
  it('opening empty cell A1 aria leftover', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    const cell = el.querySelector('[data-row="0"][data-col="0"]');
    expect(cell?.getAttribute('aria-label')).toBe('A1, empty');
  });
});
