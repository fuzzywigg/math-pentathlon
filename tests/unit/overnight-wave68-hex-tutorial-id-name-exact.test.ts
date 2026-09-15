/**
 * Wave 68 leftover after tip/#336 — Hex tutorial id/name exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 68 hex — tutorial id name exact', () => {
  it('config locks id + name', () => {
    expect(hexTutorial.id).toBe('hex-basics');
    expect(hexTutorial.name).toBe('Learn Hex');
    expect(hexTutorial.steps.length).toBe(8);
  });
});
