/**
 * Wave 42 handshake — kings × remainder × star seat sync.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import { createInitialState as rem } from '../../src/games/remainder-islands/types';
import { createInitialState as star } from '../../src/games/star-track/types';

describe('Wave 42 handshake — kings × rem × star', () => {
  it('all start player1 with zero history', () => {
    const k = createInitialGameState();
    const r = rem();
    const s = star();
    expect([k.currentPlayer, r.currentPlayer, s.currentPlayer]).toEqual([
      'player1',
      'player1',
      'player1',
    ]);
    expect(k.moveHistory).toHaveLength(0);
    expect(r.moveHistory).toHaveLength(0);
    expect(s.moveHistory).toHaveLength(0);
  });
});
