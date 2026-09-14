/**
 * Overnight HEAVY leftover after #241 — Remainder water pattern defs. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/remainder-islands/types';
import { renderBoard } from '../../src/games/remainder-islands/board-ui';

describe('Wave 54 remainder — water pattern', () => {
  it('defines #water-pattern and paints overlay url', () => {
    const svg = renderBoard(createInitialState(), () => undefined, () => undefined);
    expect(svg.querySelector('#water-pattern')).toBeTruthy();
    const overlay = [...svg.querySelectorAll('rect')].find(
      (r) => r.getAttribute('fill') === 'url(#water-pattern)'
    );
    expect(overlay?.getAttribute('opacity')).toBe('0.5');
  });
});
