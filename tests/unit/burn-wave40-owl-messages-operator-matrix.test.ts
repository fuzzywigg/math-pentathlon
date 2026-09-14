/**
 * Wave 40 — owlMessages condition operator matrix via addMessage.
 * After #177 physics-only; deepen operators beyond wave23. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { owlMessages } from '../../src/core/owl';
import { storage } from '../../src/core/storage';

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  vi.spyOn(Math, 'random').mockReturnValue(0);
});

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  storage.resetAll();
});

function preferCustom(category: Parameters<typeof owlMessages.getMessagesByCategory>[0]) {
  for (const m of owlMessages.getMessagesByCategory(category)) {
    if (!m.id.startsWith('wave40-')) storage.markMessageSeen(m.id);
  }
}

describe('Wave 40 owl-messages — operator matrix leftovers', () => {
  it('eq / gt / lt / gte / lte streak operators via addMessage', () => {
    owlMessages.addMessage({
      id: 'wave40-streak-eq',
      category: 'streak:update',
      priority: 'high',
      text: 'EQ {currentStreak}',
      conditions: [{ type: 'streak', value: 3, operator: 'eq' }],
    });
    owlMessages.addMessage({
      id: 'wave40-streak-gt',
      category: 'streak:update',
      priority: 'high',
      text: 'GT {currentStreak}',
      conditions: [{ type: 'streak', value: 5, operator: 'gt' }],
    });
    owlMessages.addMessage({
      id: 'wave40-streak-lt',
      category: 'streak:update',
      priority: 'high',
      text: 'LT {currentStreak}',
      conditions: [{ type: 'streak', value: 2, operator: 'lt' }],
    });
    owlMessages.addMessage({
      id: 'wave40-streak-lte',
      category: 'streak:update',
      priority: 'high',
      text: 'LTE {currentStreak}',
      conditions: [{ type: 'streak', value: 4, operator: 'lte' }],
    });

    preferCustom('streak:update');
    // Only eq matches among customs at streak=3 besides lte — mark lte seen
    storage.markMessageSeen('wave40-streak-lte');
    const eq = owlMessages.selectMessage('streak:update', { currentStreak: 3 });
    expect(eq?.id).toBe('wave40-streak-eq');
    expect(eq?.text).toBe('EQ 3');

    preferCustom('streak:update');
    storage.markMessageSeen('wave40-streak-eq');
    storage.markMessageSeen('wave40-streak-lte');
    const gt = owlMessages.selectMessage('streak:update', { currentStreak: 9 });
    expect(gt?.id).toBe('wave40-streak-gt');
    expect(gt?.text).toBe('GT 9');

    preferCustom('streak:update');
    storage.markMessageSeen('wave40-streak-gt');
    const lt = owlMessages.selectMessage('streak:update', { currentStreak: 1 });
    expect(lt?.id).toBe('wave40-streak-lt');
    expect(lt?.text).toBe('LT 1');

    // Reset seen so lte is selectable again; keep stock marked
    storage.resetAll();
    preferCustom('streak:update');
    storage.markMessageSeen('wave40-streak-eq');
    const lte = owlMessages.selectMessage('streak:update', { currentStreak: 4 });
    expect(lte?.id).toBe('wave40-streak-lte');
    expect(lte?.text).toBe('LTE 4');
  });

  it('gamesPlayed gte + winStreak default-eq + playerWon loss', () => {
    owlMessages.addMessage({
      id: 'wave40-gp-gte',
      category: 'game:start',
      priority: 'high',
      text: 'GP {gameName}',
      conditions: [{ type: 'gamesPlayed', value: 10, operator: 'gte' }],
    });
    preferCustom('game:start');
    const gp = owlMessages.selectMessage('game:start', {
      gameName: 'Juggle',
      gamesPlayedThisGame: 12,
    });
    expect(gp?.id).toBe('wave40-gp-gte');
    expect(gp?.text).toBe('GP Juggle');

    owlMessages.addMessage({
      id: 'wave40-ws-eq-default',
      category: 'game:end',
      priority: 'high',
      text: 'WS {winStreak}',
      conditions: [{ type: 'winStreak', value: 5 }], // default eq
    });
    preferCustom('game:end');
    const ws = owlMessages.selectMessage('game:end', {
      playerWon: true,
      winStreak: 5,
    });
    expect(ws?.id).toBe('wave40-ws-eq-default');
    expect(ws?.text).toBe('WS 5');

    preferCustom('game:end');
    storage.markMessageSeen('wave40-ws-eq-default');
    const loss = owlMessages.selectMessage('game:end', {
      playerWon: false,
      winStreak: 0,
    });
    expect(loss).toBeTruthy();
    expect(loss!.text.length).toBeGreaterThan(5);
  });

  it('empty category still null; format placeholders stable', () => {
    expect(owlMessages.selectMessage('game:move', {})).toBeNull();
    const morning = owlMessages.selectMessage('app:return', {
      playerName: 'Dee',
      timeOfDay: 'morning',
      currentStreak: 0,
    });
    expect(morning?.text).toMatch(/Dee|morning|math/i);
  });
});
