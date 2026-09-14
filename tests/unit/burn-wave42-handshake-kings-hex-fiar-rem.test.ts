/**
 * Wave 42 leftovers B — Handshake kings×hex×fiar openings + remnant AI seat.
 * Tests-only; no product inventing.
 */
import { describe, it, expect } from 'vitest';

import { createInitialGameState as kingsInit } from '../../src/games/kings-quadraphages/game-state';
import { validateSerializedState, serializeGameState } from '../../src/games/kings-quadraphages/serialization';
import { getAIMove as kingsAI } from '../../src/games/kings-quadraphages/ai';
import { createInitialState as hexInit } from '../../src/games/hex/types';
import { getValidMoves as hexValids } from '../../src/games/hex/rules';
import { getRandomMove as hexRandom } from '../../src/games/hex/ai';
import { createInitialState as fiarInit } from '../../src/games/fiar/types';
import { getAIMove as fiarAI, applyAIMove } from '../../src/games/fiar/ai';
import { createInitialState as remInit } from '../../src/games/remainder-islands/types';
import { isAITurn as remAITurn } from '../../src/games/remainder-islands/ai';
import { createInitialState as fabInit } from '../../src/games/fab-a-diffy/rules';
import { isAITurn as fabAITurn } from '../../src/games/fab-a-diffy/ai';
import { createInitialState as fracInit, getPlayerStats } from '../../src/games/frac-fact/types';

describe('Wave 42 handshake — leftovers B openings', () => {
  it('kings serialize valid + AI move; hex has empty cells; fiar places', () => {
    const kings = kingsInit();
    expect(validateSerializedState(serializeGameState(kings))).toBe(true);
    expect(kingsAI(kings, 'player1', 'easy')).not.toBeNull();

    const hex = hexInit(5);
    expect(hexValids(hex)).toHaveLength(25);
    expect(hexRandom(hex)).not.toBeNull();

    const fiar = fiarInit();
    const move = fiarAI(fiar, 'player1', 'easy');
    expect(move?.type).toBe('place');
    expect(applyAIMove(fiar, move!).chipsPlaced.player1).toBe(1);
  });

  it('remainder/fab AI turn gates; frac stats zero at open', () => {
    const rem = remInit();
    expect(remAITurn(rem, 'player1')).toBe(true);
    expect(remAITurn(rem, null)).toBe(false);

    const fab = fabInit();
    expect(fabAITurn(fab, 'player1', 'human-vs-ai')).toBe(true);
    expect(fabAITurn(fab, 'player2', 'human-vs-ai')).toBe(false);

    const frac = fracInit('easy');
    expect(getPlayerStats(frac, 'player1').score).toBe(0);
    expect(getPlayerStats(frac, 'player2').correctAnswers).toBe(0);
  });
});
