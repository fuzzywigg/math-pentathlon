/**
 * Wave 58 leftover after #275 — Contig must-pass plus pass warning. Tests-only.
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

describe('Wave 58 contig — must-pass with warning', () => {
  it('must-pass copy includes (2/3 passes) leftover', async () => {
    const actual = await vi.importActual<typeof import('../../src/games/contig-60/types')>(
      '../../src/games/contig-60/types'
    );
    const base = actual.createInitialState();
    const cells = new Map(base.cells);
    for (const [id, cell] of cells) {
      cells.set(id, { ...cell, owner: 'player1' });
    }
    const { status } = await seed({
      cells,
      phase: 'calculating',
      currentDice: [3, 3, 3],
      consecutivePasses: { player1: 2, player2: 0 },
    });
    const text = status.querySelector('.contig-status')?.textContent ?? '';
    expect(text).toMatch(/No valid moves - you must pass/);
    expect(text).toMatch(/\(2\/3 passes\)/);
  });
});
