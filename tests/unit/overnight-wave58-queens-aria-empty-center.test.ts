/**
 * Wave 58 leftover after #267 (unit-only; #277 closed RED e2e) — Queens empty center aria-label.
 * Distinct from wave56 Blue Queen aria leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 58 queens — empty center aria', () => {
  it('announces ring 0 pos 0, empty on throne cell', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector('[data-cell-key="0-0"]')!;
    expect(g.getAttribute('aria-label')).toBe('ring 0 pos 0, empty');
  });
});
