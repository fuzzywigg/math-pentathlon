/**
 * Report-only microbenchmarks for the non-AI rules engines of all 20 games.
 *
 * Ops: legalMoves, apply, isOver (win/end), roundTrip (serialize/deserialize),
 * and prefix-replay undo/redo (engines have no native undo API; this matches
 * the undo-audit / property-invariants pattern).
 *
 * Positions: seeded opening / midgame / near-end via deterministic playouts
 * on GameFuzzAdapter (tests/unit/helpers/state-roundtrip-games.ts).
 *
 * Does NOT call aiChoice / search / eval. Does NOT change engine logic.
 *
 * Run: npm run bench:engines
 * Writes: docs/engine-bench-YYYY-MM-DD.{md,json}
 */
import { describe, it, expect } from 'vitest';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { ALL_GAME_ADAPTERS } from '../unit/helpers/state-roundtrip-games';
import type { GameFuzzAdapter } from '../unit/helpers/state-roundtrip-games';
import {
  createRng,
  pickOne,
  withSeededMathRandom,
} from '../unit/helpers/state-roundtrip';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const REPORT_DATE = '2026-10-08';
const OUT_MD = join(ROOT, 'docs', `engine-bench-${REPORT_DATE}.md`);
const OUT_JSON = join(ROOT, 'docs', `engine-bench-${REPORT_DATE}.json`);

/** Fixed play seed — reproducible across machines. */
const PLAY_SEED = 20_261_008;

/** Target wall time per timed sample (ms). */
const MEASURE_MS = 120;
/** Warmup budget before measuring (ms). */
const WARMUP_MS = 40;
const MIN_ITERS = 32;
const MAX_ITERS = 50_000;

type PositionKind = 'opening' | 'midgame' | 'near-end';
type OpName =
  | 'legalMoves'
  | 'apply'
  | 'isOver'
  | 'serialize'
  | 'undo'
  | 'redo';

interface TimedSample {
  op: OpName;
  iters: number;
  totalMs: number;
  nsPerOp: number;
  opsPerSec: number;
  /** False when the op cannot run at this position (e.g. no legal move). */
  available: boolean;
  note?: string;
}

interface PositionReport {
  kind: PositionKind;
  ply: number;
  legalCount: number;
  isOver: boolean;
  samples: TimedSample[];
}

interface GameReport {
  id: string;
  positions: PositionReport[];
}

interface BenchReport {
  taskId: string;
  date: string;
  seed: number;
  measureMs: number;
  warmupMs: number;
  method: string[];
  games: GameReport[];
  hotspots: Hotspot[];
}

interface Hotspot {
  rank: number;
  game: string;
  position: PositionKind;
  op: OpName;
  nsPerOp: number;
  opsPerSec: number;
  ply: number;
}

interface BuiltPosition {
  kind: PositionKind;
  state: unknown;
  /** Moves applied from the seeded initial create to reach `state`. */
  applied: unknown[];
  ply: number;
}

function nowMs(): number {
  return performance.now();
}

function timeOp(
  fn: () => void,
  available: boolean,
  note?: string
): Omit<TimedSample, 'op'> {
  if (!available) {
    return {
      iters: 0,
      totalMs: 0,
      nsPerOp: 0,
      opsPerSec: 0,
      available: false,
      note,
    };
  }

  // Warmup
  const warmEnd = nowMs() + WARMUP_MS;
  let warmIters = 0;
  while (nowMs() < warmEnd || warmIters < 8) {
    fn();
    warmIters++;
  }

  // Measure
  let iters = 0;
  const t0 = nowMs();
  let elapsed = 0;
  while (iters < MAX_ITERS && (elapsed < MEASURE_MS || iters < MIN_ITERS)) {
    fn();
    iters++;
    elapsed = nowMs() - t0;
  }
  const totalMs = Math.max(elapsed, Number.EPSILON);
  const nsPerOp = (totalMs * 1e6) / iters;
  const opsPerSec = iters / (totalMs / 1000);
  return {
    iters,
    totalMs,
    nsPerOp,
    opsPerSec,
    available: true,
    note,
  };
}

function midPlyTarget(adapter: GameFuzzAdapter): number {
  return Math.max(4, Math.min(10, Math.floor(adapter.maxMoves / 2)));
}

function nearPlyTarget(adapter: GameFuzzAdapter): number {
  return Math.max(8, Math.min(adapter.maxMoves, 22));
}

/**
 * Build opening / midgame / near-end from one seeded playout.
 * Near-end stops at terminal or nearPlyTarget — whichever comes first.
 */
