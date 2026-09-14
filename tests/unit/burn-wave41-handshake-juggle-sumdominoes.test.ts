/**
 * Wave 41 HEAVY — handshake: juggle × sum-dominoes createInitialState + phase.
 * Cross-game engines only. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState as juggleInit } from '../../src/games/juggle/rules';
import { createInitialState as sumDominoesInit } from '../../src/games/sum-dominoes/rules';
import { getOpponent as juggleOpponent } from '../../src/games/juggle/types';
import { getOpponent as sdOpponent } from '../../src/games/sum-dominoes/types';

describe('Wave 41 handshake — juggle × sum-dominoes openings', () => {
  it('both open player1 / rolling / no winner', () => {
    const j = juggleInit();
    const s = sumDominoesInit();
    expect(j.currentPlayer).toBe('player1');
    expect(s.currentPlayer).toBe('player1');
    expect(j.phase).toBe('rolling');
    expect(s.phase).toBe('rolling');
    expect(j.winner).toBeNull();
    expect(s.winner).toBeNull();
    expect(j.phase).not.toBe('gameOver');
    expect(s.phase).not.toBe('gameOver');
  });

  it('juggle dual boards empty; sum-dominoes hands dealt 7 each', () => {
    const j = juggleInit();
    const s = sumDominoesInit();
    expect(j.boards.player1.length).toBeGreaterThan(0);
    expect(j.boards.player2.length).toBeGreaterThan(0);
    expect(j.currentDice).toBeNull();
    expect(s.hands.player1).toHaveLength(7);
    expect(s.hands.player2).toHaveLength(7);
    expect(s.currentDice).toBeNull();
    expect(s.selectedDomino).toBeNull();
  });

  it('opponent helpers agree across engines', () => {
    expect(juggleOpponent('player1')).toBe('player2');
    expect(sdOpponent('player1')).toBe('player2');
    expect(juggleOpponent('player2')).toBe(sdOpponent('player2'));
    expect(juggleOpponent('player2')).toBe('player1');
  });

  it('phase invariant: neither starts selecting/placing', () => {
    const j = juggleInit();
    const s = sumDominoesInit();
    expect(j.phase).not.toBe('selectingShape');
    expect(j.phase).not.toBe('placing');
    expect(s.phase).not.toBe('placing');
    expect(s.phase).not.toBe('selecting');
  });
});
