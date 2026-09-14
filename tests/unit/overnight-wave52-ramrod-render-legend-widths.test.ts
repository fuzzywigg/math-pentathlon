/**
 * Overnight HEAVY leftover after #234 — Ramrod legend light-rod widths. Tests-only.
 * Complements wave48 legend color swatches with 1cm/5cm scaled widths.
 */
import { describe, it, expect } from 'vitest';
import { renderRodLegend } from '../../src/games/ramrod/board-ui';

describe('Wave 52 ramrod — legend widths', () => {
  it('renders 10 legend items; 1cm and 5cm use scaled widths', () => {
    const el = renderRodLegend();
    const items = [...el.querySelectorAll('.ramrod-legend-item')];
    expect(items.length).toBe(10);
    expect(el.textContent).toMatch(/Cuisenaire Rods/);

    const byLabel = (cm: string) =>
      items.find((i) => i.textContent?.includes(cm))?.querySelector(
        '.ramrod-legend-color'
      ) as HTMLElement;

    expect(byLabel('1cm')?.style.width).toBe('8px');
    expect(byLabel('5cm')?.style.width).toBe('40px');
    expect(byLabel('10cm')?.style.width).toBe('80px');
  });
});
