/**
 * Wave 67 leftover after tip/#324 — Kwatro strategy Control the center exact li.
 * Wave60 locks Watch tip; deepen Control center leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 67 kwatro — tutorial strategy control center exact', () => {
  it('strategy lists Control the center li', () => {
    const tips = kwatroSinkoTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.message).toContain(
      '<li>Control the center to maximize movement options</li>'
    );
  });
});
