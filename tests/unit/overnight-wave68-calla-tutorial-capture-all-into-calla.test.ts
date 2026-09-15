/**
 * Wave 68 leftover after tip/#333 — capture all into calla.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 68 calla — tutorial capture all into calla', () => {
  it('capture locks ALL those cubes into Calla', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'capture');
    expect(step?.message).toContain('You capture ALL those cubes into your Calla!');
  });
});
