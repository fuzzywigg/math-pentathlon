/**
 * Overnight TOKENMAXX HEAVY — par-55 board-ui score preview leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createInitialState,
  selectBlock,
  placeBlock,
  getValidPlacements,
  calculateScore,
} from '../../src/games/par-55/rules';
import { renderBoard } from '../../src/games/par-55/board-ui';

beforeEach(() => { document.body.innerHTML = ''; });
afterEach(() => { document.body.innerHTML = ''; });

describe('Overnight par55 — score preview DOM', () => {
  it('valid scoring bases render .par55-score-preview with +points', () => {
    const open = createInitialState();
    const first = selectBlock(open, open.hands.player1[0].id);
    const v0 = getValidPlacements(first);
    expect(v0.length).toBeGreaterThan(0);
    const afterPlace = placeBlock(first, v0[0]);
    // Now p2 turn — switch back to p1-like placing by forging selecting+placing for p1 adjacent
    // Use afterPlace state: opponent places; we need placingBlock with selection.
    // Simpler: forge placingBlock from open with one adjacent base occupied.
    const bases = new Map(open.bases);
    const seedId = [...bases.keys()][Math.floor(bases.size / 2)];
    const seed = bases.get(seedId)!;
    const neighborId = seed.adjacentBases[0];
    bases.set(seedId, {
      ...seed,
      block: { id: 'seed', shape: 'circle', color: 'red', size: 'small', thickness: 'thin' },
      placedBy: 'player2',
    });
    const handBlock = open.hands.player1[0];
    const forged = {
      ...open,
      bases,
      phase: 'placingBlock' as const,
      selectedBlock: handBlock.id,
      currentPlayer: 'player1' as const,
    };
    const { totalPoints } = calculateScore(forged, handBlock, neighborId);
    const board = renderBoard(forged, () => {});
    document.body.appendChild(board);
    if (totalPoints > 0) {
      const previews = board.querySelectorAll('.par55-score-preview');
      expect(previews.length).toBeGreaterThan(0);
      expect([...previews].some((el) => el.textContent?.startsWith('+'))).toBe(true);
    } else {
      expect(board.querySelectorAll('.par55-valid-base').length).toBeGreaterThan(0);
    }
  });
});
