/**
 * Overnight HEAVY leftover — Calla tutorial highlight selectors + positions.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Overnight wave50 calla — tutorial highlights', () => {
  it('wires board/pit/store highlights and live positions', () => {
    const byId = Object.fromEntries(
      callaTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId['board-intro']?.highlightSelector).toBe('.calla-board');
    expect(byId['board-intro']?.position).toBe('bottom');
    expect(byId['pits-explained']?.highlightSelector).toBe('.calla-pit');
    expect(byId['pits-explained']?.position).toBe('top');
    expect(byId['your-calla']?.highlightSelector).toBe('.calla-store');
    expect(byId['your-calla']?.position).toBe('left');
    expect(byId['welcome']?.position).toBe('center');
    expect(byId['complete']?.position).toBe('center');
    expect(byId['complete']?.highlightSelector).toBeUndefined();
  });
});
