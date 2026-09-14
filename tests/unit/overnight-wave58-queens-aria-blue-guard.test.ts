/**
 * Wave 58 leftover after #267 (unit-only; #277 closed RED e2e) — Queens opening Blue Guard aria-label.
 * Distinct from wave56 Blue Queen aria leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 58 queens — Blue Guard aria', () => {
  it('announces ring 5 pos 1, Blue Guard on opening guard cell', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector('[data-cell-key="5-1"]')!;
    expect(g.getAttribute('aria-label')).toBe('ring 5 pos 1, Blue Guard');
  });
});
