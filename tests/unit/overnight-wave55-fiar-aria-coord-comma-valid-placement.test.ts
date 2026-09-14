/**
 * Wave 55 leftover after #249/#250 — FIAR aria coord comma + valid placement. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 55 fiar — aria coord comma placement', () => {
  it('empty placement node aria uses 2,2 and valid placement', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector('[data-node-id="2-2"]')!;
    const label = g.getAttribute('aria-label') ?? '';
    expect(label).toMatch(/2,2/);
    expect(label).toMatch(/valid placement/);
    expect(label).toMatch(/empty/);
  });
});
