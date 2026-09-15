/**
 * Wave 67 leftover after tip/#324 — Hex objective unbroken chain exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 67 hex — tutorial objective chain', () => {
  it('objective locks unbroken chain sentence + title', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.message).toContain(
      'Connect your two opposite sides of the board with an unbroken chain of your pieces.'
    );
    expect(step?.position).toBe('center');
  });
});
