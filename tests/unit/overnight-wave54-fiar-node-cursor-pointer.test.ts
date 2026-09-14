/**
 * Wave 54 leftover after #237 — FIAR node group cursor leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 54 fiar — node cursor', () => {
  it('node groups use pointer cursor', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector('[data-node-id="0-0"]') as SVGElement;
    expect(g.style.cursor).toBe('pointer');
  });
});
