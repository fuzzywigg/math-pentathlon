/**
 * Wave 58 leftover after #275 — Contig must-pass keeps player class. Tests-only.
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

describe('Wave 58 contig — must-pass player class', () => {
  it('keeps .contig-status.player1 with must-pass copy', async () => {
    const actual = await vi.importActual<typeof import('../../src/games/contig-60/types')>(
      '../../src/games/contig-60/types'
    );
    const base = actual.createInitialState();
    const cells = new Map(base.cells);
    for (const [id, cell] of cells) {
      cells.set(id, { ...cell, owner: 'player2' });
    }
    const { status } = await seed({
      cells,
      phase: 'calculating',
      currentDice: [2, 2, 2],
      currentPlayer: 'player1',
    });
    const el = status.querySelector('.contig-status');
    expect(el?.classList.contains('player1')).toBe(true);
    expect(el?.textContent).toMatch(/No valid moves - you must pass/);
  });
});
