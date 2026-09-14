/**
 * Overnight HEAVY leftover after #274 — missing playerName formats as friend.
 * Distinct from wave52 achievement placeholder format. Tests-only.
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

describe('Wave 58 core owl — select friend default name', () => {
  it('custom game:move without playerName substitutes friend', () => {
    owlMessages.addMessage({
      id: 'wave58-friend-probe',
      category: 'game:move',
      priority: 'high',
      text: 'Hello, {playerName}!',
    });
    const msg = owlMessages.selectMessage('game:move', {});
    expect(msg?.text).toBe('Hello, friend!');
  });
});
