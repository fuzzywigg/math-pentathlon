/**
 * Full AI calibration matrix runner.
 * Usage: npx vite-node scripts/run-ai-calibration.ts
 * Env: CALIBRATION_GAMES (default 50)
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ALL_ADAPTERS } from '../tests/helpers/ai-calibration/games';
import {
  aiVsAiMatchups,
  aiVsRandomMatchups,
  detectFlags,
  formatStats,
  runMatchup,
} from '../tests/helpers/ai-calibration/matrix';
import type {
  CalibrationFlag,
  Difficulty,
  MatchupStats,
} from '../tests/helpers/ai-calibration/types';

// Prefer wall-clock deadlines so deep search games finish in reasonable time.
process.env.CALIBRATION_WALL_CLOCK ??= '1';

const GAMES = Number(process.env.CALIBRATION_GAMES ?? 50);
const BASE_SEED = 20261007;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'docs', 'ai-calibration-2026-10-07.md');

const lines: string[] = [];
const allFlags: CalibrationFlag[] = [];

lines.push('# AI Calibration — 2026-10-07');
lines.push('');
lines.push(
  'Headless AI-vs-AI and AI-vs-random matrices across every game with an AI opponent.'
);
lines.push('');
lines.push('## Method');
lines.push('');
lines.push('- Engines: existing per-game AI modules under `src/games/*/ai.ts`');
lines.push(`- Games per matchup: **${GAMES}**`);
lines.push(
  `- Fixed base seed: \`${BASE_SEED}\` (match *i* uses seed \`base + i * 1009\`)`
);
lines.push(
  '- RNG: mulberry32 via `createSeededRng` installed as `Math.random` for each game'
);
lines.push(
  `- Search games (hex, queens-guards, fiar, fab-a-diffy): \`deadlineMs=${process.env.CALIBRATION_DEADLINE_MS ?? 300}\` per decision when \`CALIBRATION_WALL_CLOCK=1\``
);
lines.push(
  '- Random opponent: uniform legal move where enumerated; else Easy policy as legal baseline'
);
lines.push('- Seat: policy under test is **player1**; opponent is **player2**');
lines.push('- Rules / scoring / end conditions: **unchanged**');
lines.push('');

const started = Date.now();

for (const adapter of ALL_ADAPTERS) {
  const gameStart = Date.now();
  lines.push(`## ${adapter.id}`);
  lines.push('');

  lines.push('### AI vs random');
  lines.push('');
  lines.push('| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |');
  lines.push('|---|---:|---:|---:|---:|---:|');

  const vsRandom = {} as Record<Difficulty, MatchupStats>;
  for (const m of aiVsRandomMatchups()) {
    const t0 = Date.now();
    const stats = runMatchup(adapter, m.p1, m.p2, GAMES, BASE_SEED);
    vsRandom[m.p1 as Difficulty] = stats;
    lines.push(
      `| ${m.label} | ${(stats.p1WinRate * 100).toFixed(1)}% | ${(stats.p2WinRate * 100).toFixed(1)}% | ${(stats.drawRate * 100).toFixed(1)}% | ${stats.avgLength.toFixed(1)} | ${stats.games} |`
    );
    console.log(
      `[calibration] ${adapter.id} ${m.label} (${((Date.now() - t0) / 1000).toFixed(1)}s) ${formatStats(stats)}`
    );
  }
  lines.push('');

  lines.push('### AI vs AI');
  lines.push('');
  lines.push('| Matchup | P1 win% | P2 win% | Draw% | Avg length | n |');
  lines.push('|---|---:|---:|---:|---:|---:|');

  for (const m of aiVsAiMatchups()) {
    const t0 = Date.now();
    const stats = runMatchup(
      adapter,
      m.p1,
      m.p2,
      GAMES,
      BASE_SEED + 7_000_000
    );
    lines.push(
      `| ${m.label} | ${(stats.p1WinRate * 100).toFixed(1)}% | ${(stats.p2WinRate * 100).toFixed(1)}% | ${(stats.drawRate * 100).toFixed(1)}% | ${stats.avgLength.toFixed(1)} | ${stats.games} |`
    );
    console.log(
      `[calibration] ${adapter.id} ${m.label} (${((Date.now() - t0) / 1000).toFixed(1)}s) ${formatStats(stats)}`
    );
  }
  lines.push('');

  const flags = detectFlags(adapter.id, vsRandom);
  allFlags.push(...flags);
  if (flags.length) {
    lines.push('### Flags');
    lines.push('');
    for (const f of flags) {
      lines.push(`- **${f.kind}**: ${f.detail}`);
    }
    lines.push('');
  } else {
    lines.push('### Flags');
    lines.push('');
    lines.push(
      '- None (Hard ≥ Easy vs random; difficulty bands separable at 5pp).'
    );
    lines.push('');
  }

  // Incremental save so long runs are not lost
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, lines.join('\n') + '\n', 'utf8');

  console.log(
    `[calibration] ${adapter.id} DONE (${((Date.now() - gameStart) / 1000).toFixed(1)}s) easy=${formatStats(vsRandom.easy)} hard=${formatStats(vsRandom.hard)}`
  );
}

lines.push('## Summary flags');
lines.push('');
if (allFlags.length === 0) {
  lines.push(
    'No Easy-beats-Hard or indistinguishable-difficulty flags across the suite.'
  );
} else {
  for (const f of allFlags) {
    lines.push(`- **${f.kind}**: ${f.detail}`);
  }
}
lines.push('');
lines.push('## Notes');
lines.push('');
lines.push(
  '- Heuristic tuning is only warranted when a level is clearly broken (Easy ≫ Hard or collapsed bands).'
);
lines.push(
  '- Unit guard: `tests/unit/ai-calibration-difficulty-order.test.ts` asserts Hard ≥ Easy on a small seeded sample per game.'
);
lines.push(
  `- Generated in ${((Date.now() - started) / 1000).toFixed(1)}s via \`npx vite-node scripts/run-ai-calibration.ts\`.`
);
lines.push('');

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log(`[calibration] wrote ${OUT} (${allFlags.length} flags)`);
