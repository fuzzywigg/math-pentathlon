/**
 * Overnight HEAVY leftover after #241 — rolling phase has no hit polygon. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — rolling no hit', () => {
  it('opening rolling island has a single hex polygon', () => {
    const svg = renderBoard(createInitialState(), () => undefined, () => undefined);
    const g = svg.querySelector('.island')!;
    expect(g.querySelectorAll('polygon').length).toBe(1);
  });
});
