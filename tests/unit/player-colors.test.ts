import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  applyGameModeChrome,
  clearGameModeChrome,
  getPlayerSeatColors,
} from '../../src/ui/player-colors';

describe('getPlayerSeatColors', () => {
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

  it('human mode → blue/red', () => {
    applyGameModeChrome(app, 'human-vs-human');
    const colors = getPlayerSeatColors();
    expect(colors.player1).toBe('#3b82f6');
    expect(colors.player2).toBe('#ef4444');
    expect(colors.player1Light).toBe('#bbdefb');
    expect(colors.player2Light).toBe('#ffcdd2');
  });

  it('ai mode default seat → P2 purple, P1 blue', () => {
    applyGameModeChrome(app, 'human-vs-ai');
    const colors = getPlayerSeatColors();
    expect(colors.player1).toBe('#3b82f6');
    expect(colors.player2).toBe('#8b5cf6');
    expect(colors.player1Light).toBe('#bbdefb');
    expect(colors.player2Light).toBe('#ddd6fe');
  });

  it('ai mode ai-seat=player1 → P1 purple, P2 red', () => {
    applyGameModeChrome(app, 'human-vs-ai', 'player1');
    const colors = getPlayerSeatColors();
    expect(colors.player1).toBe('#8b5cf6');
    expect(colors.player2).toBe('#ef4444');
    expect(colors.player1Light).toBe('#ddd6fe');
    expect(colors.player2Light).toBe('#ffcdd2');
  });
});
