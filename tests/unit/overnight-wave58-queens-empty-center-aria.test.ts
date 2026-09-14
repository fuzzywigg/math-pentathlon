/**
 * Wave 58 leftover after #267 — Queens empty center aria.
 * Distinct from wave56 opening Blue Queen leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 58 queens — empty center aria', () => {
  it('announces ring 0 pos 0, empty', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    expect(svg.querySelector('[data-cell-key="0-0"]')?.getAttribute('aria-label')).toBe(
      'ring 0 pos 0, empty'
    );
  });
});
