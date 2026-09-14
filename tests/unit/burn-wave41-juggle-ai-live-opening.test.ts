/**
 * Wave 41 — Juggle AI live-opening difficulty divergence leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  createInitialState,
  doRollDice,
  selectDie,
} from '../../src/games/juggle/rules';
import {
  getAIDieChoice,
  getAIShapeChoice,
  getAIPlacement,
  type AIDifficulty,
} from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

const DIFFS: AIDifficulty[] = ['easy', 'medium', 'hard'];

describe('Wave 41 Juggle AI — live opening non-null when legal', () => {
  it('getAIDieChoice returns 0|1 for easy/medium/hard on opening roll', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.4);
    const rolled = doRollDice(createInitialState());
    expect(rolled.phase).toBe('selectingShape');
    for (const d of DIFFS) {
      const choice = getAIDieChoice(rolled, 'player1', d);
      expect(choice).not.toBeNull();
      expect([0, 1]).toContain(choice!.index);
    }
  });

  it('getAIShapeChoice non-null after multi-shape die, or auto-placed for singles', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    let state = doRollDice(createInitialState());
    state = {
      ...state,
      currentDice: [4, 4],
      phase: 'selectingShape',
      selectedCategory: null,
      selectedShape: null,
    };
    for (const d of DIFFS) {
      const die = getAIDieChoice(state, 'player1', d);
      expect(die).not.toBeNull();
      const after = selectDie(state, die!.index);
      if (after.phase === 'placing') {
        expect(after.selectedShape).not.toBeNull();
        continue;
      }
      const shape = getAIShapeChoice(after, 'player1', d);
      expect(shape).not.toBeNull();
      expect(shape!.shape.id).toBeTruthy();
      expect(shape!.shape.size).toBe(4);
    }
  });

  it('getAIPlacement non-null once monomino auto-enters placing', () => {
    let state = {
      ...createInitialState(),
      currentDice: [1, 2] as [number, number],
      phase: 'selectingShape' as const,
    };
    state = selectDie(state, 0);
    expect(state.phase).toBe('placing');
    expect(state.selectedShape).not.toBeNull();
    for (const d of DIFFS) {
      const place = getAIPlacement(state, 'player1', d);
      expect(place).not.toBeNull();
      expect(place!.position.row).toBeGreaterThanOrEqual(0);
      expect(place!.position.col).toBeGreaterThanOrEqual(0);
      expect([0, 90, 180, 270]).toContain(place!.rotation);
      expect(typeof place!.flipped).toBe('boolean');
    }
  });

  it('getAIDieChoice nulls once category already chosen', () => {
    const state = {
      ...createInitialState(),
      currentDice: [3, 4] as [number, number],
      phase: 'selectingShape' as const,
      selectedCategory: 'tromino' as const,
    };
    expect(getAIDieChoice(state, 'player1', 'hard')).toBeNull();
  });
});
