/**
 * Wave 67 leftover after tip/#336 — FIAR movement cannot-jump exact.
 * Wave54/63 soft jump; lock Cannot jump over other chips leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { fiarTutorial } from '../../src/games/fiar/tutorial';

describe('Wave 67 fiar — tutorial movement cannot jump', () => {
  it('movement-rules lists Cannot jump over other chips', () => {
    const step = fiarTutorial.steps.find((s) => s.id === 'movement-rules');
    expect(step?.message).toContain('Cannot jump over other chips');
  });
});
