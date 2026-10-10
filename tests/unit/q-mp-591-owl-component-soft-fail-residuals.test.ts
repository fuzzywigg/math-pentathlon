/**
 * q-mp-591 — Characterize `owl-component` soft-fail residuals (tests-only).
 *
 * Live tip re-measure (`cursor/mp-tip-post1012` @ tip HEAD used for branch cut):
 *   `src/ui/owl/owl-component.ts` **800** LOC (matches backlog)
 *   Dedicated `*owl-component*soft-fail*residuals*` files before: **0**
 *   Overlay nnnull residual **1** (`this.container!` mood toggle @ L595)
 *   Overlay nullish residual **1** (`closest(character) || closest(minimized)` @ L259)
 *   Soft-fail inventory: size `|| 64` arms, viewport `|| 390`/`|| 844`,
 *     parseFloat `|| 0`, pointer-capture try/catch, elementFromPoint typeof
 *     soft-null, ResizeObserver undefined / empty-entry early returns,
 *     optional querySelector wires, owlEnabled soft-hide
 *
 * Ownership (leave alone; do not edit product / competing suites):
 *   Undrafted `q-mp-366` void owl-component + `q-mp-328` layout — leave
 *     **contained**; no nnnull/nullish/void ceiling writes here
 *   HELD `#727` / `q-mp-186` owl-messages nullish clear — leave alone
 *   Tip-folded chrome / drag / ResizeObserver / capture suites
 *     (`burn-wave25`, `burn-1009`/`1010`, `mutation-ui5`/`16`,
 *     `owl-drag-shell`, `owl-drop-inspect`) — do not re-pin their arms;
 *     this suite owns soft-fail residual keep-sites + thin behavioral
 *     residuals (zero-size soft-default, minimized-handle nullish arm,
 *     mood nnnull site after guard, pre-init soft APIs)
 *   Open soft-fail/mutation drafts on other hosts (`#1025`–`#1034`) —
 *     leave open; hosts disjoint
 *
 * Constraints: tests only; zero `src/` edits; no player-facing copy /
 * aria / label / title string pins; no AI / rules / scoring; Hex Hard
 * 450ms untouched; no network; no ratchet JSON.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { owlSystem } from '../../src/core/owl';
import { storage } from '../../src/core/storage';
import { OwlComponent, owlComponent } from '../../src/ui/owl/owl-component';

const OWL_COMPONENT_SRC = readFileSync(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '../../src/ui/owl/owl-component.ts'
  ),
  'utf8'
);

function dispatchPointer(
  el: Element,
  type: string,
  init: Partial<PointerEventInit> & { clientX: number; clientY: number }
): void {
  const event = new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    pointerId: 1,
    pointerType: 'touch',
    isPrimary: true,
    button: 0,
    buttons: type === 'pointerup' || type === 'pointercancel' ? 0 : 1,
    ...init,
  });
  el.dispatchEvent(event);
}

function stubPointer(root: HTMLElement, rect: Partial<DOMRect> = {}): void {
  vi.spyOn(root, 'getBoundingClientRect').mockReturnValue({
    x: 300,
    y: 8,
    left: 300,
    top: 8,
    right: 364,
    bottom: 72,
    width: 64,
    height: 64,
    toJSON: () => ({}),
    ...rect,
  });
  if (!root.setPointerCapture) {
    root.setPointerCapture = vi.fn();
  } else {
    vi.spyOn(root, 'setPointerCapture').mockImplementation(() => undefined);
  }
  if (!root.releasePointerCapture) {
    root.releasePointerCapture = vi.fn();
  } else {
    vi.spyOn(root, 'releasePointerCapture').mockImplementation(() => undefined);
  }
  if (!root.hasPointerCapture) {
    root.hasPointerCapture = vi.fn(() => true);
  } else {
    vi.spyOn(root, 'hasPointerCapture').mockReturnValue(true);
  }
  document.elementFromPoint = vi.fn(
    () => null
  ) as typeof document.elementFromPoint;
}

describe('q-mp-591 owl-component soft-fail residuals', () => {
  let owl: OwlComponent;

  beforeEach(() => {
    localStorage.clear();
    storage.resetAll();
    storage.updateSettings({ owlEnabled: true });
    owlSystem.hide();
    owlSystem.dismissMessage();
    document.body.innerHTML = '';
    owl = new OwlComponent();
  });

  afterEach(() => {
    owl.destroy();
    owlComponent.destroy();
    document.body.innerHTML = '';
    localStorage.clear();
    storage.resetAll();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // ===========================================================================
  // 1. Source soft-fail keep-sites
  // ===========================================================================

  describe('source soft-fail keep-sites', () => {
    it('keeps overlay nnnull mood toggle + nullish drag-handle || residual', () => {
      // Clear owned by undrafted q-mp-366 / older owners — pin keep-sites only.
      expect(OWL_COMPONENT_SRC).toMatch(
        /moods\.forEach\(\(mood\) => \{\s*this\.container!\.classList\.toggle/
      );
      expect(OWL_COMPONENT_SRC).toMatch(
        /target\.closest\('\.owl-character'\)\s*\|\|\s*target\.closest\('\.owl-minimized'\)/
      );
    });

    it('keeps size / viewport / parseFloat soft-default || arms', () => {
      const sizeSoft = OWL_COMPONENT_SRC.match(/\|\|\s*64/g)?.length ?? 0;
      expect(sizeSoft).toBeGreaterThanOrEqual(6);
      expect(OWL_COMPONENT_SRC).toMatch(/window\.innerWidth\s*\|\|\s*390/);
      expect(OWL_COMPONENT_SRC).toMatch(/window\.innerHeight\s*\|\|\s*844/);
      const parseSoft =
        OWL_COMPONENT_SRC.match(/parseFloat\([^)]+\)\s*\|\|\s*0/g)?.length ?? 0;
      expect(parseSoft).toBeGreaterThanOrEqual(4);
    });

    it('keeps pointer-capture try/catch + elementFromPoint typeof soft-null', () => {
      expect(OWL_COMPONENT_SRC).toMatch(
        /try\s*\{\s*this\.container\.setPointerCapture\(e\.pointerId\);\s*\}\s*catch/
      );
      expect(OWL_COMPONENT_SRC).toMatch(
        /try\s*\{\s*if\s*\(\s*this\.container\.hasPointerCapture\?\.\(e\.pointerId\)\s*\)/
      );
      expect(OWL_COMPONENT_SRC).toMatch(
        /typeof document\.elementFromPoint === 'function'\s*\?\s*document\.elementFromPoint/
      );
    });

    it('keeps ResizeObserver undefined / empty-entry soft early-returns', () => {
      expect(OWL_COMPONENT_SRC).toMatch(
        /if\s*\(\s*typeof ResizeObserver === 'undefined'\s*\)\s*\{\s*this\.refreshSizeCache\(\);\s*return;/
      );
      expect(OWL_COMPONENT_SRC).toMatch(
        /const entry = entries\[0\];\s*if\s*\(\s*!entry\s*\)\s*\{\s*return;/
      );
    });

    it('keeps optional querySelector wires + null-container soft DOMRect', () => {
      expect(OWL_COMPONENT_SRC).toMatch(
        /minimizeBtn\?\.addEventListener\('click'/
      );
      expect(OWL_COMPONENT_SRC).toMatch(
        /minimizedBtn\?\.addEventListener\('click'/
      );
      expect(OWL_COMPONENT_SRC).toMatch(
        /dismissBtn\?\.addEventListener\('click'/
      );
      expect(OWL_COMPONENT_SRC).toMatch(
        /character\?\.addEventListener\('click'/
      );
      expect(OWL_COMPONENT_SRC).toMatch(
        /if\s*\(\s*!this\.container\s*\)\s*\{\s*return new DOMRect\(0,\s*0,\s*64,\s*64\);/
      );
    });

    it('keeps owlEnabled soft-hide early-return (no mood/message work)', () => {
      expect(OWL_COMPONENT_SRC).toMatch(
        /if\s*\(\s*!settings\.owlEnabled\s*\)\s*\{\s*this\.container\.classList\.add\('owl-hidden'\);\s*return;/
      );
    });
  });

  // ===========================================================================
  // 2. Pre-init / disabled soft API residuals
  // ===========================================================================

  describe('pre-init / disabled soft API residuals', () => {
    it('pre-init destroy / snapBack / minimize / expand / isVisible soft no-op', () => {
      expect(owl.getElement()).toBeNull();
      expect(() => {
        owl.destroy();
        owl.snapBackToDock();
        owl.minimize();
        owl.expand();
      }).not.toThrow();
      expect(owl.getElement()).toBeNull();
      // Soft residual: never-mounted root is not visible.
      expect(owl.isVisible()).toBe(false);
      expect(owl.getIsDragging()).toBe(false);
      expect(owl.getDidDrag()).toBe(false);
    });

    it('owlEnabled false soft-hides without throwing on state push', () => {
      storage.updateSettings({ owlEnabled: false });
      owl.init();
      const root = owl.getElement();
      expect(root).toBeTruthy();
      expect(() => owlSystem.show()).not.toThrow();
      expect(root!.classList.contains('owl-hidden')).toBe(true);
    });
  });

  // ===========================================================================
  // 3. Nullish drag-handle residual (minimized || character)
  // ===========================================================================

  describe('nullish drag-handle residual', () => {
    it('minimized chrome is a drag handle via || soft arm', () => {
      owl.init();
      const root = owl.getElement()!;
      stubPointer(root);
      owl.minimize();
      expect(root.classList.contains('owl-minimized-state')).toBe(true);

      const mini = root.querySelector('.owl-minimized');
      expect(mini).toBeTruthy();
      dispatchPointer(mini!, 'pointerdown', { clientX: 320, clientY: 30 });
      expect(owl.getIsDragging()).toBe(true);
      expect(root.classList.contains('owl-dragging')).toBe(true);
    });

    it('bubble + controls chrome soft-reject as drag handles', () => {
      owl.init();
      const root = owl.getElement()!;
      stubPointer(root);

      const bubble = root.querySelector('.owl-bubble');
      const controls = root.querySelector('.owl-controls');
      expect(bubble).toBeTruthy();
      expect(controls).toBeTruthy();

      dispatchPointer(bubble!, 'pointerdown', { clientX: 320, clientY: 30 });
      expect(owl.getIsDragging()).toBe(false);

      dispatchPointer(controls!, 'pointerdown', { clientX: 320, clientY: 30 });
      expect(owl.getIsDragging()).toBe(false);
    });
  });

  // ===========================================================================
  // 4. Size soft-default residual (|| 64)
  // ===========================================================================

  describe('size soft-default residual', () => {
    it('zero-width/height rect soft-defaults size cache without breaking drag', () => {
      owl.init();
      const root = owl.getElement()!;
      stubPointer(root, {
        width: 0,
        height: 0,
        right: 300,
        bottom: 8,
      });

      const character = root.querySelector('.owl-character');
      expect(character).toBeTruthy();
      dispatchPointer(character!, 'pointerdown', {
        clientX: 320,
        clientY: 30,
      });
      expect(owl.getIsDragging()).toBe(true);
      // Soft residual: zero box still locks a left/top (no throw / NaN style).
      expect(root.style.left).toBe('300px');
      expect(root.style.top).toBe('8px');
      expect(root.style.left).not.toMatch(/NaN/);
      expect(root.style.top).not.toMatch(/NaN/);
    });
  });

  // ===========================================================================
  // 5. nnnull mood-toggle residual (post-guard container!)
  // ===========================================================================

  describe('nnnull mood-toggle residual', () => {
    it('mood class toggles after null-container guard (nnnull keep-site)', () => {
      owl.init();
      const root = owl.getElement()!;
      owlSystem.show();
      // speakNow stamps mood classList only — do not pin speech / aria text.
      owlSystem.speakNow('q-mp-591 mood probe', 'celebrating');
      expect(root.classList.contains('owl-mood-celebrating')).toBe(true);
      expect(root.classList.contains('owl-mood-happy')).toBe(false);

      owlSystem.speakNow('q-mp-591 mood probe 2', 'thinking');
      expect(root.classList.contains('owl-mood-thinking')).toBe(true);
      expect(root.classList.contains('owl-mood-celebrating')).toBe(false);
    });
  });

  // ===========================================================================
  // 6. Secondary / non-primary pointer soft ignores
  // ===========================================================================

  describe('pointer soft-ignore residuals', () => {
    it('non-primary + secondary-button pointerdown soft-ignore drag start', () => {
      owl.init();
      const root = owl.getElement()!;
      stubPointer(root);
      const character = root.querySelector('.owl-character')!;

      const nonPrimary = new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        pointerId: 2,
        pointerType: 'touch',
        isPrimary: false,
        button: 0,
        buttons: 1,
        clientX: 320,
        clientY: 30,
      });
      character.dispatchEvent(nonPrimary);
      expect(owl.getIsDragging()).toBe(false);

      const secondary = new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        button: 2,
        buttons: 2,
        clientX: 320,
        clientY: 30,
      });
      character.dispatchEvent(secondary);
      expect(owl.getIsDragging()).toBe(false);
    });
  });
});
