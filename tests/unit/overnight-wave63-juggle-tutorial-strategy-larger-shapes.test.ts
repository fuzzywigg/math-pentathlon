/**
 * Wave 63 leftover after tip/#301 — Juggle strategy larger-shapes tip.
 * Wave59 locked Save small shapes; deepen remaining tips. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 63 juggle — tutorial strategy larger shapes', () => {
  it('locks Larger shapes fill the board faster tip', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(step?.message).toContain('Larger shapes fill the board faster');
    expect(step?.title).toBe('Strategy Tips');
  });
});
