/**
 * Wave 41 HEAVY — multi-engine catalog: 4+ createInitialState openings.
 * Assert currentPlayer player1 + phase not gameOver.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { createInitialState as sumDominoesInit } from '../../src/games/sum-dominoes/rules';
import { createInitialState as kwaInit } from '../../src/games/kwatro-sinko/rules';
import { createInitialState as callaInit } from '../../src/games/calla/types';
import { createInitialState as hexInit } from '../../src/games/hex-a-gone/types';
import { createInitialState as qgInit } from '../../src/games/queens-guards/types';
import { createInitialState as ramrodInit } from '../../src/games/ramrod/rules';
import { createInitialState as pgInit } from '../../src/games/prime-gold/rules';

const catalog = [
  ['juggle', juggleInit],
  ['sum-dominoes', sumDominoesInit],
  ['kwatro-sinko', kwaInit],
  ['calla', callaInit],
  ['hex-a-gone', hexInit],
  ['queens-guards', qgInit],
  ['ramrod', ramrodInit],
  ['prime-gold', pgInit],
] as const;

describe('Wave 41 handshake — multi-engine catalog openings', () => {
  it.each(catalog)('%s: player1 and not gameOver', (_name, init) => {
    const state = init();
    expect(state.currentPlayer).toBe('player1');
    expect(state.winner).toBeNull();
    // phase field exists on most; queens-guards has no phase — skip if absent
    if ('phase' in state && state.phase !== undefined) {
      expect(state.phase).not.toBe('gameOver');
    }
  });

  it('all eight engines agree on opening seat', () => {
    const seats = catalog.map(([, init]) => init().currentPlayer);
    expect(new Set(seats)).toEqual(new Set(['player1']));
  });

  it('no engine opens with a non-null winner', () => {
    for (const [, init] of catalog) {
      expect(init().winner).toBeNull();
    }
  });

  it('rolling-phase engines share rolling; others are interactive select', () => {
    expect(juggleInit().phase).toBe('rolling');
    expect(sumDominoesInit().phase).toBe('rolling');
    expect(pgInit().phase).toBe('rolling');
    expect(kwaInit().phase).toBe('selectingChip');
    expect(callaInit().phase).toBe('selectPit');
    expect(hexInit().phase).toBe('selectBlocks');
    expect(ramrodInit().phase).toBe('selectingRod');
  });
});
