/**
 * q-mp-589 — Characterize `owl-events` soft-fail residuals (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1012` @ `0ad33837`):
 * - `src/core/owl/owl-events.ts` **157** LOC (matches backlog)
 * - Dedicated `*owl-events*soft-fail*` residual files before this suite: **0**
 * - Prior suites: burn-wave23 / wave38 / wave40 (`*owl-events*`) — **12** `it`s;
 *   tip-folded `#1033` / `q-mp-587` `mutation-ui21-owl-events` — **5** `it`s
 * - Overlay nullish residual **5** (`handlers.get(...) || []` at on / unsub /
 *   emit-specific / emit-wildcard / off-filter) — do **not** clear (leave
 *   undrafted `q-mp-333`); leave HELD `#727` owl-messages alone
 *
 * Ownership (leave alone; do not edit product / competing suites):
 * - Undrafted `q-mp-333` nullish owl-events clear — leave (**contained**)
 * - Tip-folded `#1033` / `q-mp-587` mutation-ui21 owl-events — keep this suite
 *   on soft-fail keep-sites + empty-slot residual contracts only (no mutation
 *   kill JSON / score pins; separate `q-mp-589-*` file; do not re-pin w21
 *   happy-path order / clear / off-delete kills)
 * - burn-wave23 / wave38 / wave40 / burn-1008 off-empty — leave (**contained**)
 *
 * This suite owns soft-fail residual contracts still thin after those:
 *   source keep-sites for the five `|| []` arms, unsubscribe after type
 *   deleted / cleared, off(type, stranger) / off on never-registered type,
 *   double-unsubscribe soft no-op, emit only-specific / only-wildcard empty
 *   defaults, re-on after off soft-reseeds, OwlEventType catalog structural
 *   completeness (no player-facing copy / aria pins).
 *
 * Constraints: tests only; zero `src/` edits; no nullish ceiling write; no AI /
 * rules / scoring / copy / aria pins; Hex Hard 450ms; no network; no ratchet
 * JSON.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  OwlEventEmitter,
  type GameEndEvent,
  type GameStartEvent,
  type OwlEvent,
  type OwlEventType,
} from '../../src/core/owl/owl-events';

const OWL_EVENTS_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/core/owl/owl-events.ts'
  ),
  'utf8'
);

afterEach(() => {
  vi.restoreAllMocks();
});

function gameStart(partial: Partial<GameStartEvent> = {}): GameStartEvent {
  return {
    type: 'game:start',
    timestamp: 1,
    gameId: 'hex',
    gameName: 'Hex',
    division: 'intermediate',
    isFirstTime: true,
    timesPlayed: 0,
    ...partial,
  };
}

function gameEnd(partial: Partial<GameEndEvent> = {}): GameEndEvent {
  return {
    type: 'game:end',
    timestamp: 2,
    gameId: 'hex',
    gameName: 'Hex',
    playerWon: false,
    isDraw: false,
    duration: 1,
    moveCount: 0,
    winStreak: 0,
    isNewBestStreak: false,
    ...partial,
  };
}

const OWL_EVENT_TYPES: readonly OwlEventType[] = [
  'app:start',
  'app:return',
  'game:start',
  'game:end',
  'game:move',
  'tutorial:start',
  'tutorial:complete',
  'achievement:unlock',
  'streak:update',
  'streak:broken',
  'milestone:reached',
] as const;

// =============================================================================
// 1. Source soft-fail keep-sites
// =============================================================================

describe('q-mp-589 owl-events — source soft-fail keep-sites', () => {
  it('keeps exactly five handlers.get(...) || [] nullish soft-fail arms', () => {
    // Overlay prefer-nullish-coalescing residual **5** — leave q-mp-333.
    const emptyDefaults =
      OWL_EVENTS_SRC.match(/\.get\([^)]+\)\s*\|\|\s*\[\]/g) ?? [];
    expect(emptyDefaults).toHaveLength(5);
    expect(emptyDefaults.filter((s) => s.includes("get('*')"))).toHaveLength(1);
    expect(
      emptyDefaults.filter((s) => s.includes('get(event.type)'))
    ).toHaveLength(1);
    expect(emptyDefaults.filter((s) => s.includes('get(type)'))).toHaveLength(
      3
    );
  });

  it('keeps on/unsub/emit/off empty-slot soft-fail structure (no ?? clear)', () => {
    // Structural ownership only — nullish clear stays with undrafted 333.
    expect(OWL_EVENTS_SRC).toMatch(
      /const handlers = this\.handlers\.get\(type\) \|\| \[\];/
    );
    expect(OWL_EVENTS_SRC).toMatch(
      /const currentHandlers = this\.handlers\.get\(type\) \|\| \[\];/
    );
    expect(OWL_EVENTS_SRC).toMatch(
      /const specificHandlers = this\.handlers\.get\(event\.type\) \|\| \[\];/
    );
    expect(OWL_EVENTS_SRC).toMatch(
      /const wildcardHandlers = this\.handlers\.get\('\*'\) \|\| \[\];/
    );
    // off(type, handler) filter arm — same get(type) || [] form as on().
    const getTypeDefaults =
      OWL_EVENTS_SRC.match(/this\.handlers\.get\(type\) \|\| \[\]/g) ?? [];
    expect(getTypeDefaults.length).toBeGreaterThanOrEqual(3);
    // Do not pin ?? — clear owned by 333; this suite locks current || form.
    expect(OWL_EVENTS_SRC).not.toMatch(/\.get\([^)]+\)\s*\?\?\s*\[\]/);
  });

  it('keeps off without handler delete vs filter branch + clear wipe', () => {
    expect(OWL_EVENTS_SRC).toMatch(
      /if\s*\(\s*!handler\s*\)\s*\{\s*this\.handlers\.delete\(type\);/
    );
    expect(OWL_EVENTS_SRC).toMatch(
      /currentHandlers\.filter\(\(h\) => h !== handler\)/
    );
    expect(OWL_EVENTS_SRC).toMatch(
      /handlers\.filter\(\(h\) => h !== handler\)/
    );
    expect(OWL_EVENTS_SRC).toMatch(
      /clear\(\):\s*void\s*\{\s*this\.handlers\.clear\(\);/
    );
  });

  it('keeps OwlEventType catalog as eleven structural event ids', () => {
    for (const type of OWL_EVENT_TYPES) {
      expect(OWL_EVENTS_SRC).toContain(`'${type}'`);
    }
    const unionLiterals =
      OWL_EVENTS_SRC.match(/^\s*\| '([a-z]+:[a-z]+)'/gm) ?? [];
    expect(unionLiterals).toHaveLength(11);
  });
});

// =============================================================================
// 2. Empty-slot soft-fail residuals (orthogonal to mutation-ui21 happy pins)
// =============================================================================

describe('q-mp-589 owl-events — empty-slot soft-fail residuals', () => {
  it('unsubscribe after off(type) soft-noops via missing-slot || []', () => {
    const emitter = new OwlEventEmitter();
    const hits: string[] = [];
    const unsub = emitter.on('game:start', () => hits.push('a'));
    emitter.off('game:start');
    expect(() => unsub()).not.toThrow();
    emitter.emit(gameStart());
    expect(hits).toEqual([]);
  });

  it('unsubscribe after clear() soft-noops via missing-slot || []', () => {
    const emitter = new OwlEventEmitter();
    const spy = vi.fn();
    const unsub = emitter.on('*', spy);
    emitter.clear();
    expect(() => unsub()).not.toThrow();
    emitter.emit(gameStart());
    expect(spy).not.toHaveBeenCalled();
  });

  it('double unsubscribe is a soft no-op (second filter on empty/kept list)', () => {
    const emitter = new OwlEventEmitter();
    const a = vi.fn();
    const b = vi.fn();
    const offA = emitter.on('game:start', a);
    emitter.on('game:start', b);
    offA();
    expect(() => offA()).not.toThrow();
    emitter.emit(gameStart());
    expect(a).not.toHaveBeenCalled();
    expect(b).toHaveBeenCalledTimes(1);
  });

  it('off(type, stranger) on never-registered type soft-noops', () => {
    const emitter = new OwlEventEmitter();
    const stranger = vi.fn();
    expect(() => emitter.off('tutorial:complete', stranger)).not.toThrow();
    const keep = vi.fn();
    emitter.on('tutorial:complete', keep);
    emitter.emit({
      type: 'tutorial:complete',
      timestamp: 1,
      gameId: 'fiar',
      gameName: 'FIAR',
    });
    expect(keep).toHaveBeenCalledTimes(1);
    expect(stranger).not.toHaveBeenCalled();
  });

  it('off(type, stranger) when type exists but handler absent soft-keeps others', () => {
    const emitter = new OwlEventEmitter();
    const keep = vi.fn();
    const stranger = vi.fn();
    emitter.on('streak:broken', keep);
    emitter.off('streak:broken', stranger);
    emitter.emit({
      type: 'streak:broken',
      timestamp: 1,
      previousStreak: 3,
      daysMissed: 1,
    });
    expect(keep).toHaveBeenCalledTimes(1);
    expect(stranger).not.toHaveBeenCalled();
  });

  it('emit with only wildcard soft-uses empty specific || []', () => {
    const emitter = new OwlEventEmitter();
    const order: string[] = [];
    emitter.on('*', (e) => order.push(`*:${e.type}`));
    emitter.emit(gameEnd());
    expect(order).toEqual(['*:game:end']);
  });

  it('emit with only specific soft-uses empty wildcard || []', () => {
    const emitter = new OwlEventEmitter();
    const order: string[] = [];
    emitter.on('game:end', (e) => order.push(e.type));
    emitter.emit(gameEnd());
    expect(order).toEqual(['game:end']);
  });

  it('re-on after off(type) soft-reseeds empty slot via on() || []', () => {
    const emitter = new OwlEventEmitter();
    const first = vi.fn();
    const second = vi.fn();
    emitter.on('app:return', first);
    emitter.off('app:return');
    emitter.on('app:return', second);
    const evt: OwlEvent = {
      type: 'app:return',
      timestamp: 1,
      daysSinceLastVisit: 2,
      currentStreak: 0,
    };
    emitter.emit(evt);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});

// =============================================================================
// 3. Catalog soft wiring residuals (structural ids only)
// =============================================================================

describe('q-mp-589 owl-events — catalog soft wiring residuals', () => {
  it('every OwlEventType accepts on/emit/off without throw (empty-slot soft path)', () => {
    const emitter = new OwlEventEmitter();
    const seen: OwlEventType[] = [];
    for (const type of OWL_EVENT_TYPES) {
      const unsub = emitter.on(type, (e) => {
        seen.push(e.type);
      });
      // Minimal structurally-valid payloads per discriminant — no copy pins.
      const event = minimalEvent(type);
      expect(() => emitter.emit(event)).not.toThrow();
      unsub();
      emitter.off(type);
    }
    expect(seen).toEqual([...OWL_EVENT_TYPES]);
  });

  it('game:move typed id is wired even though no dedicated GameMoveEvent shape', () => {
    // Catalog includes game:move; emitter treats it as a soft type key only.
    expect(OWL_EVENT_TYPES).toContain('game:move');
    const emitter = new OwlEventEmitter();
    const spy = vi.fn();
    emitter.on('game:move', spy);
    // Cast: no dedicated interface — soft residual of the type catalog.
    emitter.emit({ type: 'game:move', timestamp: 9 } as OwlEvent);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy.mock.calls[0][0]).toMatchObject({
      type: 'game:move',
      timestamp: 9,
    });
  });
});

function minimalEvent(type: OwlEventType): OwlEvent {
  switch (type) {
    case 'app:start':
      return {
        type,
        timestamp: 1,
        isFirstVisit: false,
        daysSinceLastVisit: 0,
      };
    case 'app:return':
      return {
        type,
        timestamp: 1,
        daysSinceLastVisit: 1,
        currentStreak: 0,
      };
    case 'game:start':
      return gameStart();
    case 'game:end':
      return gameEnd();
    case 'game:move':
      return { type: 'game:move', timestamp: 1 } as OwlEvent;
    case 'tutorial:start':
      return {
        type,
        timestamp: 1,
        gameId: 'hex',
        gameName: 'Hex',
      };
    case 'tutorial:complete':
      return {
        type,
        timestamp: 1,
        gameId: 'hex',
        gameName: 'Hex',
      };
    case 'achievement:unlock':
      return {
        type,
        timestamp: 1,
        achievementId: 'q-mp-589',
        achievementName: 'id',
        achievementDescription: 'id',
      };
    case 'streak:update':
      return {
        type,
        timestamp: 1,
        currentStreak: 1,
        isNewRecord: false,
        previousBest: 0,
      };
    case 'streak:broken':
      return {
        type,
        timestamp: 1,
        previousStreak: 1,
        daysMissed: 1,
      };
    case 'milestone:reached':
      return {
        type,
        timestamp: 1,
        milestoneType: 'games_played',
        value: 1,
        description: 'id',
      };
    default: {
      const _exhaustive: never = type;
      throw new Error(`unexpected OwlEventType: ${String(_exhaustive)}`);
    }
  }
}
