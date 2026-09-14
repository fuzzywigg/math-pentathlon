/**
 * Wave 55 leftover after #250 — Hex tutorial no-draws / strategy / gameplay / Finish. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { hexTutorial } from '../../src/games/hex/tutorial';

describe('Wave 55 hex — tutorial catalog', () => {
  it('id/name plus winning/strategy/gameplay/complete copy', () => {
    expect(hexTutorial.id).toBe('hex-basics');
    expect(hexTutorial.name).toBe('Learn Hex');
    expect(hexTutorial.steps.find((s) => s.id === 'winning')?.message).toMatch(/no draws/);
    const tips = hexTutorial.steps.find((s) => s.id === 'strategy-tips');
    expect(tips?.message).toMatch(/bridges/);
    expect(tips?.message).toMatch(/Control the center/);
    const play = hexTutorial.steps.find((s) => s.id === 'gameplay');
    expect(play?.message).toMatch(/Blue goes first/);
    expect(play?.message).toMatch(/cannot be moved/);
    expect(hexTutorial.steps.find((s) => s.id === 'complete')?.message).toMatch(/Finish/);
  });
});
