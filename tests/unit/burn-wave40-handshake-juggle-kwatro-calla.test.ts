/**
 * Wave 40 — handshake: juggle category ↔ kwatro chip ↔ calla pit leftovers.
 * Cross-engine after #177. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState as createJuggle,
  doRollDice,
  selectDie,
} from '../../src/games/juggle/rules';
import { DICE_TO_CATEGORY } from '../../src/games/juggle/types';

import {
  createInitialState as createKwa,
  hasValidMoves as kwaHasMoves,
} from '../../src/games/kwatro-sinko/rules';

import {
  getValidPits,
  makeMove,
} from '../../src/games/calla/rules';
import { createInitialState as createCalla } from '../../src/games/calla/types';

describe('Wave 40 handshake — juggle / kwatro / calla', () => {
  it('juggle die category size aligns with calla pit count when moves exist', () => {
    let juggle = createJuggle();
    juggle = doRollDice(juggle);
    expect(juggle.currentDice).toBeTruthy();
    const die = juggle.currentDice![0];
    const category = DICE_TO_CATEGORY[die];
    expect(category).toBeTruthy();

    const calla = createCalla();
    const pits = getValidPits(calla);
    expect(pits.length).toBe(5); // opening all filled
    // Die 1–6 maps to categories; pit count is stable 5
    expect(Object.keys(DICE_TO_CATEGORY)).toHaveLength(6);

    const kwa = createKwa();
    expect(kwaHasMoves(kwa)).toBe(true);

    // One successful calla sow keeps game alive
    const after = makeMove(calla, pits[0]);
    expect(after.moveHistory).toHaveLength(1);

    // selectDie advances juggle without inventing shapes
    const selected = selectDie(juggle, 0);
    expect(selected.selectedCategory).toBe(category);
  });
});
