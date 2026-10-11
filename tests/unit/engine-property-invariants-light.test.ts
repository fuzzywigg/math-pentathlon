/**
 * Engine property invariants — light game group (q-mp-1351).
 * Same playout / validator assertions as the pre-shard suite for:
 * calla, frac-fact, fraction-pinball, hex, hex-a-gone, kings-quadraphages,
 * remainder-islands, star-track — plus hex strict-alternation.
 */
import { describe, it, expect } from 'vitest';

import { ALL_GAME_ADAPTERS } from './helpers/state-roundtrip-games';
import {
  PROPERTY_SEEDS,
  PROPERTY_MAX_PLIES,
  LEGAL_SAMPLE_CAP,
  runPropertyPlayout,
  assertHexStrictAlternation,
} from './helpers/engine-property-invariants';
import {
  ENGINE_PROPERTY_LIGHT_IDS,
  adaptersByIds,
} from './helpers/engine-property-invariants-groups';

import { mulberry32, pick } from './engine-invariants-helpers';
import { createRng } from './helpers/state-roundtrip';

import {
  isValidMove as hexIsValid,
  getValidMoves as hexLegal,
  makeMove as hexMake,
} from '../../src/games/hex/rules';
import { createInitialState as createHex } from '../../src/games/hex/types';

import {
  canPlaceAt as hagCanPlace,
  getValidPlacements as hagPlacements,
  selectBlock as hagSelect,
  commitSelection,
  placeBlock as hagPlace,
  passTurn as hagPass,
  canPlayerMove as hagCanMove,
  isGameOver as hagIsOver,
} from '../../src/games/hex-a-gone/rules';
import {
  createInitialState as createHag,
  getAvailableShapes,
} from '../../src/games/hex-a-gone/types';

const LIGHT = adaptersByIds(ENGINE_PROPERTY_LIGHT_IDS);

describe('Engine property invariants — seeded playouts (light games)', () => {
  for (const adapter of LIGHT) {
    it(`${adapter.id}: legal / valid / turn / undo / game-over / round-trip`, () => {
      for (const seed of PROPERTY_SEEDS) {
        const result = runPropertyPlayout(adapter, seed, {
          maxPlies: Math.min(adapter.maxMoves, PROPERTY_MAX_PLIES),
          legalSampleCap: LEGAL_SAMPLE_CAP,
        });
        expect(result.movesPlayed).toBeGreaterThanOrEqual(0);
      }
    });
  }

  it('hex: seat strictly alternates until terminal', () => {
    const hex = ALL_GAME_ADAPTERS.find((a) => a.id === 'hex');
    expect(hex).toBeDefined();
    for (const seed of PROPERTY_SEEDS) {
      assertHexStrictAlternation(hex!, seed);
    }
  });
});

describe('Engine property invariants — legal ⊆ validator (light secondary)', () => {
  it('hex: getValidMoves ⊆ isValidMove under random play', () => {
    for (const seed of PROPERTY_SEEDS) {
      const rng = mulberry32(seed);
      let state = createHex(5);
      for (let i = 0; i < 20 && !state.winner; i++) {
        const moves = hexLegal(state);
        for (const m of moves) {
          expect(hexIsValid(state, m)).toBe(true);
        }
        if (moves.length === 0) break;
        state = hexMake(state, pick(rng, moves));
      }
    }
  });

  it('hex-a-gone: getValidPlacements ⊆ canPlaceAt under random play', () => {
    for (const seed of PROPERTY_SEEDS) {
      const rng = createRng(seed);
      let state = createHag();
      for (let i = 0; i < 24 && !hagIsOver(state); i++) {
        if (state.phase === 'selectBlocks') {
          const available = getAvailableShapes(state);
          if (available.length === 0 || !hagCanMove(state)) {
            state = hagPass(state);
            continue;
          }
          const shape = pick(rng, available);
          state = hagSelect(state, shape);
          if (state.turnSelection.blocks.length > 0) {
            state = commitSelection(state);
          }
          continue;
        }
        const spots = hagPlacements(state);
        for (const p of spots) {
          expect(hagCanPlace(state, p.q, p.r)).toBe(true);
        }
        if (spots.length === 0) break;
        const choice = pick(rng, spots);
        state = hagPlace(state, choice.q, choice.r);
      }
    }
  });
});
