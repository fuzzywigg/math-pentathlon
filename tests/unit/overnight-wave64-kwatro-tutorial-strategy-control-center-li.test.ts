/**
 * Wave 64 leftover after tip/#306 — Kwatro tutorial strategy control-center li.
 * Wave60 locked Watch tip; deepen Control the center exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 64 kwatro — tutorial strategy control center li', () => {
  it('locks Control the center exact li', () => {
    const step = kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain(
      '<li>Control the center to maximize movement options</li>'
    );
  });
});
