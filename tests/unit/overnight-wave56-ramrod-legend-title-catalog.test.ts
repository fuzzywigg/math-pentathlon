/**
 * Wave 56 leftover after #256 — Ramrod legend title + 1cm..10cm catalog.
 * Distinct from wave55 light-border leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderRodLegend } from '../../src/games/ramrod/board-ui';

describe('Wave 56 ramrod — legend title catalog', () => {
  it('titles Cuisenaire Rods and lists 1cm through 10cm', () => {
    const el = renderRodLegend();
    expect(el.querySelector('h4')?.textContent).toBe('Cuisenaire Rods');
    const labels = [...el.querySelectorAll('.ramrod-legend-item span')].map(
      (s) => s.textContent ?? ''
    );
    expect(labels).toEqual([
      '1cm',
      '2cm',
      '3cm',
      '4cm',
      '5cm',
      '6cm',
      '7cm',
      '8cm',
      '9cm',
      '10cm',
    ]);
  });
});
