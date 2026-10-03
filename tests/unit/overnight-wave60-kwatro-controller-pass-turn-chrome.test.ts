/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro Pass Turn when stuck.
 * No prior Pass Turn chrome assertion. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';
import type { Chip } from '../../src/games/kwatro-sinko/types';

describe('Wave 60 kwatro — pass turn chrome', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('shows Pass Turn when current player has no valid moves', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);

    const chips = new Map(ctrl.state.chips);
    for (const [id, chip] of chips) {
      if (chip.owner === 'player1') {
        chips.set(id, { ...chip, position: null } satisfies Chip);
      }
    }
    const nodes = new Map(ctrl.state.nodes);
    for (const [id, node] of nodes) {
      if (node.chip?.owner === 'player1') {
        nodes.set(id, { ...node, chip: null });
      }
    }
    ctrl.state = {
      ...ctrl.state,
      chips,
      nodes,
      selectedChip: null,
      phase: 'selectingChip',
    };
    ctrl.update();

    const passBtn = Array.from(root.querySelectorAll('.kwa-btn-secondary')).find(
      (b) => b.textContent === 'Pass Turn'
    );
    expect(passBtn).toBeTruthy();
    expect(passBtn?.textContent).toBe('Pass Turn');
  });
});
