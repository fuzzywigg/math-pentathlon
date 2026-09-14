/**
 * Wave 42 HEAVY — leftover-engine catalog openings (distinct from #187).
 * fiar · kings · par-55 · remainder · frac-fact · pinball · star-track.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState as fiarInit } from '../../src/games/fiar/types';
import { createInitialGameState as kingsInit } from '../../src/games/kings-quadraphages/game-state';
import { createInitialState as parInit } from '../../src/games/par-55/rules';
import { createInitialState as remInit } from '../../src/games/remainder-islands/types';
import { createInitialState as fracInit } from '../../src/games/frac-fact/types';
import { createInitialState as pinInit } from '../../src/games/fraction-pinball/types';
import { createInitialState as starInit } from '../../src/games/star-track/types';

const catalog = [
  ['fiar', () => fiarInit()],
  ['kings', () => kingsInit()],
  ['par-55', () => parInit()],
  ['remainder', () => remInit()],
  ['frac-fact', () => fracInit()],
  ['pinball', () => pinInit()],
  ['star-track', () => starInit()],
] as const;

describe('Wave 42 handshake — leftover engine catalog openings', () => {
  it.each(catalog)('%s: player1 and no winner', (_name, init) => {
    const state = init();
    expect(state.currentPlayer).toBe('player1');
    expect(state.winner).toBeNull();
  });

  it('all seven leftovers agree on opening seat', () => {
    const seats = catalog.map(([, init]) => init().currentPlayer);
    expect(new Set(seats)).toEqual(new Set(['player1']));
  });

  it('phased leftovers do not open gameOver', () => {
    expect(fiarInit().phase).not.toBe('gameOver');
    expect(parInit().phase).not.toBe('gameOver');
    expect(remInit().phase).not.toBe('gameOver');
    expect(fracInit().phase).not.toBe('gameOver');
    expect(pinInit().phase).not.toBe('gameOver');
    expect(starInit().phase).not.toBe('gameOver');
    expect(kingsInit().turnPhase).not.toBe('gameOver');
  });

  it('opening phases match engine identity', () => {
    expect(fiarInit().phase).toBe('placement');
    expect(kingsInit().turnPhase).toBe('moveKing');
    expect(parInit().phase).toBe('selectingBlock');
    expect(remInit().phase).toBe('rolling');
    expect(fracInit().phase).toBe('playing');
    expect(pinInit().phase).toBe('answering');
    expect(starInit().phase).toBe('drawChains');
  });
});
