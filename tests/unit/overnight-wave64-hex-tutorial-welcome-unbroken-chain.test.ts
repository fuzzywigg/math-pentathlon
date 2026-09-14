/**
 * Wave 64 leftover after tip/#303 — Hex welcome unbroken chain exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 64 hex — tutorial welcome unbroken chain', () => {
  it('Welcome to Hex!; unbroken chain of your pieces', () => {
    const welcome = hexTutorial.steps.find((s) => s.id === 'welcome');
    expect(welcome?.title).toBe('Welcome to Hex!');
    expect(welcome?.message).toMatch(/unbroken chain of your pieces/);
    expect(hexTutorial.id).toBe('hex-basics');
    expect(hexTutorial.name).toBe('Learn Hex');
  });
});
