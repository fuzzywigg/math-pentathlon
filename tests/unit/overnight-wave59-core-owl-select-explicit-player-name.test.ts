/**
 * Overnight HEAVY leftover after #280 — selectMessage explicit playerName.
 * Opposite of wave58 friend default-name leftover. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
});

afterEach(() => {
  localStorage.clear();
  storage.resetAll();
});

describe('Wave 59 core owl — select explicit player name', () => {
  it('custom game:move formats provided playerName', () => {
    owlMessages.addMessage({
      id: 'wave59-name-probe',
      category: 'game:move',
      priority: 'high',
      text: 'Hello, {playerName}!',
    });
    const msg = owlMessages.selectMessage('game:move', {
      playerName: 'Ada',
    });
    expect(msg?.text).toBe('Hello, Ada!');
  });
});
