/**
 * Wave 52 — Blue/Red name cross for kqfs leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { createInitialState as createStar } from '../../src/games/star-track/types';
import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 52 handshake — kqfs opening factories', () => {
  it('opens four engines without throw', () => {
    expect(createKings().turnPhase).toBe('moveKing');
    expect(createQueens().currentPlayer).toBe('player1');
    expect(createFiar().phase).toBe('placement');
    expect(createStar().phase).toBe('drawChains');
  });
});
