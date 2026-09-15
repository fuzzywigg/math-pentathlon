/**
 * Overnight TOKENMAXX HEAVY leftovers after #306/#316 — Kwatro strategy Control li exact.
 * Wave55 soft-matches Control the center; deepen exact li. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 66 kwatro — tutorial strategy control li', () => {
  it('strategy-tips includes Control the center exact li', () => {
    const tips = kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.message).toContain(
      '<li>Control the center to maximize movement options</li>'
    );
  });
});
