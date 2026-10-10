/**
 * q-mp-644 — Close `owl-messages` residual lines (tests-only characterization).
 *
 * Live tip re-measure (`cursor/mp-tip-post1023` @ `166d132d`):
 * - With `tests/unit/*owl-messages*` suites: **95.45%** lines / **95.74%**
 *   branches; uncovered **435**, **492** (matches backlog ~95.5% / ~95.7%).
 * - Overlay nullish residual **9** — leave HELD `#727` alone (no nullish clear).
 * - Tip-folded / open `#1033` / `q-mp-587` mutation-ui21 owl-messages — leave
 *   with `contained` (no mutation kill JSON / score pins here).
 *
 * Residuals owned here (ids / priority / conditions only — never message bodies):
 * - L492 `checkCondition` default arm — forge unknown `MessageCondition.type`
 *   via `addMessage` (public union closed; soft-match returns true).
 * - L435 fallback `selectAndFormat` — dead under stock `matchesConditions`
 *   (empty conditions always match → matching filter never empties while
 *   unconditional msgs exist; documented r20). Spy `matchesConditions` → false
 *   to exercise the fallback contract without `src/` edits.
 *
 * Constraints: tests only; zero `src/`; no copy/aria pins; no AI / rules /
 * scoring; no nullish ceiling / ratchet JSON; Hex Hard 450ms; no network.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { owlMessages } from '../../src/core/owl';
import type { MessageCondition } from '../../src/core/owl/owl-messages';
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

function markSeenExcept(
  category: Parameters<typeof owlMessages.getMessagesByCategory>[0],
  keepIds: ReadonlySet<string>
): void {
  for (const m of owlMessages.getMessagesByCategory(category)) {
    if (!keepIds.has(m.id)) storage.markMessageSeen(m.id);
  }
}

describe('q-mp-644 owl-messages residual lines', () => {
  it('unknown condition type soft-matches via checkCondition default (L492)', () => {
    owlMessages.addMessage({
      id: 'q644-unknown-cond',
      category: 'game:move',
      priority: 'high',
      text: 'placeholder-not-asserted',
      conditions: [
        {
          // Public union is closed; forge to exercise default arm.
          type: 'notARealCondition' as MessageCondition['type'],
          value: 1,
        },
      ],
    });

    markSeenExcept('game:move', new Set(['q644-unknown-cond']));
    const msg = owlMessages.selectMessage('game:move', {});
    expect(msg?.id).toBe('q644-unknown-cond');
    expect(msg?.priority).toBe('high');

    const catalog = owlMessages
      .getMessagesByCategory('game:move')
      .find((m) => m.id === 'q644-unknown-cond');
    expect(catalog?.conditions).toEqual([
      { type: 'notARealCondition', value: 1 },
    ]);
  });

  it('fallback selectAndFormat runs when matching filter is empty (L435)', () => {
    owlMessages.addMessage({
      id: 'q644-fallback-uncond',
      category: 'game:move',
      priority: 'normal',
      text: 'placeholder-not-asserted',
    });
    owlMessages.addMessage({
      id: 'q644-fallback-cond',
      category: 'game:move',
      priority: 'high',
      text: 'placeholder-not-asserted',
      conditions: [{ type: 'playerWon', value: true }],
    });

    // Stock matchesConditions treats empty conditions as always-true, so the
    // L435 fallback arm is otherwise unreachable while unconditional msgs
    // exist. Spy forces the matching filter empty; fallback keeps uncond only.
    const proto = Object.getPrototypeOf(owlMessages) as {
      matchesConditions: (message: unknown, context: unknown) => boolean;
    };
    vi.spyOn(proto, 'matchesConditions').mockReturnValue(false);

    markSeenExcept(
      'game:move',
      new Set(['q644-fallback-uncond', 'q644-fallback-cond'])
    );
    const msg = owlMessages.selectMessage('game:move', { playerWon: true });
    expect(msg?.id).toBe('q644-fallback-uncond');
    expect(msg?.priority).toBe('normal');
    expect(msg?.id).not.toBe('q644-fallback-cond');
  });
});
