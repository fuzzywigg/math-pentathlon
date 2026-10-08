/**
 * Wave 56 leftover after #256 — Kwatro tutorial setup + objective leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 56 kwatro — tutorial setup/objective', () => {
  it('setup Even/Odd + objective a+b-c; welcome title', () => {
    const setup = kwatroSinkoTutorial.steps.find((s) => s.id === 'setup');
    expect(setup?.highlightSelector).toBe('.kwa-chip-info');
    expect(setup?.message).toMatch(/Even chips/);
    expect(setup?.message).toMatch(/Odd chips/);
    const objective = kwatroSinkoTutorial.steps.find((s) => s.id === 'objective');
    expect(objective?.message).toMatch(/a \+ b - c = 4 or 5/);
    expect(kwatroSinkoTutorial.steps.find((s) => s.id === 'welcome')?.title).toBe(
      'Welcome to Kwatro-Sinko!'
    );
  });
});