function buildPositions(
  adapter: GameFuzzAdapter,
  playSeed: number
): BuiltPosition[] {
  const rng = createRng(playSeed);
  const initial = withSeededMathRandom(playSeed, () => adapter.create());
  const applied: unknown[] = [];
  let state: unknown = initial;

  const snapshots: BuiltPosition[] = [
    { kind: 'opening', state: initial, applied: [], ply: 0 },
  ];

  const midAt = midPlyTarget(adapter);
  const nearAt = nearPlyTarget(adapter);
  let midCaptured = false;

  for (let ply = 0; ply < nearAt; ply++) {
    if (adapter.isOver(state)) break;
    const legal = adapter.legalMoves(state);
    if (legal.length === 0) break;

    const choice = pickOne(rng, legal);
    state = withSeededMathRandom(playSeed + ply + 1, () =>
      adapter.apply(state, choice)
    );
    applied.push(choice);

    if (!midCaptured && applied.length >= midAt) {
      snapshots.push({
        kind: 'midgame',
        state,
        applied: [...applied],
        ply: applied.length,
      });
      midCaptured = true;
    }
  }

  if (!midCaptured) {
    // Short / stuck playout — deepest reached state stands in for midgame.
    snapshots.push({
      kind: 'midgame',
      state,
      applied: [...applied],
      ply: applied.length,
    });
  }

  snapshots.push({
    kind: 'near-end',
    state,
    applied: [...applied],
    ply: applied.length,
  });

  return snapshots;
}

function replayFromInitial(
  adapter: GameFuzzAdapter,
  playSeed: number,
  moves: unknown[]
): unknown {
  let state = withSeededMathRandom(playSeed, () => adapter.create());
  for (let i = 0; i < moves.length; i++) {
    state = withSeededMathRandom(playSeed + i + 1, () =>
      adapter.apply(state, moves[i])
    );
  }
  return state;
}

function measurePosition(
  adapter: GameFuzzAdapter,
  playSeed: number,
  pos: BuiltPosition
): PositionReport {
  const legal = adapter.legalMoves(pos.state);
  const over = adapter.isOver(pos.state);
  const samples: TimedSample[] = [];

  // legalMoves
  {
    const s = pos.state;
    const timed = timeOp(() => {
      adapter.legalMoves(s);
    }, true);
    samples.push({ op: 'legalMoves', ...timed });
  }

  // apply — first legal move, re-applied to the same base state each iter
  {
    const move = legal[0];
    const base = pos.state;
    const timed = timeOp(
      () => {
        adapter.apply(base, move);
      },
      legal.length > 0,
      legal.length === 0 ? 'no legal moves' : undefined
    );
    samples.push({ op: 'apply', ...timed });
  }

  // isOver / win-end detection
  {
    const s = pos.state;
    const timed = timeOp(() => {
      adapter.isOver(s);
    }, true);
    samples.push({ op: 'isOver', ...timed });
  }

  // serialize / deserialize via adapter.roundTrip
  {
    const s = pos.state;
    const timed = timeOp(() => {
      adapter.roundTrip(s);
    }, true);
    samples.push({ op: 'serialize', ...timed });
  }

  // undo / redo via prefix replay (no native engine undo)
  {
    const canUndo = pos.applied.length > 0;
    const prefix = pos.applied.slice(0, -1);
    const last = pos.applied[pos.applied.length - 1];

    const undoTimed = timeOp(
      () => {
        replayFromInitial(adapter, playSeed, prefix);
      },
      canUndo,
      canUndo ? 'prefix-replay' : 'opening / no history'
    );
    samples.push({ op: 'undo', ...undoTimed });

    const redoTimed = timeOp(
      () => {
        const undone = replayFromInitial(adapter, playSeed, prefix);
        adapter.apply(undone, last);
      },
      canUndo,
      canUndo ? 'prefix-replay+reapply' : 'opening / no history'
    );
    samples.push({ op: 'redo', ...redoTimed });
  }

  return {
    kind: pos.kind,
    ply: pos.ply,
    legalCount: legal.length,
    isOver: over,
    samples,
  };
}

function collectHotspots(games: GameReport[], topN = 5): Hotspot[] {
  const rows: Hotspot[] = [];
  for (const g of games) {
    for (const p of g.positions) {
      for (const s of p.samples) {
        if (!s.available) continue;
        // Undo/redo cost scales with ply depth by construction; still useful
        // as a hotspot signal for deep prefix replay.
        rows.push({
          rank: 0,
          game: g.id,
          position: p.kind,
          op: s.op,
          nsPerOp: s.nsPerOp,
          opsPerSec: s.opsPerSec,
          ply: p.ply,
        });
      }
    }
  }
  rows.sort((a, b) => b.nsPerOp - a.nsPerOp);
  return rows.slice(0, topN).map((r, i) => ({ ...r, rank: i + 1 }));
}

function fmtNs(ns: number): string {
  if (!Number.isFinite(ns) || ns <= 0) return '—';
  if (ns >= 1e6) return `${(ns / 1e6).toFixed(2)} ms`;
  if (ns >= 1e3) return `${(ns / 1e3).toFixed(1)} µs`;
  return `${ns.toFixed(0)} ns`;
}

function fmtOps(ops: number): string {
  if (!Number.isFinite(ops) || ops <= 0) return '—';
  if (ops >= 1e6) return `${(ops / 1e6).toFixed(2)} M/s`;
  if (ops >= 1e3) return `${(ops / 1e3).toFixed(1)} k/s`;
  return `${ops.toFixed(0)} /s`;
}

function sampleFor(
  pos: PositionReport,
  op: OpName
): TimedSample | undefined {
  return pos.samples.find((s) => s.op === op);
}

