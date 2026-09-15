/**
 * Wave 67 leftover after tip/#316 — Juggle objective title + fill exact.
 * Soft welcome fill existed; lock Objective title leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 67 juggle — tutorial objective title exact', () => {
  it('objective locks title and 9x9 fill sentence', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.title).toBe('Objective');
    expect(step?.message).toContain(
      'Be the first player to completely fill your 9x9 grid with polyomino shapes!'
    );
  });
});
