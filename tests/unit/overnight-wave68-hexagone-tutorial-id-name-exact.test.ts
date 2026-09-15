/**
 * Wave 68 leftover after tip/#336 — Hex-a-Gone tutorial id/name exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexAGoneTutorial } from '../../src/games/hex-a-gone/tutorial';

describe('Wave 68 hexagone — tutorial id name exact', () => {
  it('config locks id + name', () => {
    expect(hexAGoneTutorial.id).toBe('hex-a-gone-basics');
    expect(hexAGoneTutorial.name).toBe('Learn Hex-a-Gone!');
    expect(hexAGoneTutorial.steps.length).toBe(9);
  });
});
