/**
 * Wave 59 leftover after #276 — Hex winning unbroken-path sentence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 59 hex — tutorial winning unbroken path', () => {
  it('winning title; Create an unbroken path', () => {
    const winning = hexTutorial.steps.find((s) => s.id === 'winning');
    expect(winning?.title).toBe('Winning');
    expect(winning?.message).toMatch(/Create an unbroken path/);
  });
});
