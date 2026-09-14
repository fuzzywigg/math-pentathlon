/**
 * Wave 42 leftovers B — Kings getSaveInfo + generateSaveFileName.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  serializeGameState,
  getSaveInfo,
  generateSaveFileName,
} from '../../src/games/kings-quadraphages/serialization';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — save info / filename', () => {
  it('getSaveInfo labels player and gameOver false on opening', () => {
    const data = serializeGameState(createInitialGameState());
    const info = getSaveInfo(data);
    expect(info.currentPlayer).toBe('Player 1');
    expect(info.isGameOver).toBe(false);
    expect(info.winner).toBeNull();
    expect(info.turnCount).toBe(0);
    expect(info.savedAt).toBeInstanceOf(Date);
    expect(info.metadata).toBeUndefined();
  });

  it('getSaveInfo gameOver + winner + metadata included', () => {
    const state = createInitialGameState();
    const data = serializeGameState(
      {
        ...state,
        turnPhase: 'gameOver',
        winner: 'player2',
        currentPlayer: 'player2',
        moveHistory: [
          {
            player: 'player2',
            action: 'placeQuadraphage',
            to: { row: 3, col: 3 },
          },
        ],
      },
      { notes: 'trap finish', player2Name: 'Bea' }
    );
    const info = getSaveInfo(data);
    expect(info.isGameOver).toBe(true);
    expect(info.winner).toBe('player2');
    expect(info.currentPlayer).toBe('Player 2');
    expect(info.turnCount).toBe(1);
    expect(info.metadata?.notes).toBe('trap finish');
    expect(info.metadata?.player2Name).toBe('Bea');
  });

  it('generateSaveFileName uses prefix + date stamp', () => {
    const name = generateSaveFileName('kq');
    expect(name).toMatch(/^kq-\d{4}-\d{2}-\d{2}-\d{4}\.json$/);
    const def = generateSaveFileName();
    expect(def.startsWith('kings-quadraphages-')).toBe(true);
    expect(def.endsWith('.json')).toBe(true);
  });
});
