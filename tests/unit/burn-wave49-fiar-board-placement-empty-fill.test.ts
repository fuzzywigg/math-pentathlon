/**
 * Wave 49 — FIAR placement empty-node hover fill leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 49 fiar — placement empty fill', () => {
  it('uses nodeHover fill on empty placement nodes', () => {
    const s = createInitialState();
    expect(s.phase).toBe('placement');
    const svg = renderBoard(s, () => undefined);
    const circle = svg.querySelector('[data-node-id="0-0"] > circle')!;
    expect(circle.getAttribute('fill')).toBe('#c9baa0');
  });
});
