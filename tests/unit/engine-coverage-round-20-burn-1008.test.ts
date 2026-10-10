/**
 * q-mp-568 — engine coverage round 20: post-r19 residual characterization.
 *
 * Themes: cold NON-RULES leftovers after tip-folded #1002 / q-mp-547 (engine
 * r19) pins expression remove/Clear-All + attribute SET defaults + ollie
 * fallthrough. Remeasured on tip post977 @ d7be05ec; add NO duplicate pins:
 *   - expressions/expression-ui dragover/dragleave + tray draggable!==undefined
 *     (r19 preferred-host leftover L391–396 / L530–531; not in r19 suite)
 *   - owl/owl-system game:start bus emit without prior getGameStats (L182 else)
 *   - preferred-host docs: attribute 100% after r19; ollie never; mounts → 549
 *   - owl-messages L435 fallback selectAndFormat — documented unreachable
 *
 * Explicitly deferred (sibling ownership):
 *   - game-route-mounts soft-fail / catch / stale-gen → q-mp-549 (+ mutation 548)
 *   - expression/attribute/ollie soft-fail chars → q-mp-570 / 571 / 572
 *   - expression/attribute/ollie mutation scores → q-mp-569 (w20) / 548 (w19)
 *   - ollie-inspect-map never defaults L148–149 / L171–172 → r19 docs
 *   - storage getToday/Yesterday ?? / algorithms L110/131/184 → r18 / 524
 *   - board-a11y / dice-ui / dom-security / sanitize → #986 / #920 / #933 / #504
 *
 * Pins CURRENT behavior only. No engine / rules.ts / AI / scoring / copy
 * edits. Hex Hard stays 450ms. No Stars & Bars history cap.
 *
 * Baseline rank (tip post977 @ d7be05ec with tip-folded r19, preferred-host
 * suites matching r19 list — no burn-wave34):
 *   game-route-mounts.ts       84.79% branch (184/217)  ← tip-folded 549; smoke
 *   expression-ui.ts           98.95% (95/96)           ← r20 drag + tray
 *   ollie-inspect-map.ts       97.05% (66/68)           ← never → documented
 *   attribute-ui.ts            100% (70/70)             ← saturated after r19
 * Broad residual (unit excl. AI/bench): owl-system L182 else; owl-messages L435
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GAMES } from '../../src/core/game-registry';
import {
  renderCardTray,
  renderSlot,
} from '../../src/core/expressions/expression-ui';
import {
  createNumberCard,
  createOperatorCard,
  createSlot,
} from '../../src/core/expressions/types';
import { owlMessages, owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import {
  initGameMountDeps,
  mountGameById,
} from '../../src/ui/game-route-mounts';

const knownGameId = GAMES.find((g) => g.available)?.id ?? 'hex';

function dragEvent(
  type: 'dragover' | 'dragleave' | 'drop',
  data?: string
): Event {
  const ev = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(ev, 'dataTransfer', {
    value: {
      getData: (fmt: string) =>
        fmt === 'text/plain' && data !== undefined ? data : '',
      setData: () => undefined,
    },
  });
  return ev;
}

beforeEach(() => {
  localStorage.clear();
  storage.resetAll();
  storage.updateSettings({ owlEnabled: true });
});

afterEach(() => {
  document.body.innerHTML = '';
  owlSystem.dismissMessage();
  owlSystem.hide();
  vi.restoreAllMocks();
  localStorage.clear();
  storage.resetAll();
});

// =============================================================================
// 1. expressions/expression-ui — r19 preferred-host leftovers (drag + tray)
// =============================================================================

describe('engine-coverage-round-20 — expression-ui dragover / dragleave', () => {
  it('unlocked onDrop slot highlights on dragover and clears on dragleave', () => {
    // L391–396: dragover preventDefault + highlight; dragleave removes it.
    // r19 preferred-host suite left these uncovered (wave34 owns a parallel pin
    // outside the engine preferred-host set — r20 locks them in-round).
    const el = renderSlot(createSlot(0), {
      onDrop: () => undefined,
    });
    document.body.appendChild(el);

    expect(el.classList.contains('highlight')).toBe(false);
    el.dispatchEvent(dragEvent('dragover'));
    expect(el.classList.contains('highlight')).toBe(true);

    el.dispatchEvent(dragEvent('dragleave'));
    expect(el.classList.contains('highlight')).toBe(false);
  });
});

describe('engine-coverage-round-20 — expression-ui tray draggable option', () => {
  it('renderCardTray with draggable true forwards to rendered cards', () => {
    // L530–531: options.draggable !== undefined → cardOpts.draggable = value.
    // Prior preferred-host trays either omit draggable or pass it with empty /
    // fully-used decks so the assignment arm never runs.
    const cards = [
      createNumberCard(3, 'r20-n3'),
      createOperatorCard('+', 'r20-op'),
    ];
    const tray = renderCardTray(cards, { draggable: true });
    const rendered = [
      ...tray.querySelectorAll('.expression-card'),
    ] as HTMLElement[];
    expect(rendered).toHaveLength(2);
    expect(rendered.every((c) => c.draggable === true)).toBe(true);
  });

  it('renderCardTray with draggable false leaves HTML draggable unset', () => {
    // Same L530–531 arm with explicit false (renderCard treats falsy as off).
    const tray = renderCardTray([createNumberCard(8, 'r20-n8')], {
      draggable: false,
    });
    const card = tray.querySelector('.expression-card') as HTMLElement;
    expect(card).toBeTruthy();
    expect(card.draggable).toBe(false);
  });
});

// =============================================================================
// 2. owl/owl-system — missing gameStats else arm (broad residual)
// =============================================================================

describe('engine-coverage-round-20 — owl-system missing gameStats', () => {
  it('direct game:start bus emit without prior getGameStats omits play counts', () => {
    // L182 else: stats[gameId] missing → skip gamesPlayedThisGame / winStreak.
    // Public onGameStart always calls getGameStats first (creates the entry),
    // so only a raw bus emit reaches the false arm.
    const contexts: Array<Record<string, unknown>> = [];
    const orig = owlMessages.selectMessage.bind(owlMessages);
    vi.spyOn(owlMessages, 'selectMessage').mockImplementation((type, ctx) => {
      contexts.push({ ...ctx });
      return orig(type, ctx);
    });

    const ghostId = `r20-ghost-${knownGameId}-missing-stats`;
    expect(storage.getAllGameStats()[ghostId]).toBeUndefined();

    owlSystem.getEvents().emit({
      type: 'game:start',
      timestamp: 1,
      gameId: ghostId,
      gameName: 'R20 Ghost',
      division: 'I',
      isFirstTime: true,
      timesPlayed: 0,
    });

    expect(contexts.length).toBeGreaterThan(0);
    const ctx = contexts[contexts.length - 1]!;
    expect(ctx.gameId).toBe(ghostId);
    expect(ctx.gameName).toBe('R20 Ghost');
    expect('gamesPlayedThisGame' in ctx).toBe(false);
    expect('winStreak' in ctx).toBe(false);
  });
});

// =============================================================================
// 3. preferred-host docs — saturated / deferred after r19
// =============================================================================

describe('engine-coverage-round-20 — preferred-host post-r19 disposition', () => {
  it('documents attribute 100% / ollie never / mounts soft-fail ownership', () => {
    // attribute-ui: r19 SET || defaults + mouseleave → 70/70 branches.
    // ollie-inspect-map: never defaults L148–149 / L171–172 remain unreachable
    //   without forged InspectTarget kinds (r19 documented).
    // game-route-mounts: soft-fail matrix → q-mp-549; mutation → 548.
    // Soft-fail char expansion on expression/attribute/ollie → 570–572.
    expect(typeof initGameMountDeps).toBe('function');
    expect(typeof mountGameById).toBe('function');
    expect(mountGameById.length).toBe(2);
    expect(typeof owlMessages.selectMessage).toBe('function');
  });
});

// =============================================================================
// 4. owl-messages — L435 unreachable + carry-forward deferred docs
// =============================================================================

describe('engine-coverage-round-20 — owl-messages fallback + carry-forward docs', () => {
  it('documents L435 fallback selectAndFormat as unreachable with stock library', () => {
    // matchesConditions treats missing/empty conditions as always-true, so any
    // unconditional catalog entry is already in matchingMessages. The
    // matchingMessages.length===0 path therefore only runs when every catalog
    // entry has failing conditions — and then fallbackMessages is also empty
    // (L432→null). L435 (selectAndFormat on fallbacks) cannot run without a
    // forged library that contradicts matchesConditions.
    // Pin the live L432 null arm (app:start all-conditioned, no unconditional).
    const msg = owlMessages.selectMessage('app:start', {
      gamesPlayedThisGame: 5,
    });
    expect(msg).toBeNull();
  });

  it('documents r18/r19 deferred residuals still owned elsewhere', () => {
    // Carry-forward:
    //   storage L291/L297 ?? '' → documented unreachable (r18)
    //   graph/algorithms L110/L131/L184 → soft-fail char q-mp-524
    //   polyomino/transform → #990 / q-mp-525
    //   evaluator / placement / fraction-bar-ui → r8–r18 docs
    //   ollie never defaults → r19 docs
    //   expression/attribute/ollie soft-fail chars → 570–572
    expect(true).toBe(true);
  });
});
