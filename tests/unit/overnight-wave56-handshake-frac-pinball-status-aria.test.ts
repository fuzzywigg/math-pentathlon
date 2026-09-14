/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — frac-fact × pinball status aria handshake.
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

describe('Wave 56 handshake — status aria', () => {
  it('both engines mount polite live status leftover', () => {
    const a = document.createElement('div');
    const b = document.createElement('div');
    document.body.append(a, b);
    initFrac(a);
    initPinball(b);
    for (const sel of ['.frac-status', '.pinball-status']) {
      const el = document.querySelector(sel);
      expect(el?.getAttribute('role')).toBe('status');
      expect(el?.getAttribute('aria-live')).toBe('polite');
    }
  });
});
