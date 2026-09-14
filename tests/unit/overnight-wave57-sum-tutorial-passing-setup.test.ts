/**
 * Wave 57 leftover after #267 — Sum setup/passing tutorial copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { sumDominoesTutorial } from '../../src/games/sum-dominoes/tutorial';

describe('Wave 57 sum — tutorial setup passing', () => {
  it('pins 7 dominoes setup and fewer-pips passing', () => {
    const byId = Object.fromEntries(sumDominoesTutorial.steps.map((s) => [s.id, s]));
    expect(byId['setup']?.message).toMatch(/Each player receives 7 dominoes/);
    expect(byId['setup']?.highlightSelector).toBe('.sd-board');
    expect(byId['passing']?.message).toMatch(/fewer total pips/);
  });
});
