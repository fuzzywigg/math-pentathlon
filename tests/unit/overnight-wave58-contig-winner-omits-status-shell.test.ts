/**
 * Wave 58 leftover after #275 — Contig winner omits contig-status shell. Tests-only.
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

describe('Wave 58 contig — winner omits status shell', () => {
  it('does not mount .contig-status when winner set', async () => {
    const { status } = await seed({
      winner: 'player1',
      scores: { player1: 9, player2: 2 },
      phase: 'gameOver',
    });
    expect(status.querySelector('.contig-status')).toBeNull();
    expect(status.querySelector('.contig-winner-banner')).toBeTruthy();
  });
});
