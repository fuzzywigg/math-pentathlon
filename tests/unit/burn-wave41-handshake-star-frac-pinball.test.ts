/**
 * Wave 41 — handshake: star-track / frac-fact / pinball registry + boot phases.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getGameById } from '../../src/core/game-registry';
import { createInitialState as starInit } from '../../src/games/star-track/types';
import { createInitialState as fracInit } from '../../src/games/frac-fact/types';
import { createInitialState as pinInit } from '../../src/games/fraction-pinball/types';
import { createInitialState as parInit } from '../../src/games/par-55/rules';
import { createInitialState as pentInit } from '../../src/games/pent-em-in/types';
import { createInitialState as remInit } from '../../src/games/remainder-islands/types';

describe('Wave 41 handshake — leftover engines registry', () => {
  it('registry names + boot phases for leftover six', () => {
    expect(getGameById('star-track')?.available).toBe(true);
    expect(getGameById('frac-fact')?.available).toBe(true);
    expect(getGameById('fraction-pinball')?.available).toBe(true);
    expect(getGameById('par-55')?.available).toBe(true);
    expect(getGameById('pent-em-in')?.available).toBe(true);
    expect(getGameById('remainder-islands')?.available).toBe(true);

    expect(starInit().phase).toBe('drawChains');
    expect(fracInit().phase).toBe('playing');
    expect(pinInit().phase).toBe('answering');
    expect(parInit().phase).toBe('selectingBlock');
    expect(pentInit().phase).toBe('selectPiece');
    expect(remInit().phase).toBe('rolling');
  });
});