function cell(pos: PositionReport | undefined, op: OpName): string {
  if (!pos) return '—';
  const s = sampleFor(pos, op);
  if (!s || !s.available) return 'n/a';
  return fmtNs(s.nsPerOp);
}

function writeReports(report: BenchReport): void {
  mkdirSync(dirname(OUT_MD), { recursive: true });
  writeFileSync(OUT_JSON, JSON.stringify(report, null, 2) + '\n');

  const lines: string[] = [];
  lines.push(`# Rules-engine microbench — ${report.date}`);
  lines.push('');
  lines.push(`Task: \`${report.taskId}\``);
  lines.push('');
  lines.push('## Method');
  lines.push('');
  for (const m of report.method) lines.push(`- ${m}`);
  lines.push('');
  lines.push(
    `Seed \`${report.seed}\`; warmup ~${report.warmupMs} ms; measure ~${report.measureMs} ms per sample (min ${MIN_ITERS} iters).`
  );
  lines.push('');
  lines.push('## Top-5 hotspots (highest ns/op)');
  lines.push('');
  lines.push('| Rank | Game | Position | Op | ns/op | ops/s | ply |');
  lines.push('|---:|---|---|---|---:|---:|---:|');
  for (const h of report.hotspots) {
    lines.push(
      `| ${h.rank} | ${h.game} | ${h.position} | ${h.op} | ${fmtNs(h.nsPerOp)} | ${fmtOps(h.opsPerSec)} | ${h.ply} |`
    );
  }
  lines.push('');
  lines.push('## Full results (ns/op)');
  lines.push('');
  lines.push(
    '| Game | Pos | ply | legal# | over | legalMoves | apply | isOver | serialize | undo | redo |'
  );
  lines.push('|---|---|---:|---:|:---:|---:|---:|---:|---:|---:|---:|');

  for (const g of report.games) {
    for (const p of g.positions) {
      lines.push(
        `| ${g.id} | ${p.kind} | ${p.ply} | ${p.legalCount} | ${p.isOver ? 'Y' : ''} | ${cell(p, 'legalMoves')} | ${cell(p, 'apply')} | ${cell(p, 'isOver')} | ${cell(p, 'serialize')} | ${cell(p, 'undo')} | ${cell(p, 'redo')} |`
      );
    }
  }

  lines.push('');
  lines.push('## Notes');
  lines.push('');
  lines.push(
    '- Undo/redo measure **prefix-replay** cost (no native engine undo API). Cost grows with ply depth.'
  );
  lines.push(
    '- `serialize` is `adapter.roundTrip` (Map/Set-aware JSON, or kings dedicated codec).'
  );
  lines.push(
    '- Report-only: not gated in CI. Re-run with `npm run bench:engines`.'
  );
  lines.push('');
  lines.push(`Machine-readable twin: [\`engine-bench-${REPORT_DATE}.json\`](./engine-bench-${REPORT_DATE}.json)`);
  lines.push('');

  writeFileSync(OUT_MD, lines.join('\n'));
}

describe('Rules-engine microbench (all 20 games)', () => {
  it(
    'times legalMoves/apply/isOver/serialize/undo/redo and writes docs summary',
    () => {
      expect(ALL_GAME_ADAPTERS).toHaveLength(20);

      const games: GameReport[] = [];
      for (const adapter of ALL_GAME_ADAPTERS) {
        const positions = buildPositions(adapter, PLAY_SEED);
        const measured = positions.map((p) =>
          measurePosition(adapter, PLAY_SEED, p)
        );
        games.push({ id: adapter.id, positions: measured });
        // eslint-disable-next-line no-console
        console.log(
          `[engine-bench] ${adapter.id.padEnd(20)} plies=${measured.map((m) => `${m.kind}:${m.ply}`).join(' ')}`
        );
      }

      const hotspots = collectHotspots(games, 5);
      const report: BenchReport = {
        taskId: 'burn-1008-mp-engine-bench',
        date: REPORT_DATE,
        seed: PLAY_SEED,
        measureMs: MEASURE_MS,
        warmupMs: WARMUP_MS,
        method: [
          'Reuse GameFuzzAdapter legalMoves/apply/isOver/roundTrip (no AI calls)',
          'Positions from seeded deterministic playouts (opening / midgame / near-end)',
          'Undo/redo = prefix replay from seeded create (undo-audit pattern)',
          'Vitest node project via vitest.engines-bench.config.ts',
        ],
        games,
        hotspots,
      };

      writeReports(report);

      // Sanity: every game produced three positions and at least legalMoves+isOver+serialize
      for (const g of games) {
        expect(g.positions).toHaveLength(3);
        for (const p of g.positions) {
          for (const op of ['legalMoves', 'isOver', 'serialize'] as const) {
            const s = sampleFor(p, op);
            expect(s?.available, `${g.id}/${p.kind}/${op}`).toBe(true);
          }
        }
      }

      // eslint-disable-next-line no-console
      console.log(`[engine-bench] wrote ${OUT_MD}`);
      // eslint-disable-next-line no-console
      console.log(`[engine-bench] wrote ${OUT_JSON}`);
    },
    300_000
  );
});
