/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — frac × pinball status live handshake.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { initGame as initFrac } from '../../src/games/frac-fact/game-controller';
import { initGame as initPin } from '../../src/games/fraction-pinball/game-controller';

afterEach(() => {
  document.body.innerHTML = '';
  document.getElementById('frac-fact-styles')?.remove();
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 handshake — status live', () => {
  it('both controllers mount polite aria-live status leftover', () => {
    const fracRoot = document.createElement('div');
    const pinRoot = document.createElement('div');
    document.body.append(fracRoot, pinRoot);
    initFrac(fracRoot);
    initPin(pinRoot);
    const fracStatus = fracRoot.querySelector('.frac-status') as HTMLElement;
    const pinStatus = pinRoot.querySelector('.pinball-status') as HTMLElement;
    expect(fracStatus.getAttribute('aria-live')).toBe('polite');
    expect(pinStatus.getAttribute('aria-live')).toBe('polite');
    expect(fracStatus.getAttribute('role')).toBe('status');
    expect(pinStatus.getAttribute('role')).toBe('status');
  });
});
