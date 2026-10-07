/**
 * Worker-boundary parity: mock Worker running searchAIMove must match
 * direct getAIMove for the same seed.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import {
  getAIMove,
  searchAIMove,
  type AIDifficulty,
  type AIMove,
} from '../../src/games/fab-a-diffy/ai';
import type { FabADiffyState, Player } from '../../src/games/fab-a-diffy/types';
import { AiWorkerClient } from '../../src/core/ai-worker/client';
import { disposeFabAiWorker } from '../../src/games/fab-a-diffy/ai-client';

function installSearchWorker(
  run: (payload: Record<string, unknown>) => {
    move: unknown;
    truncated: boolean;
  }
): void {
  class SearchWorker {
    onmessage: ((ev: MessageEvent) => void) | null = null;
    onerror: ((ev: ErrorEvent) => void) | null = null;
    postMessage = (payload: Record<string, unknown>) => {
      queueMicrotask(() => {
        try {
          const started = performance.now();
          const result = run(payload);
          this.onmessage?.({
            data: {
              id: payload.id,
              ok: true,
              move: result.move,
              elapsedMs: performance.now() - started,
              truncated: result.truncated,
            },
          } as MessageEvent);
        } catch (err) {
          this.onmessage?.({
            data: {
              id: payload.id,
              ok: false,
              error: err instanceof Error ? err.message : String(err),
            },
          } as MessageEvent);
        }
      });
    };
    terminate = vi.fn();
  }
  // @ts-expect-error test stub
  globalThis.Worker = SearchWorker;
}

describe('Fab-a-Diffy worker vs direct parity', () => {
  let OriginalWorker: typeof Worker | undefined;

  beforeEach(() => {
    OriginalWorker = globalThis.Worker;
    installSearchWorker((payload) =>
      searchAIMove(
        payload.state as FabADiffyState,
        payload.player as Player,
        payload.difficulty as AIDifficulty,
        { seed: payload.seed as number | undefined }
      )
    );
  });

  afterEach(() => {
    disposeFabAiWorker();
    if (OriginalWorker) globalThis.Worker = OriginalWorker;
    else {
      // @ts-expect-error cleanup
      delete globalThis.Worker;
    }
  });

  it('client+worker search matches direct getAIMove for fixed seeds (easy)', async () => {
    const state = createInitialState();
    const client = new AiWorkerClient<AIMove>(
      () => new Worker('fab-mock'),
      () => {
        throw new Error('sync fallback should not run');
      }
    );

    for (const seed of [1, 2, 3, 7, 11]) {
      const direct = getAIMove(state, 'player1', 'easy', { seed });
      const viaWorker = await client.request({
        game: 'fab-a-diffy',
        state: structuredClone(state),
        player: 'player1',
        difficulty: 'easy',
        seed,
      });
      expect(viaWorker).toEqual(direct);
    }
    client.dispose();
  }, 60_000);

  it('structuredClone does not change the chosen move', () => {
    const state = createInitialState();
    const seed = 9;
    const a = getAIMove(state, 'player1', 'hard', { seed });
    const b = getAIMove(structuredClone(state), 'player1', 'hard', { seed });
    expect(a).toEqual(b);
  });
});
