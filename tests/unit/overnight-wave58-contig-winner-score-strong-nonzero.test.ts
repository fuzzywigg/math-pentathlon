/**
 * Wave 58 leftover after #275 — Contig winner scores strong nonzero. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';

vi.mock('../../src/games/contig-60/types', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/games/contig-60/types')>();
  return {
    ...actual,
    createInitialState: vi.fn(() => actual.createInitialState()),
  };
});

import { createInitialState } from '../../src/games/contig-60/types';
import { initGame } from '../../src/games/contig-60/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  vi.mocked(createInitialState).mockReset();
});

async function seed(overrides: Record<string, unknown>) {
  const actual = await vi.importActual<typeof import('../../src/games/contig-60/types')>(
    '../../src/games/contig-60/types'
  );
  vi.mocked(createInitialState).mockReturnValue({
    ...actual.createInitialState(),
    ...overrides,
  } as ReturnType<typeof actual.createInitialState>);
  const board = document.createElement('div');
  const status = document.createElement('div');
  document.body.append(board, status);
  initGame(board, status);
  return { board, status };
}

describe('Wave 58 contig — winner score strong', () => {
  it('score <strong> shows nonzero under winner', async () => {
    const { board } = await seed({
      winner: 'player1',
      scores: { player1: 14, player2: 8 },
      phase: 'gameOver',
    });
    expect(board.querySelector('.contig-score-p1 strong')?.textContent).toBe('14');
    expect(board.querySelector('.contig-score-p2 strong')?.textContent).toBe('8');
  });
});
