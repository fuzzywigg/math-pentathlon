/**
 * Wave 68 leftover after tip/#336 — Hex winning no draws exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 68 hex — tutorial winning no draws', () => {
  it('winning locks unbroken path + no draws possible', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain('unbroken path of your pieces connecting your two edges');
    expect(step?.message).toContain('no draws possible');
    expect(step?.position).toBe('center');
  });
});
