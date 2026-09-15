/**
 * Wave 67 leftover after tip/#324 — Kwatro Pass Turn btn classes.
 * Wave60 locks Pass Turn text; deepen secondary class leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 67 kwatro — controller pass btn classes', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('Pass Turn uses kwa-btn kwa-btn-secondary when no valids', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    const ctrl = newGameVsHuman(root);
    for (const chip of ctrl.state.chips.values()) {
      if (chip.owner === 'player1' && chip.position) {
        const node = ctrl.state.nodes.get(chip.position);
        if (node) node.connections = [];
      }
    }
    ctrl.update();
    const btn = [...root.querySelectorAll('button')].find(
      (b) => b.textContent === 'Pass Turn'
    );
    expect(btn?.className).toBe('kwa-btn kwa-btn-secondary');
  });
});
