/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — frac × pinball human chrome handshake.
 * Wave57 locked AI/Red turn; deepen human opponent leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import {
  initGame as initFrac,
  newGameVsHuman as fracVsHuman,
} from '../../src/games/frac-fact/game-controller';
import {
  initGame as initPin,
  newGameVsHuman as pinVsHuman,
} from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
  document.getElementById('fraction-pinball-styles')?.remove();
  document.getElementById('app')?.remove();
});

describe('Wave 58 handshake — human opponent chrome', () => {
  it('both engines clear AI chrome for HvH leftover', () => {
    const app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);

    const fracRoot = document.createElement('div');
    document.body.appendChild(fracRoot);
    initFrac(fracRoot);
    fracVsHuman('easy');
    expect(app.getAttribute('data-opponent')).toBeNull();
    expect(app.classList.contains('game-vs-ai')).toBe(false);
    expect(fracRoot.querySelector('.frac-status')).toBeTruthy();

    const pinRoot = document.createElement('div');
    document.body.appendChild(pinRoot);
    initPin(pinRoot);
    pinVsHuman();
    expect(app.getAttribute('data-opponent')).toBeNull();
    expect(app.classList.contains('game-vs-ai')).toBe(false);
    expect(pinRoot.querySelector('.pinball-status')).toBeTruthy();
  });
});
