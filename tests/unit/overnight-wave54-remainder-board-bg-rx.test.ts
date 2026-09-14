/**
 * Overnight HEAVY leftover after #241 — Remainder board bg rx. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — board bg rx', () => {
  it('background rect rx is 8', () => {
    const svg = renderBoard(createInitialState(), () => undefined, () => undefined);
    expect(svg.querySelector('rect')?.getAttribute('rx')).toBe('8');
  });
});
