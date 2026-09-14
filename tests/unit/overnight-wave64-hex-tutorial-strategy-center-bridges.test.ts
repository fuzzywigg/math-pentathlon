/**
 * Wave 64 leftover after tip/#303 — Hex strategy center + bridges exact. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 64 hex — tutorial strategy center bridges', () => {
  it('Control the center of the board; Create "bridges"', () => {
    const tips = hexTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.message).toMatch(/Control the center of the board/);
    expect(tips?.message).toMatch(/Create "bridges"/);
    expect(tips?.title).toBe('Strategy Tips');
  });
});
