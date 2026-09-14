/**
 * Wave 49 — Handshake four UI engines create/opening. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as qg } from '../../src/games/queens-guards/types';
import { createInitialState as st } from '../../src/games/star-track/types';
import { createInitialState as ff } from '../../src/games/frac-fact/types';
import { createInitialGameState as kq } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 49 handshake — four openings', () => {
  it('creates distinct opening states', () => {
    expect(qg().currentPlayer).toBe('player1');
    expect(st().phase).toBe('drawChains');
    expect(ff().phase).toBe('playing');
    expect(kq().turnPhase).toBe('moveKing');
  });
});
