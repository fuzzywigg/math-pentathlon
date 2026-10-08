/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro welcome message exact.
 * Wave56 locks welcome title; deepen Let's learn strong copy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 63 kwatro — tutorial welcome message', () => {
  it('welcome message includes Learn Kwatro-Sinko strong + formula', () => {
    const welcome = kwatroSinkoTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.position).toBe('center');
    expect(welcome?.message).toContain(
      "Let's learn how to play <strong>Kwatro-Sinko</strong>!"
    );
    expect(welcome?.message).toContain(
      '<strong>a + b - c = 4 or 5</strong>'
    );
  });
});
