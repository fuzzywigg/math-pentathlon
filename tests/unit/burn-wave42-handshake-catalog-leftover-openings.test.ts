/**
 * Wave 42 handshake — leftover catalog openings (not #187 set).
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as fiar } from '../../src/games/fiar/types';
import { createInitialGameState as kings } from '../../src/games/kings-quadraphages/game-state';
import { createInitialState as rem } from '../../src/games/remainder-islands/types';
import { createInitialState as star } from '../../src/games/star-track/types';
import { createInitialState as par } from '../../src/games/par-55/rules';
import { createInitialState as frac } from '../../src/games/frac-fact/types';
import { createInitialState as pin } from '../../src/games/fraction-pinball/types';
import { createInitialState as hex } from '../../src/games/hex/types';

describe('Wave 42 handshake — leftover catalog openings', () => {
  it('eight leftover engines boot player1 without winner', () => {
    const states = [
      fiar(),
      kings(),
      rem(),
      star(),
      par(),
      frac(),
      pin(),
      hex(5),
    ];
    for (const s of states) {
      expect(s.currentPlayer).toBe('player1');
      expect(s.winner).toBeNull();
    }
  });
});
