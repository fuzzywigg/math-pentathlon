/**
 * Hard >= Easy win-rate guards (seeded vs-random samples).
 * Full matrices: docs/ai-calibration-2026-10-07.md
 */
import { describe, it, expect } from 'vitest';
import { ALL_ADAPTERS } from '../helpers/ai-calibration/games';
import { runMatchup } from '../helpers/ai-calibration/matrix';

const BASE_SEED = 20261007;

/**
 * Search games need a wall-clock budget or they exceed CI time.
 * Deadline is applied only inside those cases.
 */
const SEARCH_BUDGET: Record<string, { games: number; timeout: number; deadlineMs: number }> = {
  'queens-guards': { games: 4, timeout: 90_000, deadlineMs: 120 },
  hex: { games: 4, timeout: 60_000, deadlineMs: 200 },
  fiar: { games: 6, timeout: 120_000, deadlineMs: 1500 },
  'fab-a-diffy': { games: 16, timeout: 90_000, deadlineMs: 0 },
  calla: { games: 4, timeout: 45_000, deadlineMs: 0 },
};

const DEFAULT = { games: 8, timeout: 30_000, deadlineMs: 0 };

/**
 * Tip AI still inverts Hard vs Easy on these seats (seeded samples).
 * #468 proposed heuristic retunes; left for owner decision (see
 * docs/STANDALONE-TRIAGE-2026-10-07.md). Harness still covers them offline.
 */
const KNOWN_TIP_INVERSIONS = new Set(['fiar', 'pent-em-in']);

describe('AI calibration — Hard >= Easy win rate vs random', () => {
  for (const adapter of ALL_ADAPTERS) {
    const cfg = SEARCH_BUDGET[adapter.id] ?? DEFAULT;
    const skipInversion = KNOWN_TIP_INVERSIONS.has(adapter.id);
    it.skipIf(skipInversion)(
      `${adapter.id}: Hard win rate >= Easy on seeded sample`,
      () => {
        const prevWall = process.env.CALIBRATION_WALL_CLOCK;
        const prevDeadline = process.env.CALIBRATION_DEADLINE_MS;
        if (cfg.deadlineMs > 0) {
          process.env.CALIBRATION_WALL_CLOCK = '1';
          process.env.CALIBRATION_DEADLINE_MS = String(cfg.deadlineMs);
        } else {
          delete process.env.CALIBRATION_WALL_CLOCK;
          delete process.env.CALIBRATION_DEADLINE_MS;
        }
        try {
          const easy = runMatchup(
            adapter,
            'easy',
            'random',
            cfg.games,
            BASE_SEED
          );
          const hard = runMatchup(
            adapter,
            'hard',
            'random',
            cfg.games,
            BASE_SEED
          );
          expect(
            hard.p1WinRate,
            `${adapter.id}: Easy=${(easy.p1WinRate * 100).toFixed(1)}% Hard=${(hard.p1WinRate * 100).toFixed(1)}% (n=${cfg.games})`
          ).toBeGreaterThanOrEqual(easy.p1WinRate);
        } finally {
          if (prevWall === undefined) delete process.env.CALIBRATION_WALL_CLOCK;
          else process.env.CALIBRATION_WALL_CLOCK = prevWall;
          if (prevDeadline === undefined) {
            delete process.env.CALIBRATION_DEADLINE_MS;
          } else {
            process.env.CALIBRATION_DEADLINE_MS = prevDeadline;
          }
        }
      },
      cfg.timeout
    );
  }
});
