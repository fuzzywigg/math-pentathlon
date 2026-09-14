/**
 * Wave 63 leftover after #301 — Hex gameplay Blue goes first + click empty. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 63 hex — tutorial gameplay blue-first', () => {
  it('gameplay Blue goes first; click any empty hex', () => {
    const gameplay = hexTutorial.steps.find((s) => s.id === 'gameplay');
    expect(gameplay?.title).toBe('Gameplay');
    expect(gameplay?.message).toMatch(/Blue goes first/);
    expect(gameplay?.message).toMatch(/click any empty hex/);
  });
});
