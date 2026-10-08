/// <reference lib="webworker" />
/**
 * Hex AI Web Worker — keeps midgame Hard search off the UI thread.
 */
import { searchBestMove, type AIDifficulty } from './ai';
import type { HexGameState, HexPosition, Player } from './types';
import type { AiWorkerResponse } from '../../core/ai-worker/protocol';

export interface HexAiWorkerRequest {
  id: number;
  game: 'hex';
  state: HexGameState;
  player: Player;
  difficulty: AIDifficulty;
  seed?: number | undefined;
  deadlineMs?: number | undefined;
}

const workerScope = self as DedicatedWorkerGlobalScope;

workerScope.onmessage = (event: MessageEvent<HexAiWorkerRequest>) => {
  const msg = event.data;
  if (msg.game !== 'hex') return;

  const started = performance.now();
  try {
    const result = searchBestMove(msg.state, msg.player, msg.difficulty, {
      seed: msg.seed,
      deadlineMs: msg.deadlineMs,
      now: () => performance.now(),
    });
    const response: AiWorkerResponse<HexPosition> = {
      id: msg.id,
      ok: true,
      move: result.move,
      elapsedMs: performance.now() - started,
      truncated: result.truncated,
    };
    workerScope.postMessage(response);
  } catch (err) {
    const response: AiWorkerResponse<HexPosition> = {
      id: msg.id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
    workerScope.postMessage(response);
  }
};
