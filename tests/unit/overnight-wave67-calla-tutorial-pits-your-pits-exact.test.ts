/**
 * Wave 67 leftover after tip/#316 — Calla pits YOUR-pits drop exact.
 * Wave63/64 locked 3 cubes; lock YOUR pits drop sentence leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { callaTutorial } from '../../src/games/calla/tutorial';

describe('Wave 67 calla — tutorial pits your pits exact', () => {
  it('pits-explained locks YOUR pits drop-around sentence', () => {
    const step = callaTutorial.steps.find((s) => s.id === 'pits-explained');
    expect(step?.message).toContain(
      "You'll pick up cubes from YOUR pits and drop them around the board!"
    );
  });
});
