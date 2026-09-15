/**
 * Wave 65 leftover after tip/#315 — Kwatro strategy Control the center exact.
 * Wave55 soft /Control the center/; deepen full li leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 65 kwatro — tutorial strategy control center exact', () => {
  it('strategy-tips lists Control the center maximize options', () => {
    const tips = kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.message).toContain(
      '<li>Control the center to maximize movement options</li>'
    );
  });
});
