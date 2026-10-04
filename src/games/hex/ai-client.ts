import HexAiWorker from './ai.worker.ts?worker';
import { AiWorkerClient } from '../../core/ai-worker/client';
import { AI_WORKER_SAFETY_DEADLINE_MS } from '../../core/ai-worker/safety';
import { getBestMove, type AIDifficulty, type AISearchOptions } from './ai';
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
 */
export async function getBestMoveAsync(
  state: HexGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium',
  options: AISearchOptions = {}
): Promise<HexPosition | null> {
  const cloned = structuredClone(state);
  return getClient().request({
    game: 'hex',
    state: cloned,
    player: aiPlayer,
    difficulty,
    seed: options.seed,
    deadlineMs: options.deadlineMs ?? AI_WORKER_SAFETY_DEADLINE_MS,
  });
}

export function cancelHexAiRequests(): void {
  client?.cancelPending();
}

export function disposeHexAiWorker(): void {
  client?.dispose();
  client = null;
}
