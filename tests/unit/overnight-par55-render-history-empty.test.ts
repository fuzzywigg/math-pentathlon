/**
 * Overnight TOKENMAXX HEAVY — par-55 history empty leftovers after #202.
 * Tests-only. Distinct from demos (#202) and wave43/44 Contig/SD/Star/Fab drafts.
 * No product inventing.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/par-55/rules';
import { renderMoveHistory, renderScores } from '../../src/games/par-55/board-ui';
import { CONFIG } from '../../src/games/par-55/types';

beforeEach(() => { document.body.innerHTML = ''; });
afterEach(() => { document.body.innerHTML = ''; });

describe('Overnight par55 — history empty + scores chrome', () => {
  it('empty history has title but no move rows', () => {
    const hist = renderMoveHistory(createInitialState());
    expect(hist.querySelector('h4')?.textContent).toMatch(/Move History/i);
    expect(hist.querySelectorAll('.par55-history-move').length).toBe(0);
  });

  it('scores chrome shows target', () => {
    const scores = renderScores(createInitialState());
    expect(scores.querySelector('.par55-target')?.textContent).toContain(String(CONFIG.TARGET_SCORE));
  });
});
