/**
 * Wave 55 leftover after #250 — Ramrod legend 1cm/5cm light-rod borders.
 * Distinct from wave52 scaled widths. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderRodLegend } from '../../src/games/ramrod/board-ui';

describe('Wave 55 ramrod — legend light borders', () => {
  it('puts 1px solid #999 on 1cm and 5cm swatches only', () => {
    const el = renderRodLegend();
    const items = [...el.querySelectorAll('.ramrod-legend-item')];
    const swatch = (cm: string) =>
      items.find((i) => i.textContent?.includes(cm))?.querySelector(
        '.ramrod-legend-color'
      ) as HTMLElement;

    expect(swatch('1cm').style.border).toMatch(/1px solid (#999|rgb\(153,\s*153,\s*153\))/);
    expect(swatch('5cm').style.border).toMatch(/1px solid (#999|rgb\(153,\s*153,\s*153\))/);
    expect(swatch('2cm').style.border).toBe('');
    expect(swatch('10cm').style.border).toBe('');
  });
});
