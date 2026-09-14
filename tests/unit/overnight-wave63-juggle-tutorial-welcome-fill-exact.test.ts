/**
 * Wave 63 leftover after tip/#301 — Juggle welcome/objective fill-9x9 exact.
 * Soft 9x9 fragments elsewhere; lock full objective sentence. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 63 juggle — tutorial welcome fill exact', () => {
  it('locks fill-9x9 objective sentence on welcome + objective', () => {
    const byId = Object.fromEntries(
      juggleTutorial.steps.map((s) => [s.id, s])
    );
    const fill =
      'Be the first player to completely fill your 9x9 grid with polyomino shapes!';
    expect(byId['welcome']?.message).toContain(fill);
    expect(byId['objective']?.message).toContain(fill);
    expect(byId['objective']?.title).toBe('Objective');
    expect(juggleTutorial.id).toBe('juggle-basics');
    expect(juggleTutorial.name).toBe('Learn Juggle');
  });
});
