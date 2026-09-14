/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — frac-fact × pinball Blue turn copy.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame as initFrac } from '../../src/games/frac-fact/game-controller';
import { initGame as initPinball } from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 handshake — Blue turn copy', () => {
  it('both engines open on 🔵 Blue\'s turn leftover', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.append(a, b);
    initFrac(a);
    initPinball(b);
    expect(a.querySelector('.frac-status')?.textContent).toBe("🔵 Blue's turn");
    expect(b.querySelector('.pinball-status')?.textContent).toBe(
      "🔵 Blue's turn"
    );
  });
});
