/**
 * Wave 59 leftover after #279 — Juggle tutorial positions + strategy/placement copy.
 * Distinct from wave56 copy soft-matches and wave58 titles. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 59 juggle — tutorial positions strategy copy', () => {
  it('locks step positions and Save small / rotated fragments', () => {
    const byId = Object.fromEntries(
      juggleTutorial.steps.map((s) => [s.id, s])
    );
    expect(byId['welcome']?.position).toBe('center');
    expect(byId['turn-sequence']?.position).toBe('bottom');
    expect(byId['placement-rules']?.position).toBe('top');
    expect(byId['strategy-tips']?.position).toBe('center');
    expect(byId['placement-rules']?.message).toContain(
      'rotated and flipped'
    );
    expect(byId['strategy-tips']?.message).toContain('Save small shapes');
  });
});
