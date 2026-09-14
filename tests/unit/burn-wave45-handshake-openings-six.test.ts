/**
 * Wave 45 TOKENMAXX — six-engine opening handshake leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialGameState as kingsOpen } from '../../src/games/kings-quadraphages/game-state';
import { createInitialState as queensOpen } from '../../src/games/queens-guards/types';
import { createInitialState as remOpen } from '../../src/games/remainder-islands/types';
import { createInitialState as parOpen } from '../../src/games/par-55/rules';
import { createInitialState as pinOpen } from '../../src/games/fraction-pinball/types';
import { createInitialState as kwaOpen } from '../../src/games/kwatro-sinko/rules';

describe('Wave 45 handshake — openings', () => {
  it('all six open on player1 without winners', () => {
    expect(kingsOpen().currentPlayer).toBe('player1');
    expect(kingsOpen().winner).toBeNull();
    expect(queensOpen().currentPlayer).toBe('player1');
    expect(queensOpen().winner).toBeNull();
    expect(remOpen().currentPlayer).toBe('player1');
    expect(remOpen().winner).toBeNull();
    expect(parOpen().currentPlayer).toBe('player1');
    expect(parOpen().winner).toBeNull();
    expect(pinOpen().currentPlayer).toBe('player1');
    expect(pinOpen().winner).toBeNull();
    expect(kwaOpen().currentPlayer).toBe('player1');
    expect(kwaOpen().winner).toBeNull();
  });
});
