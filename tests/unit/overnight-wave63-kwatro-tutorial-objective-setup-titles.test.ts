/**
 * Overnight TOKENMAXX HEAVY leftovers after #301 — Kwatro objective/setup titles.
 * Wave56 matches message needles; deepen exact titles + setup Even li. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 63 kwatro — tutorial objective/setup titles', () => {
  it('objective/setup titles exact; setup Even chip li', () => {
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'objective')?.title
    ).toBe('Objective');
    expect(
      kwatroSinkoTutorial.steps.find((s) => s.id === 'setup')?.title
    ).toBe('Setup');
    const setup = kwatroSinkoTutorial.steps.find((s) => s.id === 'setup');
    expect(setup?.position).toBe('bottom');
    expect(setup?.message).toContain(
      '<li><strong>Blue (Player 1):</strong> Even chips (0, 2, 4, 6, 8)</li>'
    );
    expect(setup?.message).toContain(
      '<li><strong>Red (Player 2):</strong> Odd chips (1, 3, 5, 7, 9)</li>'
    );
  });
});
