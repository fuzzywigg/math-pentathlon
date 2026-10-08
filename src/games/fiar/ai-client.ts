import FiarAiWorker from './ai.worker.ts?worker';
import { AiWorkerClient } from '../../core/ai-worker/client';
import type { AiWorkerRequestPayload } from '../../core/ai-worker/client';
import { AI_WORKER_SAFETY_DEADLINE_MS } from '../../core/ai-worker/safety';
import {
  getAIMove,
  type AIDifficulty,
  type AIMove,
  type AISearchOptions,
} from './ai';
import type { FiarGameState, Player } from './types';

let client: AiWorkerClient<AIMove> | null = null;

function getClient(): AiWorkerClient<AIMove> {
  if (!client) {
    client = new AiWorkerClient<AIMove>(
      () => new FiarAiWorker(),
      (payload) =>
        getAIMove(
          payload.state as FiarGameState,
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
 * Async AI move — prefers a module Worker so the board stays responsive.
 * Falls back to sync search if Workers are unavailable.
 */
export async function getAIMoveAsync(
  state: FiarGameState,
  aiPlayer: Player,
  difficulty: AIDifficulty = 'medium',
  options: AISearchOptions = {}
): Promise<AIMove | null> {
  // structuredClone so the worker gets an owned Map (and main thread stays free).
  const cloned = structuredClone(state);
  return getClient().request({
    game: 'fiar',
    state: cloned,
    player: aiPlayer,
    difficulty,
    seed: options.seed,
    deadlineMs: options.deadlineMs ?? AI_WORKER_SAFETY_DEADLINE_MS,
  } as AiWorkerRequestPayload);
}

export function cancelFiarAiRequests(): void {
  client?.cancelPending();
}

export function disposeFiarAiWorker(): void {
  client?.dispose();
  client = null;
}
