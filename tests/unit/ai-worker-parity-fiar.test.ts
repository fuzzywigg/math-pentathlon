/**
 * Worker-boundary parity: a mock Worker that runs the same search entry as
 * ai.worker.ts must return identical moves to direct getAIMove for the same seed.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createInitialState,
  type FiarGameState,
  type Player,
} from '../../src/games/fiar/types';
import {
  getAIMove,
  searchAIMove,
  type AIDifficulty,
  type AIMove,
} from '../../src/games/fiar/ai';
import { placeChip, setSelectedChipKind } from '../../src/games/fiar/rules';
import { AiWorkerClient } from '../../src/core/ai-worker/client';
import { CONFIG } from '../../src/games/fiar/types';

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

function forgeMovement(starter: Player = 'player2'): FiarGameState {
  const base = createInitialState({ starter });
  for (const [id, n] of base.board.nodes) {
    base.board.nodes.set(id, { ...n, chip: null, chipKind: undefined });
  }
  const place = (id: string, chip: Player) => {
    const n = base.board.nodes.get(id)!;
    base.board.nodes.set(id, { ...n, chip, chipKind: 'plain' });
  };
  place('c2r1', 'player1');
  place('c6r1', 'player1');
  place('c2r3', 'player1');
  place('c6r3', 'player1');
  place('c2r5', 'player2');
  place('c6r5', 'player2');
  place('c4r1', 'player2');
  place('c4r5', 'player2');
  return {
    ...base,
    phase: 'movement',
    chipsPlaced: {
      player1: CONFIG.CHIPS_PER_PLAYER,
      player2: CONFIG.CHIPS_PER_PLAYER,
    },
    chipInventory: {
      player1: { plain: 0, marked: 0 },
      player2: { plain: 0, marked: 0 },
    },
    currentPlayer: starter,
    selectedNode: null,
    winner: null,
    moveHistory: [],
  };
}

describe('FIAR worker vs direct parity', () => {
  let OriginalWorker: typeof Worker | undefined;

  beforeEach(() => {
    OriginalWorker = globalThis.Worker;
    installSearchWorker((payload) =>
      searchAIMove(
        payload.state as FiarGameState,
        payload.player as Player,
        payload.difficulty as AIDifficulty,
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

  it('opening client+worker search matches direct getAIMove for fixed seeds (easy)', async () => {
    const state = createInitialState({ starter: 'player2' });
    const client = new AiWorkerClient<AIMove>(
      () => new Worker('fiar-mock'),
      () => {
        throw new Error('sync fallback should not run');
      }
    );

    for (const seed of [0, 7, 42]) {
      const direct = getAIMove(state, 'player2', 'easy', { seed });
      const viaWorker = await client.request({
        game: 'fiar',
        state: structuredClone(state),
        player: 'player2',
        difficulty: 'easy',
        seed,
        deadlineMs: 60_000,
      });
      expect(viaWorker).toEqual(direct);
      expect(direct).not.toBeNull();
    }
    client.dispose();
  }, 60_000);

  it('movement client+worker matches direct for fixed seeds (medium)', async () => {
    const state = forgeMovement('player2');
    const client = new AiWorkerClient<AIMove>(
      () => new Worker('fiar-mock'),
      () => {
        throw new Error('sync fallback should not run');
      }
    );

    for (const seed of [3, 11]) {
      const direct = getAIMove(state, 'player2', 'medium', { seed });
      const viaWorker = await client.request({
        game: 'fiar',
        state: structuredClone(state),
        player: 'player2',
        difficulty: 'medium',
        seed,
        deadlineMs: 60_000,
      });
      expect(viaWorker).toEqual(direct);
      expect(direct).not.toBeNull();
    }
    client.dispose();
  }, 60_000);

  it('structuredClone does not change the chosen move', () => {
    let state = createInitialState({ starter: 'player2' });
    state = setSelectedChipKind(state, 'plain');
    state = placeChip(state, 'c3r3', 'plain');
    const seed = 19;
    const a = getAIMove(state, 'player2', 'easy', { seed });
    const b = getAIMove(structuredClone(state), 'player2', 'easy', { seed });
    expect(b).toEqual(a);
  }, 30_000);

  it('soft deadline can truncate without changing depth config', () => {
    const state = createInitialState({ starter: 'player2' });
    let ticks = 0;
    const result = searchAIMove(state, 'player2', 'medium', {
      seed: 1,
      deadlineMs: 0,
      now: () => (ticks++ === 0 ? 0 : 1),
    });
    expect(result.truncated).toBe(true);
  });
});
