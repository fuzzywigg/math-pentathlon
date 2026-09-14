/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Juggle turn-sequence Select/Place.
 * Wave60 locked Roll:/Choose: only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 64 juggle — tutorial turn Select Place', () => {
  it('locks Select/Place step copy leftovers', () => {
    const msg =
      juggleTutorial.steps.find((s) => s.id === 'turn-sequence')?.message ??
      '';
    expect(msg).toContain('Select:</strong>');
    expect(msg).toContain('Choose a specific shape from that category');
    expect(msg).toContain('Place:</strong>');
    expect(msg).toContain('Position and place the shape on your board');
  });
});
