/**
 * Wave 17 — cross-game getOpponent seat-flip identity matrix.
 * Distinct from waves 14–16 (types helpers, rules-phase/illegal/getValid*, AI pipeline/accuracy/place-score).
 * Tests-only: assert existing player1↔player2 flips. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import { getOpponent as callaOpp } from '../../src/games/calla/types';
import { getOpponent as contigOpp } from '../../src/games/contig-60/types';
import { getOpponent as fabOpp } from '../../src/games/fab-a-diffy/types';
import { getOpponent as fiarOpp } from '../../src/games/fiar/types';
import { getOpponent as fracOpp } from '../../src/games/frac-fact/types';
import { getOpponent as pinballOpp } from '../../src/games/fraction-pinball/types';
import { getOpponent as hexOpp } from '../../src/games/hex/types';
import { getOpponent as hagOpp } from '../../src/games/hex-a-gone/types';
import { getOpponent as juggleOpp } from '../../src/games/juggle/types';
import { getOpponent as kwaOpp } from '../../src/games/kwatro-sinko/types';
import { getOpponent as parOpp } from '../../src/games/par-55/types';
import { getOpponent as pentOpp } from '../../src/games/pent-em-in/types';
import { getOpponent as queensOpp } from '../../src/games/queens-guards/types';
import { getOpponent as ramrodOpp } from '../../src/games/ramrod/types';
import { getOpponent as remainderOpp } from '../../src/games/remainder-islands/types';
import { getOpponent as starOpp } from '../../src/games/star-track/types';
import { getOpponent as sumOpp } from '../../src/games/sum-dominoes/types';
import { getOpponent as kingsOpp } from '../../src/games/kings-quadraphages/rules';

type Seat = 'player1' | 'player2';
type OppFn = (player: Seat) => Seat;

const OPPONENTS: { name: string; getOpponent: OppFn }[] = [
  { name: 'calla', getOpponent: callaOpp },
  { name: 'contig-60', getOpponent: contigOpp },
  { name: 'fab-a-diffy', getOpponent: fabOpp },
  { name: 'fiar', getOpponent: fiarOpp },
  { name: 'frac-fact', getOpponent: fracOpp },
  { name: 'fraction-pinball', getOpponent: pinballOpp },
  { name: 'hex', getOpponent: hexOpp },
  { name: 'hex-a-gone', getOpponent: hagOpp },
  { name: 'juggle', getOpponent: juggleOpp },
  { name: 'kwatro-sinko', getOpponent: kwaOpp },
  { name: 'par-55', getOpponent: parOpp },
  { name: 'pent-em-in', getOpponent: pentOpp },
  { name: 'queens-guards', getOpponent: queensOpp },
  { name: 'ramrod', getOpponent: ramrodOpp },
  { name: 'remainder-islands', getOpponent: remainderOpp },
  { name: 'star-track', getOpponent: starOpp },
  { name: 'sum-dominoes', getOpponent: sumOpp },
  { name: 'kings-quadraphages', getOpponent: kingsOpp },
];

describe('Wave 17 opponent-identity — player1↔player2 flip', () => {
  it.each(OPPONENTS)('$name flips player1 to player2', ({ getOpponent }) => {
    expect(getOpponent('player1')).toBe('player2');
  });

  it.each(OPPONENTS)('$name flips player2 to player1', ({ getOpponent }) => {
    expect(getOpponent('player2')).toBe('player1');
  });

  it.each(OPPONENTS)(
    '$name double-flip restores the original seat',
    ({ getOpponent }) => {
      expect(getOpponent(getOpponent('player1'))).toBe('player1');
      expect(getOpponent(getOpponent('player2'))).toBe('player2');
    }
  );

  it.each(OPPONENTS)(
    '$name never returns the same seat for a known player',
    ({ getOpponent }) => {
      expect(getOpponent('player1')).not.toBe('player1');
      expect(getOpponent('player2')).not.toBe('player2');
    }
  );
});

describe('Wave 17 opponent-identity — cross-game agreement', () => {
  it('all live games agree on player1→player2', () => {
    const results = OPPONENTS.map(({ getOpponent }) => getOpponent('player1'));
    expect(new Set(results)).toEqual(new Set(['player2']));
  });

  it('all live games agree on player2→player1', () => {
    const results = OPPONENTS.map(({ getOpponent }) => getOpponent('player2'));
    expect(new Set(results)).toEqual(new Set(['player1']));
  });

  it('covers 18 existing games with getOpponent exports', () => {
    expect(OPPONENTS).toHaveLength(18);
    const names = OPPONENTS.map((o) => o.name);
    expect(new Set(names).size).toBe(18);
  });
});
