/**
 * Overnight HEAVY leftover after #241 — unclaimed island fill #8bc34a. Tests-only.
 * Distinct from wave51 owned player1 fill.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — unclaimed fill', () => {
  it('opening islands use green unclaimed fill', () => {
    const svg = renderBoard(createInitialState(), () => undefined, () => undefined);
    const hex = svg.querySelector('.island polygon');
    expect(hex?.getAttribute('fill')).toBe('#8bc34a');
  });
});
