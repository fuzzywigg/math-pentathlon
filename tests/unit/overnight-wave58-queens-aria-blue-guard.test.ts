/**
 * Wave 58 leftover after #267 — Queens Blue Guard aria.
 * Distinct from wave56 Blue Queen leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 58 queens — Blue Guard aria', () => {
  it('announces ring 5 pos 1, Blue Guard', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    expect(svg.querySelector('[data-cell-key="5-1"]')?.getAttribute('aria-label')).toBe(
      'ring 5 pos 1, Blue Guard'
    );
  });
});
