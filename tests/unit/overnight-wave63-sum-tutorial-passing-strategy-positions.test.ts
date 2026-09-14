/**
 * Wave 63 Contig/SD residual after tip #301 — Sum passing/strategy positions leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 63 sum — tutorial passing strategy positions', () => {
  it('pins passing/strategy/complete center with no highlightSelector', () => {
    const byId = Object.fromEntries(
      sumDominoesTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId.passing?.position).toBe('center');
    expect(byId['strategy-tips']?.position).toBe('center');
    expect(byId.complete?.position).toBe('center');
    expect(byId.passing?.highlightSelector).toBeUndefined();
    expect(byId['strategy-tips']?.highlightSelector).toBeUndefined();
    expect(byId.complete?.highlightSelector).toBeUndefined();
  });
});
