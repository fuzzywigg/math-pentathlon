/**
 * Wave 67 leftover after tip/#323/#324 — objective fill exact.
 * Soft tutorial existed; lock exact leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 67 juggle — tutorial objective fill exact', () => {
  it('objective locks fill 9x9 sentence exact', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'objective');
    expect(step?.message).toContain('Be the first player to completely fill your 9x9 grid with polyomino shapes!');
    expect(step?.title).toBe('Objective');
  });
});
