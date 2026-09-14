/**
 * Wave 60 leftover after tip/#279 — Ramrod legend h4 exact title.
 * Tightens wave52 soft /Cuisenaire/. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderRodLegend } from '../../src/games/ramrod/board-ui';

describe('Wave 60 ramrod — legend title exact', () => {
  it('renders h4 Cuisenaire Rods exactly', () => {
    const el = renderRodLegend();
    expect(el.querySelector('h4')?.textContent).toBe('Cuisenaire Rods');
  });
});
