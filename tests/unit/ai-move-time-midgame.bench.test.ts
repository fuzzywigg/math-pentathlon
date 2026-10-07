/**
 * Unit-level AI think-time bench: every game × easy/medium/hard on hand-built
 * mid-game states. Writes docs/ai-move-time-2026-10-07.md (p50/p95).
 *
 * Run: npx vitest run tests/unit/ai-move-time-midgame.bench.test.ts
 */
import { describe, it, expect, afterEach } from 'vitest';
import { writeFileSync } from 'node:fs';
import { createSeededRng } from '../../src/core/ai-worker/seeded-rng';

import { createInitialState as createCalla } from '../../src/games/calla/types';
import { makeMove as callaMove, getValidPits } from '../../src/games/calla/rules';
import { getAIMove as callaAI } from '../../src/games/calla/ai';

import { createInitialState as createHex } from '../../src/games/hex/types';
import { makeMove as hexMove } from '../../src/games/hex/rules';
import {
  searchBestMove as hexSearch,
  AI_PLAY_DEADLINE_MS as HEX_MS,
  type AIDifficulty,
} from '../../src/games/hex/ai';

import { createInitialState as createQueens } from '../../src/games/queens-guards/types';
import {
  searchAIMove as queensSearch,
  applyAIMove as queensApply,
  AI_PLAY_DEADLINE_MS as QUEENS_MS,
} from '../../src/games/queens-guards/ai';

import { createInitialState as createFab } from '../../src/games/fab-a-diffy/rules';
import {
  searchAIMove as fabSearch,
  applyAIMoveSteps as fabApply,
  AI_PLAY_DEADLINE_MS as FAB_MS,
} from '../../src/games/fab-a-diffy/ai';

import { createInitialState as createFiar } from '../../src/games/fiar/types';
import { placeChip as fiarPlace } from '../../src/games/fiar/rules';
import { searchAIMove as fiarSearch } from '../../src/games/fiar/ai';
import { placeToMovement } from './fiar-test-helpers';

import { createInitialGameState as createKings } from '../../src/games/kings-quadraphages/game-state';
import { getAIMove as kingsAI } from '../../src/games/kings-quadraphages/ai';

import { createInitialState as createPent } from '../../src/games/pent-em-in/types';
import { getAIMove as pentAI } from '../../src/games/pent-em-in/ai';

import { createInitialState as createKwatro } from '../../src/games/kwatro-sinko/rules';
import { getAIMove as kwatroAI } from '../../src/games/kwatro-sinko/ai';

import { createInitialState as createStars } from '../../src/games/stars-bars/rules';
import { getAIMove as starsAI } from '../../src/games/stars-bars/ai';

import { createInitialState as createPar } from '../../src/games/par-55/rules';
import { getAIMove as parAI } from '../../src/games/par-55/ai';

import { createInitialState as createRamrod } from '../../src/games/ramrod/rules';
import { getAIMove as ramrodAI } from '../../src/games/ramrod/ai';

import {
  createInitialState as createSum,
  doRollDice as sumRoll,
} from '../../src/games/sum-dominoes/rules';
import { getAIMove as sumAI } from '../../src/games/sum-dominoes/ai';

import {
  createInitialState as createPrime,
  rollDice as primeRoll,
} from '../../src/games/prime-gold/rules';
import { getAIPlacement as primeAI } from '../../src/games/prime-gold/ai';

import { createInitialState as createContig } from '../../src/games/contig-60/types';
import { doRollDice as contigRoll } from '../../src/games/contig-60/rules';
import { getAIPlacement as contigAI } from '../../src/games/contig-60/ai';

import {
  createInitialState as createJuggle,
  doRollDice as juggleRoll,
  selectDie,
  selectShape,
} from '../../src/games/juggle/rules';
import {
  getAIDieChoice,
  getAIShapeChoice,
  getAIPlacement as jugglePlace,
} from '../../src/games/juggle/ai';
import { TETROMINOES } from '../../src/core/polyomino/types';

import { createInitialState as createHag } from '../../src/games/hex-a-gone/types';
import {
  selectBlock as hagSelect,
  commitSelection,
} from '../../src/games/hex-a-gone/rules';
import {
  getAISelection,
  getAIPlacement as hagPlace,
} from '../../src/games/hex-a-gone/ai';

import { createInitialState as createRemainder } from '../../src/games/remainder-islands/types';
import { getAIIslandChoice } from '../../src/games/remainder-islands/ai';

