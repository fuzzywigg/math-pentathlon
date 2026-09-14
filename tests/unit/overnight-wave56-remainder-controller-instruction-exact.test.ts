/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Remainder controller instruction. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { initGame } from '../../src/games/remainder-islands/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('remainder-islands-styles')?.remove();
  vi.restoreAllMocks();
});

describe('Wave 56 remainder — controller instruction exact', () => {
  it('after forced roll shows Select island + Roll Dice leftover', () => {
    // Math.random sequence: die1=3 (floor*6+1), die2=4
    const seq = [0.4, 0.6];
    let i = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => seq[i++] ?? 0.5);

    const root = document.createElement('div');
    document.body.appendChild(root);
    initGame(root);

    const roll = root.querySelector('.remainder-btn-roll') as HTMLButtonElement;
    expect(roll?.textContent).toBe('🎲 Roll Dice');
    roll.click();
    expect(root.querySelector('.remainder-instruction')?.textContent).toBe(
      'Select an island to land on'
    );
  });
});
