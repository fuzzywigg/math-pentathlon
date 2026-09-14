/**
 * Wave 31 — checkWinCondition type matrix (target / exact / highest / lowest).
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';

import {
  createScoringState,
  addScore,
  setScore,
  checkWinCondition,
  addPlayer,
} from '../../src/core/timer-scoring';

describe('Wave 31 scoring — target winCondition', () => {
  it('returns first player in roster order who reaches threshold', () => {
    let state = createScoringState(
      { winCondition: { type: 'target', value: 10 } },
      ['p1', 'p2', 'p3']
    );
    state = setScore(state, 'p2', 10);
    state = setScore(state, 'p3', 15);
    // iteration order is players array order; p1 still 0
    expect(checkWinCondition(state)).toBe('p2');

    state = setScore(state, 'p1', 10);
    expect(checkWinCondition(state)).toBe('p1');
  });

  it('requires value >= target; below stays null', () => {
    let state = createScoringState(
      { winCondition: { type: 'target', value: 100 } },
      ['p1']
    );
    state = addScore(state, 'p1', 99);
    expect(checkWinCondition(state)).toBeNull();
    state = addScore(state, 'p1', 1);
    expect(checkWinCondition(state)).toBe('p1');
  });

  it('returns null when target value is missing', () => {
    let state = createScoringState({ winCondition: { type: 'target' } }, [
      'p1',
    ]);
    state = setScore(state, 'p1', 999);
    expect(checkWinCondition(state)).toBeNull();
  });
});

describe('Wave 31 scoring — exact winCondition', () => {
  it('wins only on exact equality', () => {
    let state = createScoringState(
      { winCondition: { type: 'exact', value: 12 } },
      ['p1', 'p2']
    );
    state = setScore(state, 'p1', 11);
    expect(checkWinCondition(state)).toBeNull();
    state = setScore(state, 'p1', 13);
    expect(checkWinCondition(state)).toBeNull();
    state = setScore(state, 'p1', 12);
    expect(checkWinCondition(state)).toBe('p1');
  });

  it('first matching player in roster wins when several exact', () => {
    let state = createScoringState(
      { winCondition: { type: 'exact', value: 5 } },
      ['a', 'b']
    );
    state = setScore(state, 'a', 5);
    state = setScore(state, 'b', 5);
    expect(checkWinCondition(state)).toBe('a');
  });
});

describe('Wave 31 scoring — highest/lowest are not live win checks', () => {
  it('checkWinCondition returns null for highest and lowest', () => {
    for (const type of ['highest', 'lowest'] as const) {
      let state = createScoringState({ winCondition: { type } }, ['p1', 'p2']);
      state = setScore(state, 'p1', 100);
      state = setScore(state, 'p2', 1);
      expect(checkWinCondition(state)).toBeNull();
    }
  });

  it('returns null when winCondition absent', () => {
    let state = createScoringState({}, ['p1']);
    state = addScore(state, 'p1', 50);
    expect(checkWinCondition(state)).toBeNull();
  });
});

describe('Wave 31 scoring — win after late seat join', () => {
  it('new player can become the first target winner', () => {
    let state = createScoringState({
      winCondition: { type: 'target', value: 7 },
    });
    state = addPlayer(state, 'early', 'Early');
    state = addScore(state, 'early', 3);
    expect(checkWinCondition(state)).toBeNull();
    state = addPlayer(state, 'late', 'Late');
    state = addScore(state, 'late', 7);
    expect(checkWinCondition(state)).toBe('late');
  });
});