import { createInitialState as createStarTrack } from '../../src/games/star-track/types';
import { drawChains } from '../../src/games/star-track/rules';
import { getAIChainChoice } from '../../src/games/star-track/ai';

import { createInitialState as createFrac } from '../../src/games/frac-fact/types';
import { startGame as fracStart } from '../../src/games/frac-fact/rules';
import { getAIAnswer as fracAI } from '../../src/games/frac-fact/ai';

import { createInitialState as createPinball } from '../../src/games/fraction-pinball/types';
import { startGame as pinballStart } from '../../src/games/fraction-pinball/rules';
import { getAIAnswer as pinballAI } from '../../src/games/fraction-pinball/ai';

const DIFFICULTIES: AIDifficulty[] = ['easy', 'medium', 'hard'];
const SEEDS = [1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29] as const;
const HARD_FLAG_MS = 500;

type BenchCase = {
  game: string;
  scenario: string;
  timed: boolean;
  run: (difficulty: AIDifficulty, seed: number) => void;
};

type StatRow = {
  game: string;
  scenario: string;
  difficulty: AIDifficulty;
  timed: boolean;
  n: number;
  p50: number;
  p95: number;
  max: number;
  flagged: boolean;
};

const stats: StatRow[] = [];

function pct(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((p / 100) * sorted.length) - 1)
  );
  return sorted[idx];
}

