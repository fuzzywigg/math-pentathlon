/**
 * Wave 67 leftover after tip/#324 — Hex winning solved-game sentence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 67 hex — tutorial winning solved sentence', () => {
  it('winning locks full solved-game no-draws sentence', () => {
    const step = hexTutorial.steps.find((s) => s.id === 'winning');
    expect(step?.message).toContain(
      'Hex is a solved game - there are no draws possible!'
    );
    expect(step?.title).toBe('Winning');
  });
});
