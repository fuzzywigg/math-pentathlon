/**
 * Overnight TOKENMAXX HEAVY leftovers after #272 — frac × pinball final border handshake.
 * Wave57 locked pinball borders; deepen both engines leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFracFactStyles } from '../../src/games/frac-fact/board-ui';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('frac-fact-styles')?.remove();
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 58 handshake — final border tops', () => {
  it('both engines share player border-top leftovers', () => {
    injectFracFactStyles();
    injectFractionPinballStyles();
    const frac =
      document.getElementById('frac-fact-styles')!.textContent || '';
    const pin =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(frac).toContain(
      'border-top: 4px solid var(--color-player1, #2196F3)'
    );
    expect(pin).toContain(
      'border-top: 4px solid var(--color-player1, #2196F3)'
    );
    expect(frac).toContain(
      'border-top: 4px solid var(--color-player2, #e53935)'
    );
    expect(pin).toContain(
      'border-top: 4px solid var(--color-player2, #e53935)'
    );
  });
});
