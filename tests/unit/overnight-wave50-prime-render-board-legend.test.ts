/**
 * Overnight HEAVY leftover after #229 — Prime Gold board legend chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/prime-gold/rules';
import { renderBoard } from '../../src/games/prime-gold/board-ui';

describe('Wave 50 prime — board legend', () => {
  it('shows Prime / Blue / Red legend swatches', () => {
    const el = renderBoard(createInitialState(), () => undefined);
    const legend = el.querySelector('.pg-legend');
    expect(legend).toBeTruthy();
    expect(legend?.textContent).toMatch(/Prime/);
    expect(legend?.textContent).toMatch(/Blue/);
    expect(legend?.textContent).toMatch(/Red/);
    expect(el.querySelector('.pg-legend-swatch.prime')).toBeTruthy();
    expect(el.querySelector('.pg-legend-swatch.p1')).toBeTruthy();
    expect(el.querySelector('.pg-legend-swatch.p2')).toBeTruthy();
  });
});
