/**
 * Wave 64 leftover after tip/#306 — Kwatro tutorial welcome three-chips copy.
 * Wave63 locked Let's learn + formula; deepen alignment phrase leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 64 kwatro — tutorial welcome three chips', () => {
  it('welcome message includes Create an alignment of three chips', () => {
    const welcome = kwatroSinkoTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.message).toContain(
      'Create an alignment of three chips where'
    );
  });
});
