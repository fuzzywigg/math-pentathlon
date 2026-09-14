/**
 * Wave 58 leftover after #267 — Queens Red Queen aria.
 * Distinct from wave56 Blue Queen leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 58 queens — Red Queen aria', () => {
  it('announces ring 5 pos 22, Red Queen', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    expect(svg.querySelector('[data-cell-key="5-22"]')?.getAttribute('aria-label')).toBe(
      'ring 5 pos 22, Red Queen'
    );
  });
});
