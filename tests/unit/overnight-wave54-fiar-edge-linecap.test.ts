/**
 * Wave 54 leftover after #237 — FIAR edge stroke-linecap leftover (wave52 width). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 54 fiar — edge linecap', () => {
  it('edge lines use round cap and #8b7355 stroke', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const line = svg.querySelector('line')!;
    expect(line.getAttribute('stroke-linecap')).toBe('round');
    expect(line.getAttribute('stroke')).toBe('#8b7355');
  });
});
