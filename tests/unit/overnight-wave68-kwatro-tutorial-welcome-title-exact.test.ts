/**
 * Wave 68 leftover after tip/#336 — Kwatro welcome title exact.
 * Message covered; deepen title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { kwatroSinkoTutorial } from '../../src/games/kwatro-sinko/tutorial';

describe('Wave 68 kwatro — tutorial welcome title exact', () => {
  it('welcome title is Welcome to Kwatro-Sinko!', () => {
    const welcome = kwatroSinkoTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.title).toBe('Welcome to Kwatro-Sinko!');
  });
});
