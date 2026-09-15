/**
 * Wave 67 leftover after tip/#324 — Sum setup highlight .sd-board.
 * Soft seven-dominoes exact existed; lock highlightSelector + bottom. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 67 sum — tutorial setup highlight board', () => {
  it('pins setup highlightSelector .sd-board bottom leftover', () => {
    const step = sumDominoesTutorial.steps.find((s) => s.id === 'setup');
    expect(step?.title).toBe('Setup');
    expect(step?.highlightSelector).toBe('.sd-board');
    expect(step?.position).toBe('bottom');
  });
});
