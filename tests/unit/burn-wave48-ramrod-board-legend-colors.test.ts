/**
 * Wave 48 — Ramrod renderRodLegend 1–10. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { renderRodLegend } from '../../src/games/ramrod/board-ui';

describe('Wave 48 ramrod — legend', () => {
  it('renders 10 rod lengths', () => {
    const el = renderRodLegend();
    expect(el.querySelectorAll('.ramrod-legend-item').length).toBe(10);
    expect(el.textContent).toMatch(/1cm/);
    expect(el.textContent).toMatch(/10cm/);
  });
});
