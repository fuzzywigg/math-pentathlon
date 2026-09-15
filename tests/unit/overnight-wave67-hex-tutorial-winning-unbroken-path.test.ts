/**
 * Wave 67 leftover after tip/#324 — Hex winning unbroken path exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 67 hex — tutorial winning unbroken path', () => {
  it('winning locks unbroken path connecting edges exact', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain(
      'unbroken path of your pieces connecting your two edges'
    );
    expect(step?.position).toBe('center');
  });
});
