import HexAiWorker from './ai.worker.ts?worker';
import { AiWorkerClient } from '../../core/ai-worker/client';
import { AI_WORKER_SAFETY_DEADLINE_MS } from '../../core/ai-worker/safety';
import {
  AI_PLAY_DEADLINE_MS,
  getBestMove,
  type AIDifficulty,
  type AISearchOptions,
} from './ai';
import type { HexGameState, HexPosition, Player } from './types';

let client: AiWorkerClient<HexPosition> | null = null;

function getClient(): AiWorkerClient<HexPosition> {
  if (!client) {
    client = new AiWorkerClient<HexPosition>(
      () => new HexAiWorker(),
      (payload) =>
        getBestMove(
          payload.state as HexGameState,
          payload.player as Player,
          payload.difficulty as AIDifficulty,
          {
            seed: payload.seed as number | undefined,
            deadlineMs: payload.deadlineMs as number | undefined,
          }
        )
    );
  }
  return client;
}

/**
 * Async Hex AI move via Web Worker (sync fallback if Worker unavailable).
 * A client-side watchdog races the play budget so a stuck worker cannot
 * soft-lock the AI seat (playtest 2026-10-07 desktop Hard hang).
 */
export async function getBestMoveAsync(
  state: HexGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium',
  options: AISearchOptions = {}
): Promise<HexPosition | null> {
  const cloned = structuredClone(state);
  const deadlineMs = Math.min(
    options.deadlineMs ?? AI_PLAY_DEADLINE_MS[difficulty],
    AI_WORKER_SAFETY_DEADLINE_MS
  );
  // Slack above the search budget for postMessage / main-thread scheduling.
  const watchdogMs = deadlineMs + 1500;
  const c = getClient();

  let finished = false;
  const requestPromise = c
    .request({
      game: 'hex',
      state: cloned,
      player: aiPlayer,
      difficulty,
      seed: options.seed,
      deadlineMs,
    })
    .then((move) => {
      finished = true;
      return move;
    });

  const watchdogPromise = new Promise<HexPosition | null>((resolve) => {
    setTimeout(() => {
      if (finished) {
        resolve(null);
        return;
      }
      // Drop the stuck worker so the next turn gets a fresh thread.
      cancelHexAiRequests();
      disposeHexAiWorker();
      resolve(null);
    }, watchdogMs);
  });

  const raced = await Promise.race([requestPromise, watchdogPromise]);
  if (raced !== null) return raced;
  // Watchdog (or cancel) — sync fallback on the main thread with the same budget.
  return getBestMove(cloned, aiPlayer, difficulty, {
    seed: options.seed,
    deadlineMs,
  });
}

export function cancelHexAiRequests(): void {
  client?.cancelPending();
}

export function disposeHexAiWorker(): void {
  client?.dispose();
  client = null;
}
