/**
 * Wave 65 leftover after tip/#315 — Juggle inject die.selectable cursor.
 * Hover scale/shadow locked; base selectable cursor not. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject die selectable cursor', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-die.selectable cursor pointer', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-die\.selectable\s*\{[^}]*cursor:\s*pointer/
    );
  });
});
