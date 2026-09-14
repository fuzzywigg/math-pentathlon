/**
 * Wave 60 leftover after tip/#279 — Juggle tutorial dice-values + turn-sequence ol.
 * Distinct from #289 Save small / rotated. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 60 juggle — tutorial dice turn ol', () => {
  it('locks monomino label and Roll/Choose strong tags', () => {
    const dice = juggleTutorial.steps.find((s) => s.id === 'dice-values');
    const turn = juggleTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(dice?.message).toContain('1</strong> = Monomino');
    expect(turn?.message).toContain('Roll:</strong>');
    expect(turn?.message).toContain('Choose:</strong>');
  });
});