function withSeededRandom<T>(seed: number, fn: () => T): T {
  const original = Math.random;
  Math.random = createSeededRng(seed);
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

function timeMs(fn: () => void): number {
  const t0 = performance.now();
  fn();
  return performance.now() - t0;
}

function callaMid() {
  let s = createCalla();
  for (let i = 0; i < 8; i++) {
    const pits = getValidPits(s);
    if (pits.length === 0) break;
    s = callaMove(s, pits[i % pits.length]);
  }
  return s;
}

function hexMid() {
  let s = createHex(11);
  s = hexMove(s, { row: 5, col: 5 });
  s = hexMove(s, { row: 5, col: 6 });
  s = hexMove(s, { row: 4, col: 5 });
  s = hexMove(s, { row: 6, col: 5 });
  s = hexMove(s, { row: 4, col: 6 });
  s = hexMove(s, { row: 6, col: 6 });
  return s;
}

function queensMid() {
  let s = createQueens();
  for (let i = 0; i < 4; i++) {
    const m = queensSearch(s, s.currentPlayer, 'easy', { seed: 10 + i }).move;
    if (!m) break;
    s = queensApply(s, m);
  }
  return s;
}

function fabMid() {
  let s = createFab();
  for (let i = 0; i < 3; i++) {
    const r = fabSearch(s, s.currentPlayer, 'easy', { seed: 20 + i });
    if (!r.move) break;
    s = fabApply(s, r.move);
  }
  return s;
}

function jugglePlacing() {
  return withSeededRandom(42, () => {
    let s = juggleRoll(createJuggle());
    const die = getAIDieChoice(s, 'player1', 'easy');
    if (die) s = selectDie(s, die.index);
    if (s.phase === 'selectingShape') {
      const shape = getAIShapeChoice(s, 'player1', 'easy');
      s = selectShape(s, shape?.shape ?? TETROMINOES[0]);
    }
    return s;
  });
}

function hagPlacing() {
  return withSeededRandom(7, () => {
    let s = createHag();
    const sel = getAISelection(s, 'player1', 'easy');
    if (sel) {
      for (const b of sel.blocks) s = hagSelect(s, b);
      s = commitSelection(s);
    }
    return s;
  });
}

function remainderMid() {
  const base = createRemainder();
  const islands = base.islands.map((isl, i) =>
    i < 4
      ? { ...isl, owner: (i % 2 === 0 ? 'player1' : 'player2') as const }
      : isl
  );
  return {
    ...base,
    islands,
    phase: 'selectIsland' as const,
    currentRoll: { die1: 2, die2: 5, total: 7 },
    validIslands: islands.filter((i) => i.owner === null).map((i) => i.id),
    scores: { player1: 2, player2: 2 },
  };
}

function buildCases(): BenchCase[] {
  const calla = callaMid();
  const hex = hexMid();
  const queens = queensMid();
  const fab = fabMid();
  const fiarPlaceState = fiarPlace(createFiar(), 'c3r3', 'plain');
  const fiarMoveState = placeToMovement();
  const kings = createKings();
  const pent = createPent();
  const kwatro = createKwatro();
  const stars = createStars();
  const par = createPar();
  const ramrod = createRamrod();
  const sum = sumRoll(createSum());
  const prime = primeRoll(createPrime());
  const contig = contigRoll(createContig());
  const juggle = jugglePlacing();
  const hagPlaceState = hagPlacing();
  const rem = remainderMid();
  const starTrack = drawChains(createStarTrack());
  const frac = fracStart(createFrac('medium'));
  const pin = pinballStart(createPinball());

  return [
    {
      game: 'calla',
      scenario: 'mid-8ply',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          callaAI(calla, calla.currentPlayer, d);
        });
      },
    },
    {
      game: 'hex',
      scenario: 'mid-6stone',
      timed: true,
      run: (d, seed) => {
        hexSearch(hex, 'player1', d, { seed, deadlineMs: HEX_MS[d] });
      },
    },
    {
      game: 'queens-guards',
      scenario: 'mid-4ply',
      timed: true,
      run: (d, seed) => {
        queensSearch(queens, queens.currentPlayer, d, {
          seed,
          deadlineMs: QUEENS_MS[d],
        });
      },
    },
    {
      game: 'fab-a-diffy',
      scenario: 'mid-3ply',
      timed: true,
      run: (d, seed) => {
        fabSearch(fab, fab.currentPlayer, d, {
          seed,
          deadlineMs: FAB_MS[d],
        });
      },
    },
    {
      game: 'fiar',
      scenario: 'placement-early',
      timed: false,
      run: (d, seed) => {
        fiarSearch(fiarPlaceState, fiarPlaceState.currentPlayer, d, { seed });
      },
    },
    {
      game: 'fiar',
      scenario: 'movement-mid',
      timed: false,
      run: (d, seed) => {
        fiarSearch(fiarMoveState, fiarMoveState.currentPlayer, d, { seed });
      },
    },
    {
      game: 'kings-quadraphages',
      scenario: 'opening-supply',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          kingsAI(kings, 'player2', d);
        });
      },
    },
    {
      game: 'pent-em-in',
      scenario: 'opening-hand',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          pentAI(pent, 'player1', d);
        });
      },
    },
    {
      game: 'kwatro-sinko',
      scenario: 'opening',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          kwatroAI(kwatro, 'player1', d);
        });
      },
    },
    {
      game: 'stars-bars',
      scenario: 'opening',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          starsAI(stars, 'player1', d);
        });
      },
    },
    {
      game: 'par-55',
      scenario: 'opening',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          parAI(par, 'player1', d);
        });
      },
    },
    {
      game: 'ramrod',
      scenario: 'opening',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          ramrodAI(ramrod, 'player1', d);
        });
      },
    },
    {
      game: 'sum-dominoes',
      scenario: 'after-roll',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          sumAI(sum, sum.currentPlayer, d);
        });
      },
    },
    {
      game: 'prime-gold',
      scenario: 'after-roll',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          primeAI(prime, prime.currentPlayer, d);
        });
      },
    },
    {
      game: 'contig-60',
      scenario: 'after-roll',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          contigAI(contig, contig.currentPlayer, d);
        });
      },
    },
    {
      game: 'juggle',
      scenario: 'placing',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          jugglePlace(juggle, juggle.currentPlayer, d);
        });
      },
    },
    {
      game: 'hex-a-gone',
      scenario: 'placing',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          hagPlace(hagPlaceState, hagPlaceState.currentPlayer, d);
        });
      },
    },
    {
      game: 'hex-a-gone',
      scenario: 'selection',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          getAISelection(createHag(), 'player1', d);
        });
      },
    },
    {
      game: 'remainder-islands',
      scenario: 'select-mid',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          getAIIslandChoice(rem, rem.currentPlayer, d);
        });
      },
    },
    {
      game: 'star-track',
      scenario: 'select-chain',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          getAIChainChoice(starTrack, starTrack.currentPlayer, d);
        });
      },
    },
    {
      game: 'frac-fact',
      scenario: 'answer',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          fracAI(frac, frac.currentPlayer, d);
        });
      },
    },
    {
      game: 'fraction-pinball',
      scenario: 'answer',
      timed: false,
      run: (d, seed) => {
        withSeededRandom(seed, () => {
          pinballAI(pin, pin.currentPlayer, d);
        });
      },
    },
  ];
}

