/**
 * Wave 42 HEAVY — handshake: fiar × kings-quadraphages openings.
 * Leftover engines (not #187 set). Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState as fiarInit,
  getOpponent as fiarOpp,
  CONFIG as fiarConfig,
} from '../../src/games/fiar/types';
import {
  createInitialGameState as kingsInit,
  getSupply,
} from '../../src/games/kings-quadraphages/game-state';
import { getOpponent as kingsOpp } from '../../src/games/kings-quadraphages/rules';

describe('Wave 42 handshake — fiar × kings openings', () => {
  it('both open player1 with null winner', () => {
    const f = fiarInit();
    const k = kingsInit();
    expect(f.currentPlayer).toBe('player1');
    expect(k.currentPlayer).toBe('player1');
    expect(f.winner).toBeNull();
    expect(k.winner).toBeNull();
  });

  it('fiar placement chips; kings moveKing with full supply', () => {
    const f = fiarInit();
    const k = kingsInit();
    expect(f.phase).toBe('placement');
    expect(f.chipsPlaced.player1).toBe(0);
    expect(fiarConfig.CHIPS_PER_PLAYER).toBe(4);
    expect(k.turnPhase).toBe('moveKing');
    expect(getSupply(k, 'player1')).toBe(30);
    expect(getSupply(k, 'player2')).toBe(30);
  });

  it('opponent helpers agree', () => {
    expect(fiarOpp('player1')).toBe('player2');
    expect(kingsOpp('player1')).toBe('player2');
    expect(fiarOpp('player2')).toBe(kingsOpp('player2'));
  });

  it('neither opens selecting/placing secondary phase', () => {
    expect(fiarInit().phase).not.toBe('movement');
    expect(kingsInit().turnPhase).not.toBe('placeQuadraphage');
    expect(kingsInit().selectedKingPosition).toBeNull();
    expect(fiarInit().selectedNode).toBeNull();
  });
});
