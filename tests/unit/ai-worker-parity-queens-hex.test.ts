/**
 * Worker-boundary parity: a mock Worker that runs the same search entry as
 * ai.worker.ts must return identical moves to direct getAIMove / getBestMove
 * for the same seed (deterministic engine path).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createInitialState as createQueensState,
  type QueensGuardsState,
  type Player as QueensPlayer,
} from '../../src/games/queens-guards/types';
import {
  getAIMove as getQueensMove,
  searchAIMove as searchQueensMove,
  type AIDifficulty as QueensDifficulty,
  type AIMove,
} from '../../src/games/queens-guards/ai';
import { AiWorkerClient } from '../../src/core/ai-worker/client';
import {
  createInitialState as createHexState,
  type HexGameState,
  type Player as HexPlayer,
} from '../../src/games/hex/types';
import {
  getBestMove as getHexMove,
  searchBestMove as searchHexMove,
  type AIDifficulty as HexDifficulty,
} from '../../src/games/hex/ai';
import { makeMove as makeHexMove } from '../../src/games/hex/rules';
import type { HexPosition } from '../../src/games/hex/types';

/** Mock Worker that executes the real search (what ai.worker.ts does). */
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

describe('Queens & Guards worker vs direct parity', () => {
  let OriginalWorker: typeof Worker | undefined;

  beforeEach(() => {
    OriginalWorker = globalThis.Worker;
    installSearchWorker((payload) =>
      searchQueensMove(
        payload.state as QueensGuardsState,
        payload.player as QueensPlayer,
        payload.difficulty as QueensDifficulty,
        { seed: payload.seed as number | undefined }
      )
    );
  });

  afterEach(() => {
    if (OriginalWorker) globalThis.Worker = OriginalWorker;
    else {
      // @ts-expect-error cleanup
      delete globalThis.Worker;
    }
  });

  it('client+worker search matches direct getAIMove for fixed seeds (easy)', async () => {
    const state = createQueensState();
    const client = new AiWorkerClient<AIMove>(
      () => new Worker('queens-mock'),
      () => {
        throw new Error('sync fallback should not run');
      }
    );

    for (const seed of [0, 7, 42]) {
      const direct = getQueensMove(state, 'player1', 'easy', { seed });
      const viaWorker = await client.request({
        game: 'queens-guards',
        state: structuredClone(state),
        player: 'player1',
        difficulty: 'easy',
        seed,
        deadlineMs: 60_000,
      });
      expect(viaWorker).toEqual(direct);
      expect(direct).not.toBeNull();
    }
    client.dispose();
  }, 60_000);

  it('structuredClone does not change the chosen move', () => {
    const state = createQueensState();
    const seed = 11;
    const a = getQueensMove(state, 'player1', 'easy', { seed });
    const b = getQueensMove(structuredClone(state), 'player1', 'easy', {
      seed,
    });
    expect(b).toEqual(a);
  }, 30_000);

  it('soft deadline can truncate without changing depth config', () => {
    const state = createQueensState();
    let ticks = 0;
    const result = searchQueensMove(state, 'player1', 'easy', {
      seed: 1,
      deadlineMs: 0,
      now: () => (ticks++ === 0 ? 0 : 1),
    });
    expect(result.truncated).toBe(true);
  });
});

describe('Hex worker vs direct parity', () => {
  let OriginalWorker: typeof Worker | undefined;

  beforeEach(() => {
    OriginalWorker = globalThis.Worker;
    installSearchWorker((payload) =>
      searchHexMove(
        payload.state as HexGameState,
        payload.player as HexPlayer,
        payload.difficulty as HexDifficulty,
        { seed: payload.seed as number | undefined }
      )
    );
  });

  afterEach(() => {
    if (OriginalWorker) globalThis.Worker = OriginalWorker;
    else {
      // @ts-expect-error cleanup
      delete globalThis.Worker;
    }
  });

  it('opening client+worker matches direct getBestMove for fixed seeds', async () => {
    const state = createHexState();
    const client = new AiWorkerClient<HexPosition>(
      () => new Worker('hex-mock'),
      () => {
        throw new Error('sync fallback should not run');
      }
    );

    for (const seed of [0, 5, 17]) {
      const direct = getHexMove(state, 'player2', 'hard', { seed });
      const viaWorker = await client.request({
        game: 'hex',
        state: structuredClone(state),
        player: 'player2',
        difficulty: 'hard',
        seed,
        deadlineMs: 60_000,
      });
      expect(viaWorker).toEqual(direct);
      expect(direct).not.toBeNull();
    }
    client.dispose();
  });

  it('midgame easy client+worker matches direct (past opening short-circuit)', async () => {
    let state = createHexState();
    const script = [
      { row: 5, col: 5 },
      { row: 5, col: 6 },
      { row: 4, col: 5 },
      { row: 6, col: 5 },
    ];
    for (const pos of script) {
      state = makeHexMove(state, pos);
    }
    expect(state.moveHistory.length).toBe(4);

    const client = new AiWorkerClient<HexPosition>(
      () => new Worker('hex-mock'),
      () => {
        throw new Error('sync fallback should not run');
      }
    );

    for (const seed of [2, 9]) {
      const direct = getHexMove(state, 'player1', 'easy', { seed });
      const viaWorker = await client.request({
        game: 'hex',
        state: structuredClone(state),
        player: 'player1',
        difficulty: 'easy',
        seed,
        deadlineMs: 60_000,
      });
      expect(viaWorker).toEqual(direct);
      expect(direct).not.toBeNull();
    }
    client.dispose();
  }, 60_000);
});
