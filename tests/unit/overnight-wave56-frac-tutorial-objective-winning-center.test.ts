/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact objective/winning center.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fracFactTutorial } from '../../src/games/frac-fact/tutorial';

describe('Wave 56 frac tutorial — objective/winning center', () => {
  it('objective and winning are position center leftover', () => {
    const objective = fracFactTutorial.steps.find((s) => s.id === 'objective');
    const winning = fracFactTutorial.steps.find((s) => s.id === 'winning');
    expect(objective?.position).toBe('center');
    expect(winning?.position).toBe('center');
  });
});
