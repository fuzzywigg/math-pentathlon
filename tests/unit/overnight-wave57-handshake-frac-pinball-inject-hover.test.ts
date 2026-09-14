/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — frac × pinball choice hover CSS handshake.
 * Distinct from wave55/56 selector-only asserts. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 57 handshake — choice hover fills', () => {
  it('both engines share #2196F3 / #e3f2fd hover leftovers', () => {
    injectFracFactStyles();
    injectFractionPinballStyles();
    const frac =
      document.getElementById('frac-fact-styles')!.textContent || '';
    const pin =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(frac).toContain('.frac-choice-btn:hover');
    expect(pin).toContain('.pinball-choice-btn:hover');
    expect(frac).toContain('border-color: #2196F3');
    expect(pin).toContain('border-color: #2196F3');
    expect(frac).toContain('background: #e3f2fd');
    expect(pin).toContain('background: #e3f2fd');
  });
});
