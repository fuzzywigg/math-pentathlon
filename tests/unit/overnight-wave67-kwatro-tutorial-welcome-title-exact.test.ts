/**
 * Wave 67 leftover after tip/#324 — Kwatro welcome title exact.
 * Wave60 locks Movement/Winning titles; deepen Welcome title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 67 kwatro — tutorial welcome title exact', () => {
  it('welcome title is Welcome to Kwatro-Sinko!', () => {
    expect(kwatroSinkoTutorial.steps.find((s) => s.id === 'welcome')?.title).toBe(
      'Welcome to Kwatro-Sinko!'
    );
  });
});
