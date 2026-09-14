/**
 * Wave 54 leftover after #237/#241 — FIAR node hover brightness leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fiar/types';
import { renderBoard } from '../../src/games/fiar/board-ui';

describe('Wave 54 fiar — hover brightness', () => {
  it('mouseenter sets brightness filter; mouseleave clears it', () => {
    const svg = renderBoard(createInitialState(), () => undefined);
    const g = svg.querySelector('[data-node-id="0-0"]')!;
    const circle = g.querySelector('circle')!;
    g.dispatchEvent(new Event('mouseenter'));
    expect(circle.getAttribute('filter')).toBe('brightness(1.1)');
    g.dispatchEvent(new Event('mouseleave'));
    expect(circle.getAttribute('filter')).toBeNull();
  });
});
