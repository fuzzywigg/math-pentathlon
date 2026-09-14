/**
 * Wave 48 overnight — Ramrod rod legend lengths 1–10. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderRodLegend } from '../../src/games/ramrod/board-ui';

describe('Wave 48 ramrod overnight — legend lengths', () => {
  it('renders 1cm..10cm with border on white/yellow', () => {
    const el = renderRodLegend();
    const items = el.querySelectorAll('.ramrod-legend-item');
    expect(items).toHaveLength(10);
    expect(el.textContent).toContain('1cm');
    expect(el.textContent).toContain('10cm');
    const colors = el.querySelectorAll('.ramrod-legend-color');
    expect((colors[0] as HTMLElement).style.border).toContain('1px');
    expect((colors[4] as HTMLElement).style.border).toContain('1px');
  });
});
