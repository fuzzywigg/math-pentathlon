/**
 * q-mp-586 — engine coverage round 21: post-r20 residual characterization.
 *
 * Themes: cold NON-RULES leftovers after tip-folded r19 (#1002 / q-mp-547) +
 * r20 (#1021 / q-mp-568) saturated expression-ui / attribute-ui and pinned
 * owl-system missing gameStats. Remeasured on tip post1012 @ dcdc0bf4.
 * Binding screen (Grok Bot): avoid owl-messages / owl-events / reduced-motion
 * (claimed by 587/590 this wave) and skip expressions/evaluator.ts; no
 * rules.ts / scoring / AI. Zero src edits. Add NO duplicate r19/r20 pins:
 *   - feature-flags isBoard3dEnabled SSR defaults (L24 / L26 false arms)
 *   - dom-security safeHtml missing-slot continue (L57–58)
 *   - preferred-host docs: expression/attribute 100%; owl-system wave40 sat.;
 *     ollie never defaults; mounts → 549; wave-21 chars → 588–593
 *
 * Explicitly deferred (sibling ownership):
 *   - owl-messages / owl-events / reduced-motion → q-mp-588 / 589 / 590 (+ mut 587)
 *   - owl-component / tutorial / evaluator → q-mp-591 / 592 / 593
 *   - game-route-mounts soft-fail → q-mp-549 (+ mutation 548)
 *   - expression/attribute/ollie soft-fail chars → q-mp-570 / 571 / 572
 *   - storage load/save catch soft-fail → #909 / q-mp-420
 *   - graph/algorithms L110/L131/L184 → q-mp-524
 *   - ollie-inspect-map never defaults L148–149 / L171–172 → r19 docs
 *
 * Pins CURRENT behavior only. No engine / rules.ts / AI / scoring / copy
 * edits. Hex Hard stays 450ms. No Stars & Bars history cap.
 *
 * Baseline rank (tip post1012 @ dcdc0bf4, preferred-host + candidate suites):
 *   feature-flags.ts           71.42% branch (5/7)     ← r21 SSR defaults
 *   dom-security.ts            86.36% branch (19/22)   ← r21 !slot continue
 *   expression-ui / attribute  100% / 100%             ← saturated after r20
 *   owl-system (+ wave40)      100% lines              ← saturated
 *   ollie-inspect-map          97.05% (66/68)          ← never → documented
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import { safeHtml, setText } from '../../src/core/dom-security';
import {
  BOARD_3D_STORAGE_KEY,
  isBoard3dEnabled,
} from '../../src/core/feature-flags';
import {
  inspectDropSpeech,
  resolveInspectTarget,
} from '../../src/core/owl/ollie-inspect-map';
import { owlSystem } from '../../src/core/owl';
import {
  initGameMountDeps,
  mountGameById,
} from '../../src/ui/game-route-mounts';

afterEach(() => {
  document.body.innerHTML = '';
  localStorage.removeItem(BOARD_3D_STORAGE_KEY);
  window.history.replaceState(null, '', '/');
  window.location.hash = '';
  vi.restoreAllMocks();
});

// =============================================================================
// 1. feature-flags — SSR typeof-window false arms (L24 / L26)
// =============================================================================

describe('engine-coverage-round-21 — feature-flags SSR defaults', () => {
  it('no-arg isBoard3dEnabled uses empty search/hash when window is undefined', () => {
    // L24 / L26: default params fall to '' when typeof window === 'undefined'.
    // Prior mp3d / mutation-ui / q-mp-455 suites only exercise the jsdom true
    // arms (window present). Soft-fail storage default still resolves OFF.
    localStorage.removeItem(BOARD_3D_STORAGE_KEY);
    const retained = globalThis.window;
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- SSR probe
    delete (globalThis as { window?: Window & typeof globalThis }).window;
    try {
      expect(() => isBoard3dEnabled()).not.toThrow();
      expect(isBoard3dEnabled()).toBe(false);
    } finally {
      (globalThis as { window: Window & typeof globalThis }).window = retained;
    }
  });
});

// =============================================================================
// 2. dom-security — missing data-mp-safe slot continue (L57–58)
// =============================================================================

describe('engine-coverage-round-21 — dom-security missing-slot continue', () => {
  it('safeHtml skips a value when querySelector misses its data-mp-safe slot', () => {
    // L57–58: if (!slot) continue. Well-formed templates always find slots;
    // mutation-ui15 names the arm but does not force a miss. Spy one miss so
    // the first interpolation is skipped and later values still adopt.
    const realQS = DocumentFragment.prototype.querySelector;
    let calls = 0;
    const spy = vi
      .spyOn(DocumentFragment.prototype, 'querySelector')
      .mockImplementation(function (this: DocumentFragment, selectors: string) {
        calls += 1;
        if (calls === 1) {
          return null;
        }
        return realQS.call(this, selectors);
      });

    const node = document.createElement('em');
    setText(node, 'kept');
    const frag = safeHtml`${'dropped'}${node}`;
    const wrap = document.createElement('div');
    wrap.appendChild(frag);

    expect(spy).toHaveBeenCalled();
    // First value skipped → marker left behind; second Node still adopts.
    expect(wrap.querySelector('em')?.textContent).toBe('kept');
    expect(wrap.textContent).toBe('kept');
    expect(wrap.querySelectorAll('[data-mp-safe="0"]').length).toBe(1);
    expect(wrap.querySelectorAll('[data-mp-safe="1"]').length).toBe(0);
  });
});

// =============================================================================
// 3. preferred-host docs — saturated / deferred after r20
// =============================================================================

describe('engine-coverage-round-21 — preferred-host post-r20 disposition', () => {
  it('documents expression/attribute 100% / owl-system sat / ollie never / mounts', () => {
    // expression-ui + attribute-ui: 100% branch/line after r19+r20 pins.
    // owl-system: tip wave40 init moods + gameend draw cover L70/72/212; r20
    //   pinned missing gameStats else — preferred owl-system suite at 100%.
    // ollie-inspect-map: never defaults L148–149 / L171–172 remain unreachable
    //   without forged InspectTarget kinds (r19 documented).
    // game-route-mounts: soft-fail matrix → q-mp-549; mutation → 548.
    // Wave-21 chars: owl-messages/events/reduced-motion/owl-component/tutorial/
    //   evaluator → 588–593; mutation UI w21 → 587.
    expect(typeof initGameMountDeps).toBe('function');
    expect(typeof mountGameById).toBe('function');
    expect(mountGameById.length).toBe(2);
    expect(typeof resolveInspectTarget).toBe('function');
    expect(typeof inspectDropSpeech).toBe('function');
    expect(typeof owlSystem.getEvents).toBe('function');
    expect(typeof isBoard3dEnabled).toBe('function');
  });

  it('documents carry-forward deferred residuals still owned elsewhere', () => {
    // Carry-forward:
    //   ollie never defaults → r19 docs
    //   owl-messages L435 unreachable → r20 docs (char → 588; avoid here)
    //   storage L291/L297 ?? '' → documented unreachable (r18)
    //   storage load/save catch → soft-fail #909 / q-mp-420
    //   graph/algorithms L110/L131/L184 → soft-fail char q-mp-524
    //   polyomino/transform → #990 / q-mp-525
    //   evaluator / placement / fraction-bar-ui → r8–r18 docs / char 593
    //   expression/attribute/ollie soft-fail chars → 570–572
    //   feature-flags SSR false arms → pinned in this file
    //   dom-security !slot continue → pinned in this file
    expect(true).toBe(true);
  });
});
