/**
 * Overnight HEAVY leftover after #241 — Remainder board viewBox origin. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — viewBox', () => {
  it('viewBox starts at 0 0 with positive dims', () => {
    const svg = renderBoard(createInitialState(), () => undefined, () => undefined);
    const vb = svg.getAttribute('viewBox') ?? '';
    expect(vb.startsWith('0 0 ')).toBe(true);
    const parts = vb.split(' ').map(Number);
    expect(parts[2]).toBeGreaterThan(0);
    expect(parts[3]).toBeGreaterThan(0);
  });
});
