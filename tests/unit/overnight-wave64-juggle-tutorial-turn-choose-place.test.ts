/**
 * Wave 64 leftover after tip/#303 — Juggle turn-sequence Choose/Select/Place.
 * Complements Roll two dice; deepen remaining ol leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { juggleTutorial } from '../../src/games/juggle/tutorial';

describe('Wave 64 juggle — tutorial turn choose place', () => {
  it('locks Pick one die / Choose shape / Position and place steps', () => {
    const step = juggleTutorial.steps.find((s) => s.id === 'turn-sequence');
    expect(step?.message).toContain('Pick one die');
    expect(step?.message).toContain('shape category');
    expect(step?.message).toContain(
      'Choose a specific shape from that category'
    );
    expect(step?.message).toContain(
      'Position and place the shape on your board'
    );
  });
});
