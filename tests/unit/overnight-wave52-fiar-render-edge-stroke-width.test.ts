/**
 * Wave 52 — FIAR edge stroke-width leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 52 fiar — edge stroke width', () => {
  it('sets edge lines to CONFIG.EDGE_STROKE', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const line = svg.querySelector('line')!;
    expect(line.getAttribute('stroke-width')).toBe(String(CONFIG.EDGE_STROKE));
    expect(CONFIG.EDGE_STROKE).toBe(3);
  });
});
