/**
 * Wave 64 leftover after tip/#303 — Calla pits-explained YOUR-pits copy.
 * Wave63 locked 3-cubes HTML; deepen pick-up/drop leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 64 calla — tutorial pits your side', () => {
  it('locks YOUR pits pick-up and drop-around fragments', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'pits-explained');
    expect(step?.title).toBe('The Pits');
    expect(step?.message).toContain('YOUR pits');
    expect(step?.message).toContain('drop them around the board');
  });
});
