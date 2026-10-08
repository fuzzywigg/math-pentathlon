/** Shared request/response shapes for game AI Web Workers. */

export type AiWorkerGameId = 'queens-guards' | 'hex' | 'fiar' | 'fab-a-diffy';

export interface AiWorkerRequestBase {
  /** Correlates request/response; client ignores stale ids after cancel. */
  id: number;
  game: AiWorkerGameId;
  /** Optional seed → deterministic Math.random replacement. */
  seed?: number | undefined;
  /** Absolute wall-time budget; see AI_WORKER_SAFETY_DEADLINE_MS. */
  deadlineMs?: number | undefined;
}

export interface AiWorkerSuccess<TMove> {
  id: number;
  ok: true;
  move: TMove | null;
  /** Worker-side wall time for the search (ms). */
  elapsedMs: number;
  /** True when the generous safety deadline truncated root evaluation. */
  truncated: boolean;
}

export interface AiWorkerFailure {
  id: number;
  ok: false;
  error: string;
}

export type AiWorkerResponse<TMove> = AiWorkerSuccess<TMove> | AiWorkerFailure;
