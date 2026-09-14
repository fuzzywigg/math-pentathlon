/**
 * Wave 58 leftover after #267 (unit-only; #277 closed RED e2e) — Queens Space key activates cell click.
 * Distinct from wave56 Enter leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/queens-guards/types';
import { renderBoard } from '../../src/games/queens-guards/board-ui';

describe('Wave 58 queens — keydown Space', () => {
  it('Space on data-cell-key fires onCellClick with ring/position', () => {
    let clicked: { ring: number; position: number } | null = null;
    const svg = renderBoard(createInitialState(), (coord) => {
      clicked = coord;
    });
    const g = svg.querySelector('[data-cell-key="0-0"]')!;
    g.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true })
    );
    expect(clicked).toEqual({ ring: 0, position: 0 });
  });
});
