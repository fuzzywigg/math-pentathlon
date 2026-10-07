import FabAiWorker from './ai.worker.ts?worker';
import { AiWorkerClient } from '../../core/ai-worker/client';
import { AI_WORKER_SAFETY_DEADLINE_MS } from '../../core/ai-worker/safety';
import {
  AI_PLAY_DEADLINE_MS,
  getAIMove,
  type AIDifficulty,
  type AIMove,
  type AISearchOptions,
} from './ai';
import type { FabADiffyState, Player } from './types';

let client: AiWorkerClient<AIMove> | null = null;

function getClient(): AiWorkerClient<AIMove> {
  if (!client) {
    client = new AiWorkerClient<AIMove>(
      () => new FabAiWorker(),
      (payload) =>
        getAIMove(
          payload.state as FabADiffyState,
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
 * Async Fab AI move — prefers a module Worker so the board stays responsive.
 * Falls back to sync search if Workers are unavailable.
 */
export async function getAIMoveAsync(
  state: FabADiffyState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium',
  options: AISearchOptions = {}
): Promise<AIMove | null> {
  // structuredClone so the worker gets owned Maps (main thread stays free).
  const cloned = structuredClone(state);
  return getClient().request({
    game: 'fab-a-diffy',
    state: cloned,
    player: aiPlayer,
    difficulty,
    seed: options.seed,
    deadlineMs: Math.min(
      options.deadlineMs ?? AI_PLAY_DEADLINE_MS[difficulty],
      AI_WORKER_SAFETY_DEADLINE_MS
    ),
  });
}

export function cancelFabAiRequests(): void {
  client?.cancelPending();
}

export function disposeFabAiWorker(): void {
  client?.dispose();
  client = null;
}
