/**
 * Wave 45 TOKENMAXX — Kings getCurrentPhaseMessage place/over leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  getCurrentPhaseMessage,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 45 kings — phase messages', () => {
  it('moveKing / placeQuadraphage / gameOver messages differ', () => {
    const open = createInitialGameState();
    const moveMsg = getCurrentPhaseMessage(open);
    const placeMsg = getCurrentPhaseMessage({
      ...open,
      turnPhase: 'placeQuadraphage',
    });
    const overMsg = getCurrentPhaseMessage({
      ...open,
      turnPhase: 'gameOver',
      winner: 'player1',
    });
    expect(moveMsg.length).toBeGreaterThan(0);
    expect(placeMsg.length).toBeGreaterThan(0);
    expect(overMsg.length).toBeGreaterThan(0);
    expect(new Set([moveMsg, placeMsg, overMsg]).size).toBe(3);
  });
});
