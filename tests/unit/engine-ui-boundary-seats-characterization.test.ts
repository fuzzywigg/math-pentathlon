/**
 * burn-1008-mp-engine-ui-boundary-repair — characterization + enforcement.
 *
 * Tip folded #518 with getOpponentSeat living briefly in `ui/seat-labels`, which
 * made engine `types.ts` / `rules.ts` import UI and broke `engine_imports_ui: 0`.
 * The pure flip now lives in `core/seats`; UI re-exports for display callers only.
 *
 * This suite pins identical seat-flip semantics (before = local ternary /
 * after = core/seats) and fails if the import-graph audit reports any engine→ui.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  getOpponentSeat,
  type SeatId,
} from '../../src/core/seats';
import { getOpponentSeat as uiReexportOpponentSeat } from '../../src/ui/seat-labels';
import { auditBoundaries } from '../../scripts/check-boundaries.mjs';

import { getOpponent as contigOpp } from '../../src/games/contig-60/types';
import { getOpponent as juggleOpp } from '../../src/games/juggle/types';
import { getOpponent as sumOpp } from '../../src/games/sum-dominoes/types';
import { getOpponent as fabOpp } from '../../src/games/fab-a-diffy/types';
import { getOpponent as fiarOpp } from '../../src/games/fiar/types';
import { getOpponent as fracOpp } from '../../src/games/frac-fact/types';
import { getOpponent as pinballOpp } from '../../src/games/fraction-pinball/types';
import { getOpponent as kwaOpp } from '../../src/games/kwatro-sinko/types';
import { getOpponent as parOpp } from '../../src/games/par-55/types';
import { getOpponent as pentOpp } from '../../src/games/pent-em-in/types';
import { getOpponent as qgOpp } from '../../src/games/queens-guards/types';
import { getOpponent as ramrodOpp } from '../../src/games/ramrod/types';
import { getOpponent as remOpp } from '../../src/games/remainder-islands/types';
import { getOpponent as callaOpp } from '../../src/games/calla/types';
import { getOpponent as hexOpp } from '../../src/games/hex/types';
import { getOpponent as hexAGoneOpp } from '../../src/games/hex-a-gone/types';
import { getOpponent as starTrackOpp } from '../../src/games/star-track/types';
import { getOpponent as kingsOpp } from '../../src/games/kings-quadraphages/rules';

/** Historical local helper semantics (pre-dedupe / pre-core move). */
function legacyGetOpponent(player: SeatId): SeatId {
  return player === 'player1' ? 'player2' : 'player1';
}

const SEATS: SeatId[] = ['player1', 'player2'];

type OppFn = (player: SeatId) => SeatId;

const GAME_OPPONENTS: [string, OppFn][] = [
  ['calla', callaOpp],
  ['contig-60', contigOpp],
  ['fab-a-diffy', fabOpp],
  ['fiar', fiarOpp],
  ['frac-fact', fracOpp],
  ['fraction-pinball', pinballOpp],
  ['hex', hexOpp],
  ['hex-a-gone', hexAGoneOpp],
  ['juggle', juggleOpp],
  ['kings-quadraphages', kingsOpp],
  ['kwatro-sinko', kwaOpp],
  ['par-55', parOpp],
  ['pent-em-in', pentOpp],
  ['queens-guards', qgOpp],
  ['ramrod', ramrodOpp],
  ['remainder-islands', remOpp],
  ['star-track', starTrackOpp],
  ['sum-dominoes', sumOpp],
];

const ENGINE_BASENAMES = new Set([
  'rules.ts',
  'types.ts',
  'board.ts',
  'game-state.ts',
  'serialization.ts',
  'layout.ts',
  'pieces.ts',
]);

const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);

function walkEngineFiles(dir: string, out: string[] = []): string[] {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkEngineFiles(p, out);
    else if (ent.isFile() && ENGINE_BASENAMES.has(ent.name)) out.push(p);
  }
  return out;
}

describe('engine-ui boundary — getOpponentSeat characterization', () => {
  it('core/seats matches legacy ternary for every SeatId', () => {
    for (const seat of SEATS) {
      expect(getOpponentSeat(seat)).toBe(legacyGetOpponent(seat));
    }
  });

  it('ui/seat-labels re-export is identical to core/seats', () => {
    for (const seat of SEATS) {
      expect(uiReexportOpponentSeat(seat)).toBe(getOpponentSeat(seat));
    }
  });

  it.each(GAME_OPPONENTS)(
    '%s getOpponent matches core/seats for every seat',
    (_game, opp) => {
      for (const seat of SEATS) {
        expect(opp(seat)).toBe(getOpponentSeat(seat));
        expect(opp(seat)).toBe(legacyGetOpponent(seat));
      }
    }
  );

  it('covers 18 games that export getOpponent', () => {
    expect(GAME_OPPONENTS).toHaveLength(18);
  });
});

describe('engine-ui boundary — import-graph enforcement', () => {
  it('auditBoundaries reports engine_imports_ui === 0', () => {
    const report = auditBoundaries();
    expect(report.counts.engine_imports_ui).toBe(0);
    const engineUi = report.violations.filter((v) => v.kind === 'engine→ui');
    expect(engineUi).toEqual([]);
  });

  it('no engine rules/types module imports from src/ui/', () => {
    const gamesRoot = path.join(rootDir, 'src/games');
    expect(statSync(gamesRoot).isDirectory()).toBe(true);
    const engineFiles = walkEngineFiles(gamesRoot);
    expect(engineFiles.length).toBeGreaterThan(30);

    const uiImport =
      /from\s+['"](?:\.\.\/)+ui\/[^'"]+['"]|from\s+['"][^'"]*\/ui\/[^'"]+['"]/;
    const offenders: string[] = [];
    for (const file of engineFiles) {
      const text = readFileSync(file, 'utf8');
      if (uiImport.test(text)) {
        offenders.push(path.relative(rootDir, file));
      }
    }
    expect(offenders).toEqual([]);
  });
});
