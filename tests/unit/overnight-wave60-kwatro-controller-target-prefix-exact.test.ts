/**
 * Overnight TOKENMAXX HEAVY leftovers after #289 — Kwatro target-info prefix exact.
 * Wave57 matches strong a+b-c; deepen full Create an alignment where: prefix. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 60 kwatro — target-info prefix exact', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('target-info starts with Create an alignment where:', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    const info = root.querySelector('.kwa-target-info');
    expect(info?.textContent).toBe(
      'Create an alignment where: a + b - c = 4 or 5'
    );
    expect(info?.innerHTML).toContain(
      'Create an alignment where: <strong>a + b - c = 4 or 5</strong>'
    );
  });
});
