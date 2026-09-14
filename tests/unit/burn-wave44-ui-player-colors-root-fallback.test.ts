/**
 * Wave 44 overnight HEAVY — getGameModeChromeRoot fallbacks.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getGameModeChromeRoot,
  applyGameModeChrome,
  clearGameModeChrome,
  getPlayerSeatColors,
} from '../../src/ui/player-colors';

describe('Wave 44 UI — chrome root fallback', () => {
  let app: HTMLElement;
  beforeEach(() => {
    app = document.createElement('div');
    app.id = 'app';
    document.body.appendChild(app);
  });
  afterEach(() => {
    clearGameModeChrome(app);
    app.remove();
  });

  it('explicit root wins; null root uses #app', () => {
    expect(getGameModeChromeRoot(app)).toBe(app);
    expect(getGameModeChromeRoot(null)?.id).toBe('app');
    applyGameModeChrome(app, 'human-vs-ai');
    expect(getPlayerSeatColors().player2).toBe('#8b5cf6');
  });
});
