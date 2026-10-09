/**
 * q-mp-271 — Characterize `src/core/ai-worker` non-search surfaces.
 *
 * Structural asserts only: message shapes, safety rejects → sync fallback,
 * worker onerror plumbing, RNG seed stability, deadline defaults.
 * No asserts on AI move choices, search depth, difficulty, or timing values
 * beyond the documented safety-deadline constant.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AiWorkerClient } from '../../src/core/ai-worker/client';
import type {
  AiWorkerFailure,
  AiWorkerGameId,
  AiWorkerResponse,
  AiWorkerSuccess,
} from '../../src/core/ai-worker/protocol';
import { AI_WORKER_SAFETY_DEADLINE_MS } from '../../src/core/ai-worker/safety';
import { createSeededRng } from '../../src/core/ai-worker/seeded-rng';

type Move = { row: number; col: number };

describe('ai-worker protocol shapes (structural)', () => {
  const GAMES: readonly AiWorkerGameId[] = [
    'queens-guards',
    'hex',
    'fiar',
    'fab-a-diffy',
  ];

  it('enumerates the four supported game ids', () => {
    expect(GAMES).toHaveLength(4);
    expect(new Set(GAMES).size).toBe(4);
  });

  it('success response carries id, ok:true, move|null, elapsedMs, truncated', () => {
    const success: AiWorkerSuccess<Move> = {
      id: 7,
      ok: true,
      move: { row: 1, col: 2 },
      elapsedMs: 3,
      truncated: false,
    };
    const asResponse: AiWorkerResponse<Move> = success;
    expect(asResponse.ok).toBe(true);
    if (asResponse.ok) {
      expect(asResponse).toEqual(
        expect.objectContaining({
          id: 7,
          move: { row: 1, col: 2 },
          elapsedMs: expect.any(Number),
          truncated: expect.any(Boolean),
        })
      );
    }

    const nullMove: AiWorkerSuccess<Move> = {
      id: 8,
      ok: true,
      move: null,
      elapsedMs: 0,
      truncated: true,
    };
    expect(nullMove.move).toBeNull();
    expect(nullMove.truncated).toBe(true);
  });

  it('failure response carries id, ok:false, and error string', () => {
    const failure: AiWorkerFailure = {
      id: 9,
      ok: false,
      error: 'boom',
    };
    const asResponse: AiWorkerResponse<Move> = failure;
    expect(asResponse.ok).toBe(false);
    if (!asResponse.ok) {
      expect(asResponse.error).toBe('boom');
      expect(asResponse.id).toBe(9);
    }
  });
});

describe('ai-worker safety constant', () => {
  it('exports the documented 180s safety deadline exactly', () => {
    expect(AI_WORKER_SAFETY_DEADLINE_MS).toBe(180_000);
  });
});

describe('ai-worker seeded rng (non-search edges)', () => {
  it('yields values in [0, 1) for seed 0 and negative seeds', () => {
    for (const seed of [0, -1, -42]) {
      const rng = createSeededRng(seed);
      for (let i = 0; i < 20; i++) {
        const v = rng();
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(1);
      }
    }
  });

  it('coerces seeds via unsigned 32-bit so -1 and 0xffffffff match', () => {
    const a = createSeededRng(-1);
    const b = createSeededRng(0xffffffff);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
});

describe('AiWorkerClient message plumbing + error paths', () => {
  class MockWorker {
    onmessage: ((ev: MessageEvent) => void) | null = null;
    onerror: ((ev: ErrorEvent | Event) => void) | null = null;
    postMessage = vi.fn();
    terminate = vi.fn();
  }

  let OriginalWorker: typeof Worker | undefined;
  let lastWorker: MockWorker | null = null;

  beforeEach(() => {
    OriginalWorker = globalThis.Worker;
    lastWorker = null;
    // @ts-expect-error test stub
    globalThis.Worker = class extends MockWorker {
      constructor() {
        super();
        lastWorker = this;
      }
    };
  });

  afterEach(() => {
    if (OriginalWorker) {
      globalThis.Worker = OriginalWorker;
    } else {
      // @ts-expect-error cleanup
      delete globalThis.Worker;
    }
  });

  it('posts explicit deadlineMs when provided (does not substitute default)', async () => {
    const client = new AiWorkerClient<Move>(
      () => new Worker('mock'),
      () => null
    );
    const pending = client.request({
      game: 'fiar',
      deadlineMs: 12_345,
    });
    expect(lastWorker?.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        game: 'fiar',
        id: 1,
        deadlineMs: 12_345,
      })
    );
    lastWorker?.onmessage?.({
      data: {
        id: 1,
        ok: true,
        move: { row: 0, col: 1 },
        elapsedMs: 1,
        truncated: false,
      },
    } as MessageEvent);
    await expect(pending).resolves.toEqual({ row: 0, col: 1 });
    client.dispose();
  });

  it('defaults deadlineMs to AI_WORKER_SAFETY_DEADLINE_MS when omitted', async () => {
    const client = new AiWorkerClient<Move>(
      () => new Worker('mock'),
      () => null
    );
    const pending = client.request({ game: 'hex' });
    expect(lastWorker?.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        deadlineMs: AI_WORKER_SAFETY_DEADLINE_MS,
      })
    );
    lastWorker?.onmessage?.({
      data: {
        id: 1,
        ok: true,
        move: null,
        elapsedMs: 0,
        truncated: false,
      },
    } as MessageEvent);
    await expect(pending).resolves.toBeNull();
    client.dispose();
  });

  it('resolves null move on ok:true without invoking sync fallback', async () => {
    const syncFallback = vi.fn(() => ({ row: 9, col: 9 }));
    const client = new AiWorkerClient<Move>(
      () => new Worker('mock'),
      syncFallback
    );
    const pending = client.request({ game: 'queens-guards' });
    lastWorker?.onmessage?.({
      data: {
        id: 1,
        ok: true,
        move: null,
        elapsedMs: 2,
        truncated: true,
      },
    } as MessageEvent);
    await expect(pending).resolves.toBeNull();
    expect(syncFallback).not.toHaveBeenCalled();
    client.dispose();
  });

  it('on ok:false rejects then sync-fallbacks (error plumbing)', async () => {
    const syncFallback = vi.fn(() => ({ row: 2, col: 3 }));
    const client = new AiWorkerClient<Move>(
      () => new Worker('mock'),
      syncFallback
    );
    const pending = client.request({ game: 'fab-a-diffy', state: {} });
    lastWorker?.onmessage?.({
      data: {
        id: 1,
        ok: false,
        error: 'worker search failed',
      } satisfies AiWorkerFailure,
    } as MessageEvent);
    await expect(pending).resolves.toEqual({ row: 2, col: 3 });
    expect(syncFallback).toHaveBeenCalledTimes(1);
    expect(syncFallback).toHaveBeenCalledWith(
      expect.objectContaining({ game: 'fab-a-diffy' })
    );
    client.dispose();
  });

  it('ignores stale worker messages whose id is not pending', async () => {
    const syncFallback = vi.fn(() => null);
    const client = new AiWorkerClient<Move>(
      () => new Worker('mock'),
      syncFallback
    );
    const pending = client.request({ game: 'hex' });
    // Stale / unknown id — must not resolve or reject the in-flight request.
    lastWorker?.onmessage?.({
      data: {
        id: 999,
        ok: true,
        move: { row: 5, col: 5 },
        elapsedMs: 1,
        truncated: false,
      },
    } as MessageEvent);
    lastWorker?.onmessage?.({
      data: {
        id: 1,
        ok: true,
        move: { row: 1, col: 1 },
        elapsedMs: 1,
        truncated: false,
      },
    } as MessageEvent);
    await expect(pending).resolves.toEqual({ row: 1, col: 1 });
    expect(syncFallback).not.toHaveBeenCalled();
    client.dispose();
  });

  it('onerror with ErrorEvent rejects pending and sync-fallbacks', async () => {
    const syncFallback = vi.fn(() => ({ row: 4, col: 4 }));
    const client = new AiWorkerClient<Move>(
      () => new Worker('mock'),
      syncFallback
    );
    const pending = client.request({ game: 'hex' });
    const worker = lastWorker!;
    worker.onerror?.(
      new ErrorEvent('error', { message: 'script error in worker' })
    );
    await expect(pending).resolves.toEqual({ row: 4, col: 4 });
    expect(syncFallback).toHaveBeenCalledTimes(1);
    expect(worker.terminate).toHaveBeenCalled();
    client.dispose();
  });

  it('onerror with non-ErrorEvent uses generic message then sync-fallbacks', async () => {
    const syncFallback = vi.fn(() => ({ row: 6, col: 6 }));
    const client = new AiWorkerClient<Move>(
      () => new Worker('mock'),
      syncFallback
    );
    const pending = client.request({ game: 'fiar' });
    lastWorker?.onerror?.(new Event('error'));
    await expect(pending).resolves.toEqual({ row: 6, col: 6 });
    expect(syncFallback).toHaveBeenCalledTimes(1);
    client.dispose();
  });

  it('createWorker throw falls back to sync search', async () => {
    const syncFallback = vi.fn(() => ({ row: 7, col: 7 }));
    const client = new AiWorkerClient<Move>(() => {
      throw new Error('Worker constructor blocked');
    }, syncFallback);
    await expect(client.request({ game: 'hex' })).resolves.toEqual({
      row: 7,
      col: 7,
    });
    expect(syncFallback).toHaveBeenCalledTimes(1);
  });

  it('reuses the same Worker across sequential requests', async () => {
    const client = new AiWorkerClient<Move>(
      () => new Worker('mock'),
      () => null
    );
    const first = client.request({ game: 'hex' });
    const w1 = lastWorker;
    w1?.onmessage?.({
      data: {
        id: 1,
        ok: true,
        move: { row: 0, col: 0 },
        elapsedMs: 1,
        truncated: false,
      },
    } as MessageEvent);
    await first;

    const second = client.request({ game: 'hex' });
    expect(lastWorker).toBe(w1);
    expect(w1?.postMessage).toHaveBeenCalledTimes(2);
    w1?.onmessage?.({
      data: {
        id: 2,
        ok: true,
        move: { row: 1, col: 0 },
        elapsedMs: 1,
        truncated: false,
      },
    } as MessageEvent);
    await expect(second).resolves.toEqual({ row: 1, col: 0 });
    client.dispose();
  });

  it('dispose terminates the worker and clears pending', async () => {
    const client = new AiWorkerClient<Move>(
      () => new Worker('mock'),
      () => ({ row: 0, col: 0 })
    );
    const pending = client.request({ game: 'hex' });
    const worker = lastWorker!;
    client.dispose();
    expect(worker.terminate).toHaveBeenCalled();
    await expect(pending).resolves.toBeNull();
  });

  it('after onerror, a later request constructs a fresh Worker', async () => {
    const syncFallback = vi.fn(() => ({ row: 0, col: 0 }));
    const client = new AiWorkerClient<Move>(
      () => new Worker('mock'),
      syncFallback
    );
    const first = client.request({ game: 'hex' });
    const w1 = lastWorker!;
    w1.onerror?.(new ErrorEvent('error', { message: 'crash' }));
    await first;

    const second = client.request({ game: 'hex' });
    expect(lastWorker).not.toBe(w1);
    lastWorker?.onmessage?.({
      data: {
        id: 2,
        ok: true,
        move: { row: 3, col: 3 },
        elapsedMs: 1,
        truncated: false,
      },
    } as MessageEvent);
    await expect(second).resolves.toEqual({ row: 3, col: 3 });
    client.dispose();
  });

  it('cancelPending during ok:false path returns null (no sync fallback)', async () => {
    const syncFallback = vi.fn(() => ({ row: 8, col: 8 }));
    const client = new AiWorkerClient<Move>(
      () => new Worker('mock'),
      syncFallback
    );
    const pending = client.request({ game: 'hex' });
    client.cancelPending();
    lastWorker?.onmessage?.({
      data: {
        id: 1,
        ok: false,
        error: 'too late',
      },
    } as MessageEvent);
    // cancelPending already resolved the pending entry with null and cleared
    // the map, so the late failure message is ignored; request settles null.
    await expect(pending).resolves.toBeNull();
    expect(syncFallback).not.toHaveBeenCalled();
    client.dispose();
  });

  it('generation bump after reject skips sync fallback (catch null path)', async () => {
    const syncFallback = vi.fn(() => ({ row: 8, col: 8 }));
    const client = new AiWorkerClient<Move>(
      () => new Worker('mock'),
      syncFallback
    );
    const pending = client.request({ game: 'hex' });
    // Reject first (removes pending), then bump generation before catch runs.
    lastWorker?.onmessage?.({
      data: {
        id: 1,
        ok: false,
        error: 'fail then cancel',
      },
    } as MessageEvent);
    client.cancelPending();
    await expect(pending).resolves.toBeNull();
    expect(syncFallback).not.toHaveBeenCalled();
    client.dispose();
  });
});
