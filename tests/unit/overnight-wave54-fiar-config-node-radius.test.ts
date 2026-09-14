/**
 * Wave 54 leftover after #237 — FIAR CONFIG radius leftover (WIN_LENGTH already burned). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, createFiarBoard } from '../../src/games/fiar/types';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 54 fiar — NODE_RADIUS chrome', () => {
  it('empty node circle r matches CONFIG.NODE_RADIUS 24', () => {
    expect(CONFIG.NODE_RADIUS).toBe(24);
    expect(createFiarBoard().nodes.size).toBe(25);
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector('[data-node-id="2-2"]')!;
    const bg = g.querySelector('circle')!;
    expect(bg.getAttribute('r')).toBe('24');
  });
});
