/**
 * Overnight HEAVY leftover after #241 — Remainder board bg fill. Tests-only.
 * Distinct from wave51 island fill/stroke and wave48 svg island count.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — board bg fill', () => {
  it('first rect is #e8f4f8', () => {
    const svg = renderBoard(createInitialState(), () => undefined, () => undefined);
    const bg = svg.querySelector('rect');
    expect(bg?.getAttribute('fill')).toBe('#e8f4f8');
  });
});
