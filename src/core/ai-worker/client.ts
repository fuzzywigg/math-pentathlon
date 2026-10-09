import { AI_WORKER_SAFETY_DEADLINE_MS } from './safety';
import type { AiWorkerGameId, AiWorkerResponse } from './protocol';

export interface AiWorkerRequestPayload {
  game: AiWorkerGameId;
  /** Present-or-absent; may be explicitly undefined under EOPT call sites. */
  seed?: number | undefined;
  /** Present-or-absent; may be explicitly undefined under EOPT call sites. */
  deadlineMs?: number | undefined;
  [key: string]: unknown;
}

type Pending<TMove> = {
  resolve: (value: TMove | null) => void;
  reject: (reason: unknown) => void;
};

/**
 * Thin Worker client: posts structured-cloneable payloads, correlates by id,
 * and falls back to a sync search if Workers are unavailable (rare old WebKit).
 */
export class AiWorkerClient<TMove> {
  private worker: Worker | null = null;
  private nextId = 1;
  private readonly pending = new Map<number, Pending<TMove>>();
  private generation = 0;

  constructor(
    private readonly createWorker: () => Worker,
    private readonly syncFallback: (
      payload: AiWorkerRequestPayload
    ) => TMove | null
  ) {}

  /** Bump generation so in-flight replies are ignored (new game / leave). */
  cancelPending(): void {
    this.generation += 1;
    for (const [, p] of this.pending) {
      p.resolve(null);
    }
    this.pending.clear();
  }

  dispose(): void {
    this.cancelPending();
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  async request(payload: AiWorkerRequestPayload): Promise<TMove | null> {
    const gen = this.generation;
    if (typeof Worker === 'undefined') {
      return this.syncFallback(payload);
    }

    try {
      const worker = this.ensureWorker();
      const id = this.nextId++;
      const deadlineMs = payload.deadlineMs ?? AI_WORKER_SAFETY_DEADLINE_MS;

      const result = await new Promise<TMove | null>((resolve, reject) => {
        this.pending.set(id, { resolve, reject });
        worker.postMessage({
          ...payload,
          id,
          deadlineMs,
        });
      });

      if (gen !== this.generation) {
        return null;
      }
      return result;
    } catch {
      if (gen !== this.generation) {
        return null;
      }
      return this.syncFallback(payload);
    }
  }

  private ensureWorker(): Worker {
    if (this.worker) {
      return this.worker;
    }
    const worker = this.createWorker();
    worker.onmessage = (event: MessageEvent<AiWorkerResponse<TMove>>) => {
      const data = event.data;
      const pending = this.pending.get(data.id);
      if (!pending) {
        return;
      }
      this.pending.delete(data.id);
      if (!data.ok) {
        pending.reject(new Error(data.error));
        return;
      }
      pending.resolve(data.move);
    };
    worker.onerror = (err) => {
      // Fail all pending so callers can sync-fallback / surface errors.
      const error = err instanceof ErrorEvent ? err.message : 'AI worker error';
      for (const [, p] of this.pending) {
        p.reject(new Error(error));
      }
      this.pending.clear();
      this.worker?.terminate();
      this.worker = null;
    };
    this.worker = worker;
    return worker;
  }
}
