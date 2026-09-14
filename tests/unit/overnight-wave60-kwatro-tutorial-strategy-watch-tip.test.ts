/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro strategy tip unsaturated li.
 * Wave55 covers Control the center / Block; deepen Watch for potential… Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 60 kwatro — tutorial strategy watch tip', () => {
  it('strategy-tips includes Watch for potential winning combinations', () => {
    const tips = kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.message).toContain(
      '<li>Watch for potential winning combinations</li>'
    );
  });
});
