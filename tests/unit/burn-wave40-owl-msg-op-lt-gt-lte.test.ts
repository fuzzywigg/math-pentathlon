/**
 * Wave 40 — Owl message compareNumber lt/gt/lte/eq/gte operator matrix.
 * Tests-only leftover after #178. Uses addMessage only (no product inventing).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { owlMessages } from '../../src/core/owl/owl-messages';
import type { OwlMessage } from '../../src/core/owl/owl-messages';
import { storage } from '../../src/core/storage';

const CAT = 'streak:update' as const;
/** Library streak:update uses eq 2 / eq 7 — stay far away. */
const STREAK = 404;

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  vi.spyOn(Math, 'random').mockReturnValue(0);
  // Hide unconditional library streak-record so our injects dominate the pool
  storage.markMessageSeen('streak-record-1');
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  storage.resetAll();
});

describe('Wave 40 owl — streak operator matrix', () => {
  it('lt / gt / lte / gte / eq filter streak correctly', () => {
    const stamp = Date.now();
    const msgs: OwlMessage[] = [
      {
        id: `w40-lt-${stamp}`,
        category: CAT,
        priority: 'high',
        text: 'lt',
        conditions: [{ type: 'streak', value: STREAK, operator: 'lt' }],
      },
      {
        id: `w40-gt-${stamp}`,
        category: CAT,
        priority: 'high',
        text: 'gt',
        conditions: [{ type: 'streak', value: STREAK, operator: 'gt' }],
      },
      {
        id: `w40-lte-${stamp}`,
        category: CAT,
        priority: 'high',
        text: 'lte',
        conditions: [{ type: 'streak', value: STREAK, operator: 'lte' }],
      },
      {
        id: `w40-gte-${stamp}`,
        category: CAT,
        priority: 'high',
        text: 'gte',
        conditions: [{ type: 'streak', value: STREAK, operator: 'gte' }],
      },
      {
        id: `w40-eq-${stamp}`,
        category: CAT,
        priority: 'high',
        text: 'eq',
        conditions: [{ type: 'streak', value: STREAK, operator: 'eq' }],
      },
    ];
    for (const m of msgs) owlMessages.addMessage(m);

    const pick = (streak: number) =>
      owlMessages.selectMessage(CAT, { currentStreak: streak });

    const below = pick(STREAK - 1);
    expect(below).toBeTruthy();
    expect(['lt', 'lte']).toContain(below!.text);

    const exact = pick(STREAK);
    expect(exact).toBeTruthy();
    expect(['lte', 'gte', 'eq']).toContain(exact!.text);

    const above = pick(STREAK + 1);
    expect(above).toBeTruthy();
    expect(['gt', 'gte']).toContain(above!.text);
  });

  it('default operator behaves as eq when omitted', () => {
    const uniqueGames = 888002;
    owlMessages.addMessage({
      id: `w40-default-eq-${Date.now()}`,
      category: CAT,
      priority: 'high',
      text: 'default-eq',
      conditions: [{ type: 'gamesPlayed', value: uniqueGames }],
    });
    // Mark prior streak injects seen so gamesPlayed message is preferred
    for (const m of owlMessages.getMessagesByCategory(CAT)) {
      if (m.id.startsWith('w40-') && m.text !== 'default-eq') {
        storage.markMessageSeen(m.id);
      }
    }
    storage.markMessageSeen('streak-record-1');
    const hit = owlMessages.selectMessage(CAT, {
      gamesPlayedThisGame: uniqueGames,
      currentStreak: 0,
    });
    expect(hit?.text).toBe('default-eq');
  });
});
