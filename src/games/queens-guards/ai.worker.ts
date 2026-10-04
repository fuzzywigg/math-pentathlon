/// <reference lib="webworker" />
/**
 * Queens & Guards AI Web Worker — keeps minimax off the UI thread.
 * Loaded via `new Worker(new URL('./ai.worker.ts', import.meta.url), { type: 'module' })`.
 */
import { searchAIMove, type AIDifficulty, type AIMove } from './ai';
import type { Player, QueensGuardsState } from './types';
import type { AiWorkerResponse } from '../../core/ai-worker/protocol';

export interface QueensAiWorkerRequest {
  id: number;
  game: 'queens-guards';
  state: QueensGuardsState;
  player: Player;
  difficulty: AIDifficulty;
  seed?: number;
  deadlineMs?: number;
}

const workerScope = self as DedicatedWorkerGlobalScope;

workerScope.onmessage = (event: MessageEvent<QueensAiWorkerRequest>) => {
  const msg = event.data;
  if (msg.game !== 'queens-guards') return;

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
