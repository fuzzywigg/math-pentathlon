/// <reference lib="webworker" />
/**
 * FIAR AI Web Worker — keeps placement/movement search off the UI thread.
 * Loaded via `new Worker(new URL('./ai.worker.ts', import.meta.url), { type: 'module' })`.
 */
import { searchAIMove, type AIDifficulty, type AIMove } from './ai';
import type { FiarGameState, Player } from './types';
import type { AiWorkerResponse } from '../../core/ai-worker/protocol';

export interface FiarAiWorkerRequest {
  id: number;
  game: 'fiar';
  state: FiarGameState;
  player: Player;
  difficulty: AIDifficulty;
  seed?: number | undefined;
  deadlineMs?: number | undefined;
}

const workerScope = self as DedicatedWorkerGlobalScope;

workerScope.onmessage = (event: MessageEvent<FiarAiWorkerRequest>) => {
  const msg = event.data;
  if (msg.game !== 'fiar') return;

  const started = performance.now();
  try {
    const result = searchAIMove(msg.state, msg.player, msg.difficulty, {
      seed: msg.seed,
      deadlineMs: msg.deadlineMs,
      now: () => performance.now(),
    });
    const response: AiWorkerResponse<AIMove> = {
      id: msg.id,
      ok: true,
      move: result.move,
      elapsedMs: performance.now() - started,
      truncated: result.truncated,
    };
    workerScope.postMessage(response);
  } catch (err) {
    const response: AiWorkerResponse<AIMove> = {
      id: msg.id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
    workerScope.postMessage(response);
  }
};
