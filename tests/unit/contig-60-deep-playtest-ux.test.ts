/**
 * Contig 60 deep-playtest UX guards (2026-10-07):
 * touch targets, board-before-expressions, Hard lookahead wiring, status copy.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it, expect, afterEach, vi } from 'vitest';
import {
  ContigState,
  createInitialState,
} from '../../src/games/contig-60/types';
import { getAIPlacement } from '../../src/games/contig-60/ai';
import {
  initGame,
  newGameVsAI,
} from '../../src/games/contig-60/game-controller';
import { injectContigStyles } from '../../src/games/contig-60/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('contig-styles')?.remove();
  vi.restoreAllMocks();
});

function claim(
  values: number[],
  owner: 'player1' | 'player2',
  base = createInitialState()
): ContigState {
  const cells = new Map(base.cells);
  for (const value of values) {
    cells.set(value, { ...cells.get(value)!, owner });
  }
  return { ...base, cells };
}

describe('Contig 60 deep playtest UX', () => {
  it('narrow viewport CSS keeps cells at ≥44px (not 40px)', () => {
    injectContigStyles();
    const css = document.getElementById('contig-styles')?.textContent ?? '';
    expect(css).toMatch(
      /@media\s*\(max-width:\s*600px\)\s*\{[\s\S]*?\.contig-cell\s*\{[\s\S]*?min-width:\s*44px/
    );
    expect(css).not.toMatch(/min-width:\s*40px/);
    expect(css).not.toMatch(/width:\s*40px/);
  });

  it('roll/pass chrome stay ≥44px in shared stylesheet', () => {
    const css = readFileSync(join(process.cwd(), 'src/style.css'), 'utf8');
    expect(css).toMatch(/\.contig-roll-btn\s*\{[\s\S]*?min-height:\s*44px/);
    expect(css).toMatch(/\.contig-pass-btn\s*\{[\s\S]*?min-height:\s*44px/);
  });

  it('renders the board before the expression list on calculating', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    (board.querySelector('.contig-roll-btn') as HTMLButtonElement).click();

    const kids = [...board.children];
    const boardIdx = kids.findIndex((el) =>
      el.classList.contains('contig-board')
    );
    const exprIdx = kids.findIndex((el) =>
      el.classList.contains('contig-expressions')
    );
    expect(boardIdx).toBeGreaterThanOrEqual(0);
    expect(exprIdx).toBeGreaterThanOrEqual(0);
    expect(boardIdx).toBeLessThan(exprIdx);
    expect(status.textContent).toMatch(/Tap a green number/);
  });

  it('hard prefers blocking an open 5-threat over a high-point elsewhere', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    // Opponent one move from horizontal five (1-4); 5 blocks.
    // Dice [3,3,4] can make 5 ((3*3)-4) or 36 (3*3*4). Own a few chips
    // near 36 for adjacency bait — but not a 5-in-a-row win at 36.
    let state = claim([1, 2, 3, 4], 'player2');
    state = claim([35, 40], 'player1', state);
    state = {
      ...state,
      phase: 'calculating',
      currentDice: [3, 3, 4],
      currentPlayer: 'player1',
    };

    const hard = getAIPlacement(state, 'player1', 'hard');
    expect(hard).not.toBeNull();
    expect(hard!.value).toBe(5);

    const medium = getAIPlacement(state, 'player1', 'medium');
    expect(medium).not.toBeNull();
    expect(medium!.value).toBe(5);
  });

  it('AI seat still shows thinking chrome after vs-AI start on rolling', () => {
    const board = document.createElement('div');
    const status = document.createElement('div');
    document.body.append(board, status);
    initGame(board, status);
    newGameVsAI('easy');
    expect(status.textContent).toMatch(/Blue's turn/);
    expect(board.querySelector('.contig-roll-btn')).toBeTruthy();
  });
});
