/**
 * Wave 57 leftover after #263 — Kwatro target-info DOM copy. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { newGameVsHuman } from '../../src/games/kwatro-sinko/game-controller';

describe('Wave 57 kwatro — target info', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.getElementById('kwa-styles')?.remove();
  });

  it('kwa-target-info includes a + b - c = 4 or 5 strong', () => {
    const root = document.createElement('div');
    document.body.appendChild(root);
    newGameVsHuman(root);
    const info = root.querySelector('.kwa-target-info');
    expect(info?.innerHTML).toContain('<strong>a + b - c = 4 or 5</strong>');
    expect(info?.textContent).toMatch(/a \+ b - c = 4 or 5/);
  });
});
