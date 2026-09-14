/**
 * Wave 58 leftover after #267 — Queens Red Guard aria.
 * Distinct from Red Queen leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 58 queens — Red Guard aria', () => {
  it('announces ring 5 pos 16, Red Guard', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    // Player2 even positions (≠22) are guards; 16 is even in 15-29.
    expect(svg.querySelector('[data-cell-key="5-16"]')?.getAttribute('aria-label')).toBe(
      'ring 5 pos 16, Red Guard'
    );
  });
});
