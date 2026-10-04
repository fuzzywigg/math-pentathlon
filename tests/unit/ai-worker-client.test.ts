import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AiWorkerClient } from '../../src/core/ai-worker/client';
import { AI_WORKER_SAFETY_DEADLINE_MS } from '../../src/core/ai-worker/safety';
import { createSeededRng } from '../../src/core/ai-worker/seeded-rng';

describe('ai-worker seeded rng', () => {
  it('is deterministic for the same seed', () => {
    const a = createSeededRng(42);
    const b = createSeededRng(42);
    const seqA = [a(), a(), a(), a(), a()];
    const seqB = [b(), b(), b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it('diverges for different seeds', () => {
    const a = createSeededRng(1);
    const b = createSeededRng(2);
    expect([a(), a(), a()]).not.toEqual([b(), b(), b()]);
  });
});

describe('AiWorkerClient', () => {
  class MockWorker {
    onmessage: ((ev: MessageEvent) => void) | null = null;
    onerror: ((ev: ErrorEvent) => void) | null = null;
    postMessage = vi.fn((payload: { id: number }) => {
      queueMicrotask(() => {
        this.onmessage?.({
          data: {
            id: payload.id,
            ok: true,
            move: { row: 3, col: 4 },
            elapsedMs: 12,
            truncated: false,
          },
        } as MessageEvent);
      });
    });
    terminate = vi.fn();
  }

  let OriginalWorker: typeof Worker | undefined;

  beforeEach(() => {
    OriginalWorker = globalThis.Worker;
    // @ts-expect-error test stub
    globalThis.Worker = MockWorker;
  });

  afterEach(() => {
    if (OriginalWorker) {
      globalThis.Worker = OriginalWorker;
    } else {
      // @ts-expect-error cleanup
      delete globalThis.Worker;
    }
  });

  it('posts game payload with default safety deadline and returns move', async () => {
    const syncFallback = vi.fn(() => null);
    const client = new AiWorkerClient<{ row: number; col: number }>(
      () => new Worker('mock'),
      syncFallback
    );

    const move = await client.request({
      game: 'hex',
      state: { board: [] },
      player: 'player2',
      difficulty: 'hard',
    });

    expect(move).toEqual({ row: 3, col: 4 });
    expect(syncFallback).not.toHaveBeenCalled();
    client.dispose();
  });

  it('ignores replies after cancelPending (generation bump)', async () => {
    class SlowWorker extends MockWorker {
      override postMessage = vi.fn((payload: { id: number }) => {
        setTimeout(() => {
          this.onmessage?.({
            data: {
              id: payload.id,
              ok: true,
              move: { row: 9, col: 9 },
              elapsedMs: 1,
              truncated: false,
            },
          } as MessageEvent);
        }, 20);
      });
    }
    // @ts-expect-error test stub
    globalThis.Worker = SlowWorker;

    const client = new AiWorkerClient<{ row: number; col: number }>(
      () => new Worker('mock'),
      () => ({ row: 0, col: 0 })
    );

    const pending = client.request({ game: 'hex' });
    client.cancelPending();
    await expect(pending).resolves.toBeNull();
    client.dispose();
  });

  it('falls back to sync search when Worker is undefined', async () => {
    // @ts-expect-error remove Worker
    delete globalThis.Worker;
    const client = new AiWorkerClient<{ row: number; col: number }>(
      () => {
        throw new Error('should not create');
      },
      () => ({ row: 1, col: 2 })
    );
    await expect(client.request({ game: 'hex' })).resolves.toEqual({
      row: 1,
      col: 2,
    });
  });

  it('documents generous safety deadline above tablet Hard estimates', () => {
    // Audit: Queens Hard ~36s desktop / ~145s at 4× CPU. Cap must sit above that.
    expect(AI_WORKER_SAFETY_DEADLINE_MS).toBeGreaterThanOrEqual(180_000);
  });
});
