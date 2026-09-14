/**
 * Wave 57 leftover after #267 — Queens opening Red Queen aria-label.
 * Distinct from wave56 Blue Queen aria leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 57 queens — Red Queen aria', () => {
  it('announces ring 5 pos 22, Red Queen on opening red queen', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector('[data-cell-key="5-22"]')!;
    expect(g.getAttribute('aria-label')).toBe('ring 5 pos 22, Red Queen');
  });
});
