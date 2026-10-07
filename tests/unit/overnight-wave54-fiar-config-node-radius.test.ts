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
    expect(createFiarBoard().nodes.size).toBe(40);
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector('[data-node-id="c3r3"]')!;
    const bg = g.querySelector('circle[data-node-visual="1"]')!;
    expect(bg.getAttribute('r')).toBe('24');
    // Transparent hit disc is larger for tablet (≥44px CSS after scale).
    expect(g.querySelector('[data-hit-target="1"]')?.getAttribute('r')).toBe(
      String(CONFIG.NODE_HIT_RADIUS)
    );
  });
});
