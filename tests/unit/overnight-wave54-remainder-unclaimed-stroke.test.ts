/**
 * Overnight HEAVY leftover after #241 — unclaimed stroke #5d8a31 width 2. Tests-only.
 * Distinct from wave51 valid yellow stroke-width 4.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — unclaimed stroke', () => {
  it('idle hex stroke is forest green width 2', () => {
    const svg = renderBoard(createInitialState(), () => undefined, () => undefined);
    const hex = svg.querySelector('.island polygon');
    expect(hex?.getAttribute('stroke')).toBe('#5d8a31');
    expect(hex?.getAttribute('stroke-width')).toBe('2');
  });
});
