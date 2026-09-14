/**
 * Wave 42 — Kings serialization save helpers getSaveInfo / filename leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  serializeGameState,
  getSaveInfo,
  generateSaveFileName,
  gameStateFromJSON,
  gameStateToJSON,
} from '../../src/games/kings-quadraphages/serialization';
import {
  createInitialGameState,
  moveKing,
  placeQuadraphage,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — save info helpers', () => {
  it('getSaveInfo opening not over; turnCount 0', () => {
    const info = getSaveInfo(serializeGameState(createInitialGameState()));
    expect(info.isGameOver).toBe(false);
    expect(info.winner).toBeNull();
    expect(info.turnCount).toBe(0);
    expect(info.currentPlayer).toBe('Player 1');
  });

  it('getSaveInfo after turn reflects player2 and history length', () => {
    let state = createInitialGameState();
    state = moveKing(state, { row: 2, col: 5 });
    state = placeQuadraphage(state, { row: 4, col: 4 });
    const info = getSaveInfo(serializeGameState(state));
    expect(info.currentPlayer).toBe('Player 2');
    expect(info.turnCount).toBe(2);
  });

  it('generateSaveFileName uses prefix and .json; JSON parseable', () => {
    const name = generateSaveFileName('kings-wave42');
    expect(name.startsWith('kings-wave42-')).toBe(true);
    expect(name.endsWith('.json')).toBe(true);
    const restored = gameStateFromJSON(
      gameStateToJSON(createInitialGameState())
    );
    expect(restored.turnPhase).toBe('moveKing');
  });
});