function writeReport(rows: StatRow[]): void {
  const flagged = rows.filter((r) => r.flagged);
  const lines: string[] = [];
  lines.push('# AI move think-time — 2026-10-07');
  lines.push('');
  lines.push('Unit-level bench (no browser) over hand-built mid-game states.');
  lines.push('');
  lines.push('## Method');
  lines.push('');
  lines.push('- Samples: 11 seeded trials per game × difficulty × scenario');
  lines.push('- Percentiles: p50 / p95 of wall `performance.now()` ms');
  lines.push(
    '- Timed engines (`hex`, `queens-guards`, `fab-a-diffy`): play budget `AI_PLAY_DEADLINE_MS[difficulty]`'
  );
  lines.push(
    '- Other engines: sync chooser with seeded `Math.random` (mulberry32)'
  );
  lines.push(`- Hard flag threshold: **p95 > ${HARD_FLAG_MS}ms**`);
  lines.push('');
  lines.push('## Hard flags');
  lines.push('');
  if (flagged.length === 0) {
    lines.push(
      `None — every Hard scenario has p95 ≤ ${HARD_FLAG_MS}ms after remediation.`
    );
  } else {
    for (const f of flagged) {
      lines.push(
        `- **${f.game}** / ${f.scenario}: Hard p95=${f.p95.toFixed(1)}ms`
      );
    }
  }
  lines.push('');
  lines.push('## Remediation (this change)');
  lines.push('');
  lines.push(
    '- **hex** / **queens-guards**: Hard `AI_PLAY_DEADLINE_MS` lowered to **450ms** (≤500ms wall target with abort slack).'
  );
  lines.push(
    '- Hand-built mid-game Hard moves stay identical to unlimited Hard search (asserted in `ai-hard-midgame-identity.test.ts`).'
  );
  lines.push('- No rules or scoring changes.');
  lines.push('');
  lines.push('## Results');
  lines.push('');
  lines.push(
    '| Game | Scenario | Diff | Timed | n | p50 (ms) | p95 (ms) | max (ms) | Hard flag |'
  );
  lines.push(
    '| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |'
  );
  for (const r of rows) {
    lines.push(
      `| ${r.game} | ${r.scenario} | ${r.difficulty} | ${r.timed ? 'yes' : 'no'} | ${r.n} | ${r.p50.toFixed(1)} | ${r.p95.toFixed(1)} | ${r.max.toFixed(1)} | ${r.flagged ? 'YES' : ''} |`
    );
  }
  lines.push('');
  lines.push('## Mid-game state recipes');
  lines.push('');
  lines.push('| Game | Recipe |');
  lines.push('| --- | --- |');
  lines.push('| calla | 8 plies via `getValidPits()[i%n]` |');
  lines.push('| hex | 6 fixed center stones |');
  lines.push('| queens-guards | 4× easy `applyAIMove` |');
  lines.push('| fab-a-diffy | 3× easy `applyAIMoveSteps` |');
  lines.push('| fiar | early placement + `placeToMovement` |');
  lines.push('| juggle / hex-a-gone | walk to placing phase |');
  lines.push('| remainder-islands | forged mid ownership + roll |');
  lines.push('| dice games | after forced roll |');
  lines.push('| quiz games | `startGame` answering |');
  lines.push('| others | opening hand / supply (stable mid chooser) |');
  lines.push('');

  writeFileSync('/workspace/docs/ai-move-time-2026-10-07.md', lines.join('\n'));
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('AI move-time mid-game bench (all games × difficulties)', () => {
  it('measures p50/p95 and writes docs/ai-move-time-2026-10-07.md', () => {
    const cases = buildCases();
    for (const c of cases) {
      for (const difficulty of DIFFICULTIES) {
        const samples: number[] = [];
        for (const seed of SEEDS) {
          samples.push(timeMs(() => c.run(difficulty, seed)));
        }
        const sorted = [...samples].sort((a, b) => a - b);
        const p50 = pct(sorted, 50);
        const p95 = pct(sorted, 95);
        const max = sorted[sorted.length - 1] ?? 0;
        const flagged = difficulty === 'hard' && p95 > HARD_FLAG_MS;
        stats.push({
          game: c.game,
          scenario: c.scenario,
          difficulty,
          timed: c.timed,
          n: samples.length,
          p50,
          p95,
          max,
          flagged,
        });
        // eslint-disable-next-line no-console
        console.log(
          `[ai-time] ${c.game.padEnd(18)} ${c.scenario.padEnd(16)} ${difficulty.padEnd(6)} p50=${p50.toFixed(1)} p95=${p95.toFixed(1)}${flagged ? ' << FLAG' : ''}`
        );
      }
    }

    writeReport(stats);

    expect(stats.length).toBe(cases.length * DIFFICULTIES.length);
    const hardFlags = stats.filter((r) => r.flagged);
    expect(hardFlags).toEqual([]);
  }, 600_000);
});
